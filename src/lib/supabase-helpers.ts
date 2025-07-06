
import { supabase } from '@/integrations/supabase/client';

export interface Appointment {
  id: string;
  client_id?: string;
  appointment_date: string;
  appointment_time: string;
  service: string;
  barber: string;
  location: string;
  status: 'confirmada' | 'completada' | 'cancelada';
  price?: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  last_name?: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface BonusPackage {
  id: string;
  name: string;
  services_included: number;
  price: number;
  active: boolean;
  description?: string;
  created_at: string;
}

export interface ClientBonus {
  id: string;
  client_id: string;
  bonus_package_id: string;
  services_remaining: number;
  purchase_date: string;
  status: 'activo' | 'agotado' | 'vencido';
  sold_by_barber: string;
}

export interface BonusRedemption {
  id: string;
  client_bonus_id: string;
  appointment_id?: string;
  service_name: string;
  redeemed_by_barber: string;
  redemption_date: string;
}

export interface Payment {
  id: string;
  client_id: string;
  appointment_id?: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

export interface Barber {
  id: string;
  name: string;
  location?: string;
  status: 'active' | 'inactive';
  phone?: string;
  email?: string;
  photo_url?: string | null;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BarberSchedule {
  id: string;
  barber_id: string;
  day_of_week: string;
  is_working: boolean;
  start_time?: string;
  end_time?: string;
  break_start?: string;
  break_end?: string;
  created_at: string;
  updated_at: string;
}

export interface BlockedSlot {
  id: string;
  barber_id: string;
  blocked_date: string;
  blocked_time: string;
  reason?: string;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: 'corte' | 'barba' | 'combo' | 'tratamiento';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: 'pomada' | 'shampoo' | 'aceite' | 'accesorio' | 'cera' | 'pasta' | 'acabado' | 'cuidado' | 'otros';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const getAllAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  if (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }

  return (data || []).map(appointment => ({
    ...appointment,
    status: appointment.status as 'confirmada' | 'completada' | 'cancelada'
  }));
};

export const getAllBonusPackages = async (): Promise<BonusPackage[]> => {
  const { data, error } = await supabase
    .from('bonus_packages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bonus packages:', error);
    throw error;
  }

  return data || [];
};

export const getClientBonuses = async (): Promise<ClientBonus[]> => {
  const { data, error } = await supabase
    .from('client_bonuses')
    .select('*')
    .order('purchase_date', { ascending: false });

  if (error) {
    console.error('Error fetching client bonuses:', error);
    throw error;
  }

  return (data || []).map(bonus => ({
    ...bonus,
    status: bonus.status as 'activo' | 'agotado' | 'vencido'
  }));
};

export const getAllClients = async (): Promise<any[]> => {
  console.log('Cargando clientes desde la base de datos...');
  
  // Primero consultar directamente la tabla clients
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000); // Temporal para debugging

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }

  console.log(`Clientes cargados: ${data?.length || 0}`);
  
  // Mapear los datos para compatibilidad con ClientManagement
  return (data || []).map(client => ({
    ...client,
    client_since: client.created_at,
    total_appointments: 0,
    completed_appointments: 0,
    active_bonus_services: 0,
    total_bonuses_purchased: 0,
    total_spent: 0
  }));
};

export const getAllBarbers = async (): Promise<Barber[]> => {
  const { data, error } = await supabase
    .from('barbers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching barbers:', error);
    throw error;
  }

  return (data || []).map(barber => ({
    ...barber,
    status: barber.status as 'active' | 'inactive'
  }));
};

export const getBarbersWithSchedules = async (location?: string): Promise<(Barber & { schedules: BarberSchedule[] })[]> => {
  let query = supabase
    .from('barbers')
    .select(`
      *,
      schedules:barber_schedules(*)
    `);

  if (location) {
    query = query.eq('location', location);
  }

  const { data, error } = await query.order('name', { ascending: true });

  if (error) {
    console.error('Error fetching barbers with schedules:', error);
    throw error;
  }

  return (data || []).map(barber => ({
    ...barber,
    status: barber.status as 'active' | 'inactive'
  }));
};

