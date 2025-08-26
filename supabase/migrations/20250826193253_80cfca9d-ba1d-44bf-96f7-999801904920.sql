-- Actualizar la foto de Randy Valdespino con la imagen más reciente subida
UPDATE barbers 
SET photo_url = 'https://igwshpoafqfyemultwgs.supabase.co/storage/v1/object/public/barber-photos/randy-valdespino-1756235698668.jpeg'
WHERE name ILIKE '%randy%' AND name ILIKE '%valdespino%';