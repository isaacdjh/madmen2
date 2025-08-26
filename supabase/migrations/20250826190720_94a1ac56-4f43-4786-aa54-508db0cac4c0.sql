-- Crear el tipo enum app_role si no existe
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('user', 'barber', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verificar y actualizar la tabla profiles si es necesario
DO $$
BEGIN
    -- Intentar agregar la columna role si no existe
    BEGIN
        ALTER TABLE public.profiles ADD COLUMN role app_role DEFAULT 'user'::app_role;
    EXCEPTION
        WHEN duplicate_column THEN
            -- Si la columna ya existe, asegurarse de que tenga el tipo correcto
            ALTER TABLE public.profiles ALTER COLUMN role TYPE app_role USING role::text::app_role;
    END;
END $$;