export const getBlockedSlots = async (): Promise<BlockedSlot[]> => {
  const { data, error } = await supabase
    .from('blocked_slots')
    .select('*')
    .order('blocked_date', { ascending: true })
    .order('blocked_time', { ascending: true });

  if (error) {
    console.error('Error fetching blocked slots:', error);
    throw error;
  }

  return data || [];
};

export const createBlockedSlot = async (slotData: Omit<BlockedSlot, 'id' | 'created_at'>): Promise<void> => {
  const { error } = await supabase
    .from('blocked_slots')
    .insert(slotData);

  if (error) {
    console.error('Error creating blocked slot:', error);
    throw error;
  }
};

export const deleteBlockedSlot = async (barberId: string, date: string, time: string): Promise<void> => {
  const { error } = await supabase
    .from('blocked_slots')
    .delete()
    .eq('barber_id', barberId)
    .eq('blocked_date', date)
    .eq('blocked_time', time);

  if (error) {
    console.error('Error deleting blocked slot:', error);
    throw error;
  }
};

export const updateAppointmentStatus = async (appointmentId: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId);

  if (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> => {
  // Buscar o crear cliente si tiene información de contacto
  let clientId = appointmentData.client_id;
  
  if (!clientId && appointmentData.customer_name && appointmentData.customer_phone && appointmentData.customer_email) {
    console.log('Creating/finding client for appointment');
    const { data: foundClientId, error: clientError } = await supabase
      .rpc('find_or_create_client', {
        p_name: appointmentData.customer_name,
        p_phone: appointmentData.customer_phone,
        p_email: appointmentData.customer_email
      });

    if (clientError) {
      console.error('Error finding/creating client:', clientError);
    } else {
      clientId = foundClientId;
    }
  }

  const finalAppointmentData = {
    ...appointmentData,
    client_id: clientId
  };

  const { data, error } = await supabase
    .from('appointments')
    .insert(finalAppointmentData)
    .select()
    .single();

  if (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }

  return {
    ...data,
    status: data.status as 'confirmada' | 'completada' | 'cancelada'
  };
};

export const createBarber = async (barberData: Omit<Barber, 'id' | 'created_at' | 'updated_at'>): Promise<Barber> => {
  const { data, error } = await supabase
    .from('barbers')
    .insert(barberData)
    .select()
    .single();

  if (error) {
    console.error('Error creating barber:', error);
    throw error;
  }

  return {
    ...data,
    status: data.status as 'active' | 'inactive'
  };
};

export const updateBarber = async (id: string, barberData: Partial<Omit<Barber, 'id' | 'created_at' | 'updated_at'>>): Promise<void> => {
  const { error } = await supabase
    .from('barbers')
    .update(barberData)
    .eq('id', id);

  if (error) {
    console.error('Error updating barber:', error);
    throw error;
  }
};

export const deleteBarber = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('barbers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting barber:', error);
    throw error;
  }
};

export const upsertBarberSchedule = async (scheduleData: Omit<BarberSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
  const { error } = await supabase
    .from('barber_schedules')
    .upsert(scheduleData, {
      onConflict: 'barber_id,day_of_week'
    });

  if (error) {
    console.error('Error upserting barber schedule:', error);
    throw error;
  }
};

export const createBonusPackage = async (packageData: Omit<BonusPackage, 'id' | 'created_at'>): Promise<BonusPackage> => {
  const { data, error } = await supabase
    .from('bonus_packages')
    .insert(packageData)
    .select()
    .single();

  if (error) {
    console.error('Error creating bonus package:', error);
    throw error;
  }

  return data;
};

export const getClientCompleteData = async (clientId: string) => {
  try {
    // Obtener datos del cliente
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (clientError) throw clientError;

    // Obtener citas del cliente
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('client_id', clientId)
      .order('appointment_date', { ascending: false });

    if (appointmentsError) throw appointmentsError;

    // Obtener bonos del cliente
    const { data: bonuses, error: bonusesError } = await supabase
      .from('client_bonuses')
      .select('*')
      .eq('client_id', clientId)
      .order('purchase_date', { ascending: false });

    if (bonusesError) throw bonusesError;

    // Obtener pagos del cliente
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (paymentsError) throw paymentsError;

    return {
      client,
      appointments: (appointments || []).map(appointment => ({
        ...appointment,
        status: appointment.status as 'confirmada' | 'completada' | 'cancelada'
      })),
      bonuses: (bonuses || []).map(bonus => ({
        ...bonus,
        status: bonus.status as 'activo' | 'agotado' | 'vencido'
      })),
      payments: payments || []
    };
  } catch (error) {
    console.error('Error fetching client complete data:', error);
    throw error;
  }
};

