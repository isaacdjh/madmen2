-- Crear tabla para denominaciones de billetes y monedas
CREATE TABLE public.denominations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  value DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bill', 'coin')),
  currency TEXT NOT NULL DEFAULT 'EUR',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para el estado actual de la caja
CREATE TABLE public.cash_register_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  denomination_id UUID NOT NULL REFERENCES public.denominations(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  location TEXT NOT NULL DEFAULT 'cristobal-bordiu',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(denomination_id, location)
);

-- Crear tabla para movimientos de caja
CREATE TABLE public.cash_register_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('sale', 'opening', 'closing', 'adjustment', 'expense')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  appointment_id UUID REFERENCES public.appointments(id),
  payment_id UUID REFERENCES public.payments(id),
  barber_name TEXT,
  location TEXT NOT NULL DEFAULT 'cristobal-bordiu',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT
);

-- Crear tabla para cambios dados
CREATE TABLE public.change_given (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cash_register_entry_id UUID NOT NULL REFERENCES public.cash_register_entries(id) ON DELETE CASCADE,
  denomination_id UUID NOT NULL REFERENCES public.denominations(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.denominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_register_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_register_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_given ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS (permitir todas las operaciones por ahora)
CREATE POLICY "Allow all operations on denominations" ON public.denominations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on cash_register_state" ON public.cash_register_state FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on cash_register_entries" ON public.cash_register_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on change_given" ON public.change_given FOR ALL USING (true) WITH CHECK (true);

-- Insertar denominaciones estándar de Euro
INSERT INTO public.denominations (value, type, currency) VALUES
(500.00, 'bill', 'EUR'),
(200.00, 'bill', 'EUR'),
(100.00, 'bill', 'EUR'),
(50.00, 'bill', 'EUR'),
(20.00, 'bill', 'EUR'),
(10.00, 'bill', 'EUR'),
(5.00, 'bill', 'EUR'),
(2.00, 'coin', 'EUR'),
(1.00, 'coin', 'EUR'),
(0.50, 'coin', 'EUR'),
(0.20, 'coin', 'EUR'),
(0.10, 'coin', 'EUR'),
(0.05, 'coin', 'EUR'),
(0.02, 'coin', 'EUR'),
(0.01, 'coin', 'EUR');

-- Crear función para actualizar estado de caja automáticamente
CREATE OR REPLACE FUNCTION update_cash_register_state()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar el updated_at cuando se modifica una fila
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar timestamp
CREATE TRIGGER update_cash_register_state_updated_at
  BEFORE UPDATE ON public.cash_register_state
  FOR EACH ROW
  EXECUTE FUNCTION update_cash_register_state();

-- Crear función para procesar venta y actualizar caja
CREATE OR REPLACE FUNCTION process_sale_transaction(
  p_appointment_id UUID,
  p_amount DECIMAL(10,2),
  p_payment_received DECIMAL(10,2),
  p_change_given JSONB,
  p_location TEXT DEFAULT 'cristobal-bordiu',
  p_barber_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  entry_id UUID;
  change_item JSONB;
  denomination_record RECORD;
BEGIN
  -- Crear entrada de venta en caja
  INSERT INTO public.cash_register_entries (
    entry_type,
    amount,
    description,
    appointment_id,
    barber_name,
    location
  ) VALUES (
    'sale',
    p_amount,
    'Venta de servicio',
    p_appointment_id,
    p_barber_name,
    p_location
  ) RETURNING id INTO entry_id;
  
  -- Procesar cambio dado (restar del estado de caja)
  FOR change_item IN SELECT * FROM jsonb_array_elements(p_change_given)
  LOOP
    -- Obtener la denominación
    SELECT * INTO denomination_record 
    FROM public.denominations 
    WHERE value = (change_item->>'value')::DECIMAL;
    
    IF denomination_record.id IS NOT NULL THEN
      -- Registrar el cambio dado
      INSERT INTO public.change_given (
        cash_register_entry_id,
        denomination_id,
        quantity
      ) VALUES (
        entry_id,
        denomination_record.id,
        (change_item->>'quantity')::INTEGER
      );
      
      -- Actualizar estado de caja (restar cantidad)
      INSERT INTO public.cash_register_state (denomination_id, quantity, location)
      VALUES (denomination_record.id, -(change_item->>'quantity')::INTEGER, p_location)
      ON CONFLICT (denomination_id, location)
      DO UPDATE SET 
        quantity = cash_register_state.quantity - (change_item->>'quantity')::INTEGER,
        updated_at = now();
    END IF;
  END LOOP;
  
  RETURN entry_id;
END;
$$ LANGUAGE plpgsql;