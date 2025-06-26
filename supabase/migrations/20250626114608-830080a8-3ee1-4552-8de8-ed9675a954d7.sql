
-- Agregar índices únicos para evitar duplicados de clientes
CREATE UNIQUE INDEX IF NOT EXISTS clients_phone_unique ON clients(phone);
CREATE UNIQUE INDEX IF NOT EXISTS clients_email_unique ON clients(email);

-- Agregar restricción para evitar duplicados por combinación de nombre y apellido
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_name TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS clients_name_lastname_unique ON clients(name, last_name) WHERE last_name IS NOT NULL;

-- Mejorar la tabla de appointments para incluir información del cliente
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS customer_name TEXT;  
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS customer_email TEXT;

-- Crear tabla para historial de servicios (si no existe)
CREATE TABLE IF NOT EXISTS service_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_price NUMERIC NOT NULL,
  barber_name TEXT NOT NULL,
  service_date DATE NOT NULL,
  payment_method TEXT,
  used_bonus BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mejorar la relación entre client_bonuses y bonus_packages (solo si no existen)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_client_bonuses_client_id') THEN
        ALTER TABLE client_bonuses ADD CONSTRAINT fk_client_bonuses_client_id 
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_client_bonuses_bonus_package_id') THEN
        ALTER TABLE client_bonuses ADD CONSTRAINT fk_client_bonuses_bonus_package_id 
          FOREIGN KEY (bonus_package_id) REFERENCES bonus_packages(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Crear vista para resumen completo de clientes
CREATE OR REPLACE VIEW client_complete_summary AS
SELECT 
  c.id,
  c.name,
  c.last_name,
  c.phone,
  c.email,
  c.created_at as client_since,
  COUNT(DISTINCT a.id) as total_appointments,
  COUNT(DISTINCT CASE WHEN a.status = 'completada' THEN a.id END) as completed_appointments,
  SUM(CASE WHEN cb.status = 'activo' THEN cb.services_remaining ELSE 0 END) as active_bonus_services,
  COUNT(DISTINCT cb.id) as total_bonuses_purchased,
  COALESCE(SUM(p.amount), 0) as total_spent,
  MAX(a.appointment_date) as last_visit_date
FROM clients c
LEFT JOIN appointments a ON c.id = a.client_id
LEFT JOIN client_bonuses cb ON c.id = cb.client_id
LEFT JOIN payments p ON c.id = p.client_id
GROUP BY c.id, c.name, c.last_name, c.phone, c.email, c.created_at;

-- Función corregida para buscar o crear cliente sin duplicados
CREATE OR REPLACE FUNCTION find_or_create_client(
  p_name TEXT,
  p_phone TEXT,
  p_email TEXT,
  p_last_name TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  client_id UUID;
BEGIN
  -- Buscar cliente existente por teléfono, email o nombre completo
  SELECT id INTO client_id
  FROM clients 
  WHERE phone = p_phone 
     OR email = p_email 
     OR (name = p_name AND (last_name = p_last_name OR (last_name IS NULL AND p_last_name IS NULL)))
  LIMIT 1;
  
  -- Si no existe, crear nuevo cliente
  IF client_id IS NULL THEN
    INSERT INTO clients (name, last_name, phone, email)
    VALUES (p_name, p_last_name, p_phone, p_email)
    RETURNING id INTO client_id;
  ELSE
    -- Actualizar información si es necesario
    UPDATE clients 
    SET 
      name = COALESCE(p_name, name),
      last_name = COALESCE(p_last_name, last_name),
      phone = COALESCE(p_phone, phone),
      email = COALESCE(p_email, email),
      updated_at = now()
    WHERE id = client_id;
  END IF;
  
  RETURN client_id;
END;
$$;

-- Trigger para actualizar historial de servicios cuando se completa una cita
CREATE OR REPLACE FUNCTION update_service_history()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Solo procesar cuando la cita se marca como completada
  IF NEW.status = 'completada' AND OLD.status != 'completada' THEN
    INSERT INTO service_history (
      client_id,
      appointment_id, 
      service_name,
      service_price,
      barber_name,
      service_date,
      payment_method
    ) VALUES (
      NEW.client_id,
      NEW.id,
      NEW.service,
      COALESCE(NEW.price, 0),
      NEW.barber,
      NEW.appointment_date,
      'pendiente'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Crear trigger para historial de servicios
DROP TRIGGER IF EXISTS trigger_update_service_history ON appointments;
CREATE TRIGGER trigger_update_service_history
  AFTER UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_service_history();
