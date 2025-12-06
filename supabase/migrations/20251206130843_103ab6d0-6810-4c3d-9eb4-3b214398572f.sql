-- Eliminar el check constraint existente y crear uno nuevo que incluya 'retiro'
ALTER TABLE barbers DROP CONSTRAINT IF EXISTS barbers_location_check;

ALTER TABLE barbers ADD CONSTRAINT barbers_location_check 
CHECK (location IN ('cristobal-bordiu', 'general-pardinas', 'retiro'));

-- Agregar los dos nuevos barberos para la ubicación de Retiro
INSERT INTO barbers (name, status, location, email, phone)
VALUES 
  ('Jorge', 'active', 'retiro', NULL, NULL),
  ('Rudy', 'active', 'retiro', NULL, NULL);