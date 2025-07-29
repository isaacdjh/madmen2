-- Eliminar todos los servicios existentes
DELETE FROM services;

-- Insertar todos los servicios de MAD MEN Barbería Tradicional
INSERT INTO services (name, category, description, duration, price, active) VALUES
('Corte de pelo', 'corte', 'Corte de pelo profesional', 30, 19, true),
('Arreglo de barba', 'barba', 'Arreglo y perfilado de barba', 30, 16, true),
('Corte + barba', 'combo', 'Corte de pelo y arreglo de barba', 60, 32, true),
('Corte infantil (hasta 12 años)', 'corte', 'Corte especial para niños hasta 12 años', 30, 13, true),
('Corte jubilado (65+)', 'corte', 'Corte especial para personas mayores de 65 años', 30, 13, true),
('Rapado / afeitado cabeza', 'corte', 'Rapado completo o afeitado de cabeza', 30, 16, true),
('Rapado + barba', 'combo', 'Rapado de cabeza y arreglo de barba', 60, 27, true),
('Depilación cejas (cuchilla)', 'depilacion', 'Depilación de cejas con cuchilla', 5, 5, true),
('Depilación nariz', 'depilacion', 'Depilación de vellos nasales', 5, 5, true),
('Depilación oído', 'depilacion', 'Depilación de vellos del oído', 5, 5, true),
('Mascarilla facial (black mask)', 'facial', 'Mascarilla facial purificante black mask', 30, 12, true),
('Mascarilla facial VIP (colágeno)', 'facial', 'Mascarilla facial premium con colágeno', 30, 20, true),
('Mascarilla hidratante', 'facial', 'Mascarilla facial hidratante', 15, 8, true),
('Tinte barba', 'barba', 'Tinte profesional para barba', 30, 25, true),
('Tinte pelo estándar', 'tinte', 'Tinte estándar para cabello', 60, 35, true),
('Tinte fantasía', 'tinte', 'Tinte de colores fantasía', 240, 90, true),
('Lavar y peinar', 'lavado', 'Lavado y peinado profesional', 15, 11, true);