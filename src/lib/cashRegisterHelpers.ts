import { supabase } from "@/integrations/supabase/client";

export interface Denomination {
  id: string;
  value: number;
  type: 'bill' | 'coin';
  currency: string;
  active: boolean;
}

export interface CashRegisterState {
  id: string;
  denomination_id: string;
  quantity: number;
  location: string;
  denomination: Denomination;
}

export interface CashRegisterEntry {
  id: string;
  entry_type: 'sale' | 'opening' | 'closing' | 'adjustment' | 'expense';
  amount: number;
  description?: string;
  appointment_id?: string;
  payment_id?: string;
  barber_name?: string;
  location: string;
  created_at: string;
  created_by?: string;
}

export interface ChangeCalculation {
  denomination: Denomination;
  quantity: number;
}

// Obtener todas las denominaciones activas
export async function getDenominations(): Promise<Denomination[]> {
  const { data, error } = await supabase
    .from('denominations')
    .select('*')
    .eq('active', true)
    .order('value', { ascending: false });

  if (error) {
    console.error('Error fetching denominations:', error);
    throw error;
  }

  return (data || []) as Denomination[];
}

// Obtener estado actual de caja por ubicación
export async function getCashRegisterState(location: string): Promise<CashRegisterState[]> {
  const { data, error } = await supabase
    .from('cash_register_state')
    .select(`
      *,
      denominations:denomination_id (*)
    `)
    .eq('location', location);

  if (error) {
    console.error('Error fetching cash register state:', error);
    throw error;
  }

  return data?.map(item => ({
    ...item,
    denomination: item.denominations as Denomination
  })) || [];
}

// Calcular cambio óptimo
export function calculateOptimalChange(
  changeAmount: number,
  availableCash: CashRegisterState[]
): ChangeCalculation[] {
  const result: ChangeCalculation[] = [];
  let remaining = Math.round(changeAmount * 100); // Trabajar en centavos para evitar problemas de precisión

  // Ordenar denominaciones de mayor a menor
  const sortedDenominations = availableCash
    .filter(item => item.quantity > 0)
    .sort((a, b) => b.denomination.value - a.denomination.value);

  for (const cashItem of sortedDenominations) {
    const denominationCents = Math.round(cashItem.denomination.value * 100);
    const maxQuantity = Math.min(
      Math.floor(remaining / denominationCents),
      cashItem.quantity
    );

    if (maxQuantity > 0) {
      result.push({
        denomination: cashItem.denomination,
        quantity: maxQuantity
      });
      remaining -= maxQuantity * denominationCents;
    }

    if (remaining === 0) break;
  }

  return result;
}

// Actualizar estado de caja
export async function updateCashRegisterState(
  denominationId: string,
  quantity: number,
  location: string
): Promise<void> {
  const { error } = await supabase
    .from('cash_register_state')
    .upsert({
      denomination_id: denominationId,
      quantity,
      location
    }, {
      onConflict: 'denomination_id,location'
    });

  if (error) {
    console.error('Error updating cash register state:', error);
    throw error;
  }
}

// Registrar entrada de caja
export async function createCashRegisterEntry(
  entry: Omit<CashRegisterEntry, 'id' | 'created_at'>
): Promise<string> {
  const { data, error } = await supabase
    .from('cash_register_entries')
    .insert(entry)
    .select()
    .single();

  if (error) {
    console.error('Error creating cash register entry:', error);
    throw error;
  }

  return data.id;
}

// Procesar venta completa con cambio
export async function processSaleTransaction(
  appointmentId: string,
  amount: number,
  paymentReceived: number,
  changeGiven: ChangeCalculation[],
  location: string,
  barberName?: string
): Promise<string> {
  const changeData = changeGiven.map(item => ({
    value: item.denomination.value,
    quantity: item.quantity
  }));

  const { data, error } = await supabase
    .rpc('process_sale_transaction', {
      p_appointment_id: appointmentId,
      p_amount: amount,
      p_payment_received: paymentReceived,
      p_change_given: changeData,
      p_location: location,
      p_barber_name: barberName
    });

  if (error) {
    console.error('Error processing sale transaction:', error);
    throw error;
  }

  return data;
}

// Obtener reportes diarios
export async function getDailyReport(
  location: string,
  date: string
): Promise<{
  entries: CashRegisterEntry[];
  totalSales: number;
  totalExpenses: number;
  netAmount: number;
}> {
  const startDate = `${date} 00:00:00`;
  const endDate = `${date} 23:59:59`;

  const { data, error } = await supabase
    .from('cash_register_entries')
    .select('*')
    .eq('location', location)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching daily report:', error);
    throw error;
  }

  const entries = (data || []) as CashRegisterEntry[];
  const totalSales = entries
    .filter(entry => entry.entry_type === 'sale')
    .reduce((sum, entry) => sum + Number(entry.amount), 0);
  
  const totalExpenses = entries
    .filter(entry => entry.entry_type === 'expense')
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  return {
    entries,
    totalSales,
    totalExpenses,
    netAmount: totalSales - totalExpenses
  };
}