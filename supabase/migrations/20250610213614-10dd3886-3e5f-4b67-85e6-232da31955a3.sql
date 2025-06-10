
-- Crear tabla de servicios en Supabase
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  duration integer NOT NULL, -- duración en minutos
  category text NOT NULL CHECK (category IN ('corte', 'barba', 'combo', 'tratamiento')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Agregar trigger para actualizar updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar servicios por defecto
INSERT INTO public.services (name, description, price, duration, category, active) VALUES
('Corte Clásico', 'Corte tradicional con tijera y máquina', 45, 45, 'corte', true),
('Arreglo de Barba', 'Perfilado y arreglo de barba', 25, 30, 'barba', true),
('Corte + Barba', 'Combo completo corte y barba', 65, 75, 'combo', true),
('Afeitado Tradicional', 'Afeitado clásico con navaja', 35, 45, 'barba', true),
('Tratamientos Especiales', 'Tratamientos capilares y faciales', 40, 60, 'tratamiento', true);
