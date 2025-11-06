-- Actualizar precios de servicios principales 2025
UPDATE services SET price = 20.99 WHERE id = '622916c5-a99d-44e1-8e5d-6c70ffa0814e'; -- Corte de pelo
UPDATE services SET price = 35.50 WHERE id = '26bc1603-4fcb-4fa5-b998-9a7d4439f836'; -- Corte + barba
UPDATE services SET price = 17 WHERE id = '91308d1d-3643-479f-a33e-928fee13f97f'; -- Arreglo de barba
UPDATE services SET price = 28.50 WHERE id = '99a51777-2abc-4fbf-b4ea-fa2f79e1d178'; -- Rapado + barba

-- Actualizar servicios complementarios 2025
UPDATE services SET price = 14 WHERE id = '16715765-b810-49a7-a7dd-475f9f13ac61'; -- Corte infantil
UPDATE services SET price = 14 WHERE id = 'd4c96e6a-d744-45e2-a000-a28cf6a6f250'; -- Corte jubilado
UPDATE services SET price = 17 WHERE id = 'ed02bca2-b570-4384-9261-2e61b89895d6'; -- Rapado solo
UPDATE services SET price = 14 WHERE id = '11e14ccb-716a-41d9-ba76-1315e5a218e2'; -- Mascarilla facial