export const createOrGetClient = async (name: string, phone: string, email: string): Promise<Client> => {
  // Usar la función de base de datos para buscar o crear cliente
  const { data: clientId, error: functionError } = await supabase
    .rpc('find_or_create_client', {
      p_name: name,
      p_phone: phone,
      p_email: email
    });

  if (functionError) {
    console.error('Error finding/creating client:', functionError);
    throw functionError;
  }

  // Obtener los datos completos del cliente
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (clientError) {
    console.error('Error fetching client data:', clientError);
    throw clientError;
  }

  return client;
};

export const sellBonus = async (bonusData: Omit<ClientBonus, 'id' | 'purchase_date'>): Promise<void> => {
  const { error } = await supabase
    .from('client_bonuses')
    .insert(bonusData);

  if (error) {
    console.error('Error selling bonus:', error);
    throw error;
  }
};

export const redeemBonusService = async (redemptionData: Omit<BonusRedemption, 'id' | 'redemption_date'>): Promise<void> => {
  const { data: bonus, error: bonusError } = await supabase
    .from('client_bonuses')
    .select('services_remaining')
    .eq('id', redemptionData.client_bonus_id)
    .single();

  if (bonusError) {
    console.error('Error fetching bonus:', bonusError);
    throw bonusError;
  }

  if (!bonus || bonus.services_remaining <= 0) {
    throw new Error('No hay servicios disponibles en este bono');
  }

  // Reducir servicios restantes
  const newServicesRemaining = bonus.services_remaining - 1;
  const newStatus = newServicesRemaining === 0 ? 'agotado' : 'activo';

  const { error: updateError } = await supabase
    .from('client_bonuses')
    .update({ 
      services_remaining: newServicesRemaining,
      status: newStatus
    })
    .eq('id', redemptionData.client_bonus_id);

  if (updateError) {
    console.error('Error updating bonus:', updateError);
    throw updateError;
  }

  // Registrar el canje
  const { error: redemptionError } = await supabase
    .from('bonus_redemptions')
    .insert(redemptionData);

  if (redemptionError) {
    console.error('Error creating redemption:', redemptionError);
    throw redemptionError;
  }
};

export const createPayment = async (paymentData: Omit<Payment, 'id' | 'created_at'>): Promise<void> => {
  const { error } = await supabase
    .from('payments')
    .insert(paymentData);

  if (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const getClientActiveBonuses = async (clientId: string): Promise<ClientBonus[]> => {
  const { data, error } = await supabase
    .from('client_bonuses')
    .select('*')
    .eq('client_id', clientId)
    .eq('status', 'activo')
    .gt('services_remaining', 0)
    .order('purchase_date', { ascending: false });

  if (error) {
    console.error('Error fetching client bonuses:', error);
    throw error;
  }

  return (data || []).map(bonus => ({
    ...bonus,
    status: bonus.status as 'activo' | 'agotado' | 'vencido'
  }));
};

export const getAllServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }

  return (data || []).map(service => ({
    ...service,
    category: service.category as 'corte' | 'barba' | 'combo' | 'tratamiento'
  }));
};

export const createService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> => {
  const { data, error } = await supabase
    .from('services')
    .insert(serviceData)
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    throw error;
  }

  return {
    ...data,
    category: data.category as 'corte' | 'barba' | 'combo' | 'tratamiento'
  };
};

export const updateService = async (id: string, serviceData: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>): Promise<void> => {
  const { error } = await supabase
    .from('services')
    .update(serviceData)
    .eq('id', id);

  if (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return (data || []).map(product => ({
    ...product,
    category: product.category as 'pomada' | 'shampoo' | 'aceite' | 'accesorio' | 'cera' | 'pasta' | 'acabado' | 'cuidado' | 'otros'
  }));
};

export const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return {
    ...data,
    category: data.category as 'pomada' | 'shampoo' | 'aceite' | 'accesorio' | 'cera' | 'pasta' | 'acabado' | 'cuidado' | 'otros'
  };
};

export const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
