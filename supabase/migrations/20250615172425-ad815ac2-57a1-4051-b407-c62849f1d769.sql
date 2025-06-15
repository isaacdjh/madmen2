
-- Crear bucket para fotos de barberos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('barber-photos', 'barber-photos', true);

-- Crear políticas para el bucket de fotos de barberos
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'barber-photos');

CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'barber-photos');

CREATE POLICY "Allow authenticated users to update" ON storage.objects
FOR UPDATE USING (bucket_id = 'barber-photos');

CREATE POLICY "Allow authenticated users to delete" ON storage.objects
FOR DELETE USING (bucket_id = 'barber-photos');

-- Agregar columna photo_url a la tabla barbers
ALTER TABLE barbers ADD COLUMN photo_url TEXT;
