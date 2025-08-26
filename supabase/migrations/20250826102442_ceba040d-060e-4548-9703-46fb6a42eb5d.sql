-- Fix security issue: Restrict customer purchase history access to authorized staff only

-- Drop existing permissive policies for client_bonuses
DROP POLICY IF EXISTS "Allow all operations on client_bonuses" ON public.client_bonuses;

-- Create secure policies for client_bonuses table
CREATE POLICY "Admin and barbers can view all client bonuses" 
ON public.client_bonuses 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

CREATE POLICY "Admin and barbers can create client bonuses" 
ON public.client_bonuses 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

CREATE POLICY "Admin and barbers can update client bonuses" 
ON public.client_bonuses 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

CREATE POLICY "Admin and barbers can delete client bonuses" 
ON public.client_bonuses 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

-- Drop existing permissive policies for bonus_redemptions
DROP POLICY IF EXISTS "Allow all operations on bonus_redemptions" ON public.bonus_redemptions;

-- Create secure policies for bonus_redemptions table
CREATE POLICY "Admin and barbers can view all bonus redemptions" 
ON public.bonus_redemptions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

CREATE POLICY "Admin and barbers can create bonus redemptions" 
ON public.bonus_redemptions 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

CREATE POLICY "Admin and barbers can update bonus redemptions" 
ON public.bonus_redemptions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

CREATE POLICY "Admin and barbers can delete bonus redemptions" 
ON public.bonus_redemptions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));