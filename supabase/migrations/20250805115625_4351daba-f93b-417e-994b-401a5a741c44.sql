-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'barber', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  role app_role NOT NULL DEFAULT 'user',
  location TEXT DEFAULT 'cristobal-bordiu',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table for additional role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id AND role = _role
  ) OR EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid()
  UNION ALL
  SELECT role FROM public.user_roles WHERE user_id = auth.uid()
  ORDER BY 1 DESC
  LIMIT 1;
$$;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for user_roles
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    CASE 
      WHEN NEW.email LIKE '%@madmenbarberia.com' THEN 'admin'::app_role
      ELSE 'user'::app_role
    END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on service_history table (CRITICAL FIX)
ALTER TABLE public.service_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for service_history
CREATE POLICY "Users can view their own service history"
ON public.service_history
FOR SELECT
TO authenticated
USING (
  client_id IN (
    SELECT id FROM public.clients 
    WHERE email = (SELECT email FROM public.profiles WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Barbers can view service history for their location"
ON public.service_history
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'barber') OR 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Barbers can insert service history"
ON public.service_history
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'barber') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Fix search_path in existing functions
CREATE OR REPLACE FUNCTION public.process_sale_transaction(
  p_appointment_id UUID, 
  p_amount NUMERIC, 
  p_payment_received NUMERIC, 
  p_change_given JSONB, 
  p_location TEXT DEFAULT 'cristobal-bordiu', 
  p_barber_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  entry_id UUID;
  change_item JSONB;
  denomination_record RECORD;
BEGIN
  -- Create sale entry
  INSERT INTO cash_register_entries (
    entry_type,
    amount,
    description,
    appointment_id,
    barber_name,
    location
  ) VALUES (
    'sale',
    p_amount,
    'Venta de servicio',
    p_appointment_id,
    p_barber_name,
    p_location
  ) RETURNING id INTO entry_id;
  
  -- Process change
  FOR change_item IN SELECT * FROM jsonb_array_elements(p_change_given)
  LOOP
    SELECT * INTO denomination_record 
    FROM denominations 
    WHERE value = (change_item->>'value')::DECIMAL;
    
    IF denomination_record.id IS NOT NULL THEN
      INSERT INTO change_given (
        cash_register_entry_id,
        denomination_id,
        quantity
      ) VALUES (
        entry_id,
        denomination_record.id,
        (change_item->>'quantity')::INTEGER
      );
      
      INSERT INTO cash_register_state (denomination_id, quantity, location)
      VALUES (denomination_record.id, -(change_item->>'quantity')::INTEGER, p_location)
      ON CONFLICT (denomination_id, location)
      DO UPDATE SET 
        quantity = cash_register_state.quantity - (change_item->>'quantity')::INTEGER,
        updated_at = now();
    END IF;
  END LOOP;
  
  RETURN entry_id;
END;
$$;

-- Update find_or_create_client function with proper search_path
CREATE OR REPLACE FUNCTION public.find_or_create_client(
  p_name TEXT, 
  p_phone TEXT, 
  p_email TEXT, 
  p_last_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  client_id UUID;
BEGIN
  SELECT id INTO client_id
  FROM clients 
  WHERE phone = p_phone 
     OR email = p_email 
     OR (name = p_name AND (last_name = p_last_name OR (last_name IS NULL AND p_last_name IS NULL)))
  LIMIT 1;
  
  IF client_id IS NULL THEN
    INSERT INTO clients (name, last_name, phone, email)
    VALUES (p_name, p_last_name, p_phone, p_email)
    RETURNING id INTO client_id;
  ELSE
    UPDATE clients 
    SET 
      name = COALESCE(p_name, name),
      last_name = COALESCE(p_last_name, last_name),
      phone = COALESCE(p_phone, phone),
      email = COALESCE(p_email, email),
      updated_at = now()
    WHERE id = client_id;
  END IF;
  
  RETURN client_id;
END;
$$;