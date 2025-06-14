
-- Create only the missing policies that are needed
-- Try to create the barbers policy if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'barbers' 
        AND policyname = 'Allow all operations on barbers'
    ) THEN
        CREATE POLICY "Allow all operations on barbers" ON public.barbers
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- Try to create the barber_schedules policy if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'barber_schedules' 
        AND policyname = 'Allow all operations on barber_schedules'
    ) THEN
        CREATE POLICY "Allow all operations on barber_schedules" ON public.barber_schedules
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- Try to create the blocked_slots policy if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blocked_slots' 
        AND policyname = 'Allow all operations on blocked_slots'
    ) THEN
        CREATE POLICY "Allow all operations on blocked_slots" ON public.blocked_slots
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- Try to create other missing policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'clients' 
        AND policyname = 'Allow all operations on clients'
    ) THEN
        CREATE POLICY "Allow all operations on clients" ON public.clients
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bonus_packages' 
        AND policyname = 'Allow all operations on bonus_packages'
    ) THEN
        CREATE POLICY "Allow all operations on bonus_packages" ON public.bonus_packages
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'client_bonuses' 
        AND policyname = 'Allow all operations on client_bonuses'
    ) THEN
        CREATE POLICY "Allow all operations on client_bonuses" ON public.client_bonuses
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bonus_redemptions' 
        AND policyname = 'Allow all operations on bonus_redemptions'
    ) THEN
        CREATE POLICY "Allow all operations on bonus_redemptions" ON public.bonus_redemptions
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payments' 
        AND policyname = 'Allow all operations on payments'
    ) THEN
        CREATE POLICY "Allow all operations on payments" ON public.payments
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'services' 
        AND policyname = 'Allow all operations on services'
    ) THEN
        CREATE POLICY "Allow all operations on services" ON public.services
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' 
        AND policyname = 'Allow all operations on products'
    ) THEN
        CREATE POLICY "Allow all operations on products" ON public.products
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;
