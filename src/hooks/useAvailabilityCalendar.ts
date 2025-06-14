
import { useState, useEffect } from 'react';
import { 
  getAllAppointments, 
  getBarbersWithSchedules,
  getBlockedSlots,
  type Appointment,
  type Barber,
  type BarberSchedule,
  type BlockedSlot
} from '@/lib/supabase-helpers';

interface BarberWithSchedules extends Barber {
  schedules: BarberSchedule[];
}

export const useAvailabilityCalendar = (selectedLocation: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [barbers, setBarbers] = useState<BarberWithSchedules[]>([]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [appointmentsData, barbersData, blockedSlotsData] = await Promise.all([
        getAllAppointments(),
        getBarbersWithSchedules(selectedLocation),
        getBlockedSlots()
      ]);
      
      console.log('Citas cargadas:', appointmentsData);
      console.log('Barberos cargados para', selectedLocation, ':', barbersData);
      
      setAppointments(appointmentsData);
      setBarbers(barbersData.filter(barber => barber.status === 'active'));
      setBlockedSlots(blockedSlotsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedLocation]);

  return {
    appointments,
    blockedSlots,
    isLoading,
    barbers,
    loadData
  };
};
