
import { supabase } from '@/integrations/supabase/client';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  location: string;
  service: string;
  barber: string;
  appointment_date: string;
  appointment_time: string;
  status: 'confirmada' | 'cancelada' | 'completada';
  price?: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  client_id: string;
  appointment_id?: string;
  amount: number;
  payment_method: string;
  payment_status: 'pendiente' | 'completado' | 'fallido';
  created_at: string;
}

export interface BonusPackage {
  id: string;
  name: string;
  services_included: number;
  price: number;
  description?: string;
  active: boolean;
  created_at: string;
}

export interface ClientBonus {
  id: string;
  client_id: string;
  bonus_package_id: string;
  services_remaining: number;
  sold_by_barber: string;
  purchase_date: string;
  status: 'activo' | 'agotado' | 'expirado';
}

export interface BonusRedemption {
  id: string;
  client_bonus_id: string;
  appointment_id: string;
  redeemed_by_barber: string;
  service_name: string;
  redemption_date: string;
}

// Funciones para clientes
export const createOrGetClient = async (name: string, phone: string, email: string): Promise<Client> => {
  // Primero intentar encontrar cliente existente por teléfono o email
  const { data: existingClient } = await supabase
    .from('clients')
    .select('*')
    .or(`phone.eq.${phone},email.eq.${email}`)
    .single();

  if (existingClient) {
    return existingClient;
  }

  // Si no existe, crear nuevo cliente
  const { data: newClient, error } = await supabase
    .from('clients')
    .insert([{ name, phone, email }])
    .select()
    .single();

  if (error) throw error;
  return newClient;
};

export const getAllClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Funciones para citas
export const createAppointment = async (appointmentData: {
  client_id: string;
  location: string;
  service: string;
  barber: string;
  appointment_date: string;
  appointment_time: string;
  price?: number;
}): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAllAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const updateAppointmentStatus = async (id: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
};

// Funciones para bonos
export const createBonusPackage = async (packageData: {
  name: string;
  services_included: number;
  price: number;
  description?: string;
}): Promise<BonusPackage> => {
  const { data, error } = await supabase
    .from('bonus_packages')
    .insert([packageData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAllBonusPackages = async (): Promise<BonusPackage[]> => {
  const { data, error } = await supabase
    .from('bonus_packages')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const sellBonus = async (bonusData: {
  client_id: string;
  bonus_package_id: string;
  services_remaining: number;
  sold_by_barber: string;
}): Promise<ClientBonus> => {
  const { data, error } = await supabase
    .from('client_bonuses')
    .insert([bonusData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getClientBonuses = async (client_id?: string): Promise<ClientBonus[]> => {
  let query = supabase.from('client_bonuses').select('*');
  
  if (client_id) {
    query = query.eq('client_id', client_id);
  }
  
  const { data, error } = await query
    .eq('status', 'activo')
    .order('purchase_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const redeemBonusService = async (redemptionData: {
  client_bonus_id: string;
  appointment_id: string;
  redeemed_by_barber: string;
  service_name: string;
}): Promise<void> => {
  const { error: redemptionError } = await supabase
    .from('bonus_redemptions')
    .insert([redemptionData]);

  if (redemptionError) throw redemptionError;

  // Reducir servicios restantes
  const { data: bonus, error: fetchError } = await supabase
    .from('client_bonuses')
    .select('services_remaining')
    .eq('id', redemptionData.client_bonus_id)
    .single();

  if (fetchError) throw fetchError;

  const newServicesRemaining = bonus.services_remaining - 1;
  const newStatus = newServicesRemaining <= 0 ? 'agotado' : 'activo';

  const { error: updateError } = await supabase
    .from('client_bonuses')
    .update({ 
      services_remaining: newServicesRemaining,
      status: newStatus 
    })
    .eq('id', redemptionData.client_bonus_id);

  if (updateError) throw updateError;
};

// Funciones para pagos
export const createPayment = async (paymentData: {
  client_id: string;
  appointment_id?: string;
  amount: number;
  payment_method: string;
  payment_status?: string;
}): Promise<Payment> => {
  const { data, error } = await supabase
    .from('payments')
    .insert([{ ...paymentData, payment_status: paymentData.payment_status || 'completado' }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getClientPayments = async (client_id: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('client_id', client_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Función para obtener datos completos de cliente con citas, bonos y pagos
export const getClientCompleteData = async (client_id: string) => {
  const [client, appointments, bonuses, payments] = await Promise.all([
    supabase.from('clients').select('*').eq('id', client_id).single(),
    supabase.from('appointments').select('*').eq('client_id', client_id).order('appointment_date', { ascending: false }),
    getClientBonuses(client_id),
    getClientPayments(client_id)
  ]);

  return {
    client: client.data,
    appointments: appointments.data || [],
    bonuses: bonuses,
    payments: payments
  };
};
