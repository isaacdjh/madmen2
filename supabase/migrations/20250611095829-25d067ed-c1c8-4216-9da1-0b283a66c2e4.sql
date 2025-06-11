
-- Crear tabla de productos en Supabase
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  category text NOT NULL CHECK (category IN ('pomada', 'shampoo', 'aceite', 'accesorio', 'cera', 'pasta', 'acabado', 'cuidado', 'otros')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Agregar trigger para actualizar updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar productos por defecto (basados en ProductsSection)
INSERT INTO public.products (name, description, price, stock, category, active) VALUES
-- Pomadas STMNT
('Classic Pomade', 'Pomada clásica para estilos tradicionales', 23, 50, 'pomada', true),
('Fiber Pomade', 'Pomada con fibra para mayor textura', 23, 45, 'pomada', true),

-- Ceras y Pastas STMNT
('Cera en Polvo', 'Volumen y textura instantánea', 23, 30, 'cera', true),
('Matte Paste', 'Acabado mate con fijación fuerte', 23, 35, 'pasta', true),
('Shine Paste', 'Brillo natural con control', 23, 40, 'pasta', true),
('Dry Clay', 'Arcilla seca para acabado mate', 23, 25, 'pasta', true),

-- Productos de Acabado STMNT
('Laca Hair Spray', 'Fijación duradera en spray', 19.60, 60, 'acabado', true),
('Spray de Peinado', 'Para peinar y fijar el cabello', 23, 55, 'acabado', true),
('Polvo en Spray', 'Volumen y textura en spray', 23, 40, 'acabado', true),

-- Cuidado Capilar STMNT
('Champú', 'Limpieza profunda diaria', 18.90, 70, 'cuidado', true),
('Champú Todo-en-1', 'Champú y acondicionador', 18.90, 65, 'cuidado', true),
('Acondicionador', 'Hidratación y suavidad', 18.90, 60, 'cuidado', true),
('Champú Hydro', 'Hidratación intensiva', 18.90, 55, 'cuidado', true),

-- Otros Productos STMNT
('Aceite de Barba', 'Cuidado y brillo para la barba', 23, 35, 'aceite', true),
('Champú Sólido', 'Champú ecológico en barra', 12.50, 80, 'otros', true),
('Spray de Definición', 'Define y controla el peinado', 22.80, 45, 'acabado', true),
('Gel', 'Fijación fuerte con brillo', 19.60, 50, 'otros', true),
('Crema de Rizos', 'Define y controla los rizos', 19.60, 30, 'otros', true),
('Serum', 'Tratamiento intensivo capilar', 18.90, 40, 'cuidado', true);
