import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface AvailabilityCalendarProps {
  onSlotSelect: (barber: string, date: string, time: string, location: string) => void;
  preferredBarber?: string;
}

interface TimeSlot {
  time: string;
  barber: string;
  barberName: string;
  location: string;
  available: boolean;
}

const AvailabilityCalendar = ({ onSlotSelect, preferredBarber }: AvailabilityCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [barbers, setBarbers] = useState<any[]>([]);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => addDays(startOfDay(new Date()), i));

  useEffect(() => {
    loadBarbers();
  }, []);

  useEffect(() => {
    if (barbers.length > 0) {
      loadSlots();
    }
  }, [selectedDate, barbers, preferredBarber]);

  const loadBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*')
        .eq('status', 'active');
      
      if (error) throw error;
      setBarbers(data || []);
    } catch (error) {
      console.error('Error loading barbers:', error);
    }
  };

  const loadSlots = async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const dayOfWeek = format(selectedDate, 'EEEE', { locale: es }).toLowerCase();

      // Get schedules for the day
      const { data: schedules, error: schedError } = await supabase
        .from('barber_schedules')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .eq('is_working', true);

      if (schedError) throw schedError;

      // Get existing appointments
      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', dateStr)
        .neq('status', 'cancelled');

      if (apptError) throw apptError;

      // Get blocked slots
      const { data: blockedSlots, error: blockError } = await supabase
        .from('blocked_slots')
        .select('*')
        .eq('blocked_date', dateStr);

      if (blockError) throw blockError;

      // Generate available slots
      const availableSlots: TimeSlot[] = [];
      const filteredBarbers = preferredBarber 
        ? barbers.filter(b => b.id === preferredBarber)
        : barbers;

      for (const barber of filteredBarbers) {
        const schedule = schedules?.find(s => s.barber_id === barber.id);
        if (!schedule || !schedule.start_time || !schedule.end_time) continue;

        const startHour = parseInt(schedule.start_time.split(':')[0]);
        const endHour = parseInt(schedule.end_time.split(':')[0]);

        for (let hour = startHour; hour < endHour; hour++) {
          for (const minutes of ['00', '30']) {
            const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
            
            // Check if slot is booked
            const isBooked = appointments?.some(
              a => a.barber === barber.name && a.appointment_time === time
            );

            // Check if slot is blocked
            const isBlocked = blockedSlots?.some(
              b => b.barber_id === barber.id && b.blocked_time === time
            );

            // Check if slot is in break time
            const isBreak = schedule.break_start && schedule.break_end &&
              time >= schedule.break_start && time < schedule.break_end;

            // Check if slot is in the past
            const now = new Date();
            const slotDateTime = new Date(selectedDate);
            slotDateTime.setHours(hour, parseInt(minutes));
            const isPast = slotDateTime < now;

            if (!isBooked && !isBlocked && !isBreak && !isPast) {
              availableSlots.push({
                time,
                barber: barber.id,
                barberName: barber.name,
                location: barber.location || 'general-pardinas',
                available: true
              });
            }
          }
        }
      }

      // Sort by time
      availableSlots.sort((a, b) => a.time.localeCompare(b.time));
      setSlots(availableSlots);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    onSlotSelect(slot.barberName, dateStr, slot.time, slot.location);
  };

  return (
    <div className="space-y-6">
      {/* Date selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {dates.map((date) => (
          <Button
            key={date.toISOString()}
            variant={isSameDay(date, selectedDate) ? "default" : "outline"}
            className="flex-shrink-0 flex flex-col items-center min-w-[70px] h-auto py-2"
            onClick={() => setSelectedDate(date)}
          >
            <span className="text-xs opacity-70">
              {format(date, 'EEE', { locale: es })}
            </span>
            <span className="text-lg font-bold">
              {format(date, 'd')}
            </span>
            <span className="text-xs opacity-70">
              {format(date, 'MMM', { locale: es })}
            </span>
          </Button>
        ))}
      </div>

      {/* Time slots */}
      <div className="min-h-[200px]">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : slots.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No hay horarios disponibles para esta fecha.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Prueba con otro día.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots.map((slot, index) => (
              <Button
                key={`${slot.time}-${slot.barber}-${index}`}
                variant="outline"
                className="flex flex-col items-center h-auto py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleSlotClick(slot)}
              >
                <span className="text-lg font-semibold">{slot.time}</span>
                <span className="text-xs opacity-70 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {slot.barberName}
                </span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
