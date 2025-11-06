-- Actualizar bono existente de corte de pelo
UPDATE bonus_packages SET price = 68 WHERE id = '709d9fed-a35a-4682-904f-239c6ed99a32';

-- Crear bonos nuevos de 3 servicios
INSERT INTO bonus_packages (name, description, services_included, price, active) VALUES
  ('Bono 3 Cortes', 'Bono de 3 cortes de pelo', 3, 54, true),
  ('Bono 3 Corte+Barba', 'Bono de 3 servicios de corte + barba', 3, 91, true),
  ('Bono 3 Arreglo Barba', 'Bono de 3 arreglos de barba', 3, 44, true),
  ('Bono 3 Rapado+Barba', 'Bono de 3 servicios de rapado + barba', 3, 73, true);

-- Crear bonos nuevos de 4 servicios
INSERT INTO bonus_packages (name, description, services_included, price, active) VALUES
  ('Bono 4 Corte+Barba', 'Bono de 4 servicios de corte + barba', 4, 115, true),
  ('Bono 4 Arreglo Barba', 'Bono de 4 arreglos de barba', 4, 55, true),
  ('Bono 4 Rapado+Barba', 'Bono de 4 servicios de rapado + barba', 4, 92, true);