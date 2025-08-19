-- Permitir lectura pública de barberos para el sitio web del cliente
DROP POLICY IF EXISTS "Allow all operations on barbers" ON barbers;

CREATE POLICY "Public can view active barbers" 
ON barbers FOR SELECT 
USING (status = 'active');

CREATE POLICY "Admins and barbers can manage barbers" 
ON barbers FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

-- Permitir lectura pública de servicios activos
DROP POLICY IF EXISTS "Allow all operations on services" ON services;

CREATE POLICY "Public can view active services" 
ON services FOR SELECT 
USING (active = true);

CREATE POLICY "Admins and barbers can manage services" 
ON services FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

-- Permitir lectura pública de productos activos
DROP POLICY IF EXISTS "Allow all operations on products" ON products;

CREATE POLICY "Public can view active products" 
ON products FOR SELECT 
USING (active = true);

CREATE POLICY "Admins and barbers can manage products" 
ON products FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

-- Permitir lectura pública de paquetes de bonos activos
DROP POLICY IF EXISTS "Allow all operations on bonus_packages" ON bonus_packages;

CREATE POLICY "Public can view active bonus packages" 
ON bonus_packages FOR SELECT 
USING (active = true);

CREATE POLICY "Admins and barbers can manage bonus packages" 
ON bonus_packages FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

-- Mantener acceso restringido a clientes (solo admins y barberos)
DROP POLICY IF EXISTS "Allow all operations on clients" ON clients;

CREATE POLICY "Admins and barbers can view clients" 
ON clients FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

CREATE POLICY "Admins and barbers can manage clients" 
ON clients FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

-- Permitir creación pública de citas (para reservas del sitio web)
DROP POLICY IF EXISTS "Allow all operations on appointments" ON appointments;

CREATE POLICY "Public can create appointments" 
ON appointments FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins and barbers can view all appointments" 
ON appointments FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

CREATE POLICY "Admins and barbers can update appointments" 
ON appointments FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));

CREATE POLICY "Admins and barbers can delete appointments" 
ON appointments FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'barber'::app_role));