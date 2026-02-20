
-- Fix cash register and payments RLS policies

-- 1. Denominations: public read, staff write
DROP POLICY IF EXISTS "Allow all operations on denominations" ON public.denominations;
CREATE POLICY "Public can view denominations" ON public.denominations FOR SELECT USING (true);
CREATE POLICY "Staff can manage denominations" ON public.denominations FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

-- 2. Cash register state: staff only
DROP POLICY IF EXISTS "Allow all operations on cash_register_state" ON public.cash_register_state;
CREATE POLICY "Staff can access cash register state" ON public.cash_register_state FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

-- 3. Cash register entries: staff only
DROP POLICY IF EXISTS "Allow all operations on cash_register_entries" ON public.cash_register_entries;
CREATE POLICY "Staff can access cash register entries" ON public.cash_register_entries FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

-- 4. Change given: staff only
DROP POLICY IF EXISTS "Allow all operations on change_given" ON public.change_given;
CREATE POLICY "Staff can access change given" ON public.change_given FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

-- 5. Payments: staff only
DROP POLICY IF EXISTS "Allow all operations on payments" ON public.payments;
CREATE POLICY "Staff can view payments" ON public.payments FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));
CREATE POLICY "Staff can create payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));
CREATE POLICY "Staff can update payments" ON public.payments FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));
CREATE POLICY "Staff can delete payments" ON public.payments FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));
