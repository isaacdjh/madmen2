import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User } from 'lucide-react';
import { format, getDay, isToday, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAvailabilityCalendar } from '@/hooks/useAvailabilityCalendar';
import DateNavigator from './calendar/DateNavigator';
import TimeSlotGrid from './calendar/TimeSlotGrid';
import BarberSelector from './calendar/BarberSelector';

interface AvailabilityCalendarProps {
  onSlotSelect?: (barber: string, date: string, time: string, location: string) => void;
  preferredBarber?: string;
}

interface TimeSlotInfo {
  time: string;
  availableBarbers: string[];
  totalBarbers: number;
}

const AvailabilityCalendar = ({ onSlotSelect, preferredBarber }: AvailabilityCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('cristobal-bordiu');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const { appointments, blockedSlots, isLoading, barbers } = useAvailabilityCalendar(selectedLocation);

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  const getBarberWorkHours = (barberId: string, date: Date) => {
    const barber = barbers.find(b => b.id === barberId);
    
    if (!barber || barber.status !== 'active') return null;

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[getDay(date)];
    const daySchedule = barber.schedules.find(s => s.day_of_week === dayName);

    return daySchedule?.is_working ? daySchedule : null;
  };

  const generateTimeSlotsForBarber = (barberId: string, date: Date) => {
    const workHours = getBarberWorkHours(barberId, date);
    if (!workHours || !workHours.start_time || !workHours.end_time) return [];

    const slots = [];
    const [startHour, startMinute] = workHours.start_time.split(':').map(Number);
    const [endHour, endMinute] = workHours.end_time.split(':').map(Number);
    
    let breakStartHour = 0, breakStartMinute = 0, breakEndHour = 0, breakEndMinute = 0;
    if (workHours.break_start && workHours.break_end) {
      [breakStartHour, breakStartMinute] = workHours.break_start.split(':').map(Number);
      [breakEndHour, breakEndMinute] = workHours.break_end.split(':').map(Number);
    }

    for (let hour = startHour; hour < endHour || (hour === endHour && startMinute < endMinute); hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === endHour && minute >= endMinute) break;
        
        if (workHours.break_start && workHours.break_end) {
          const currentTime = hour * 60 + minute;
          const breakStart = breakStartHour * 60 + breakStartMinute;
          const breakEnd = breakEndHour * 60 + breakEndMinute;
          
          if (currentTime >= breakStart && currentTime < breakEnd) continue;
        }

        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }

    return slots;
  };

  const isTimeSlotInPast = (timeSlot: string, date: Date) => {
    if (!isToday(date)) return false;
    
    const now = new Date();
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    
    const slotTimeWithMargin = new Date(slotTime);
    slotTimeWithMargin.setMinutes(slotTimeWithMargin.getMinutes() + 30);
    
    return isBefore(slotTimeWithMargin, now);
  };

  const getAllTimeSlots = () => {
    const allSlots = new Set<string>();
    
    if (preferredBarber) {
      const slots = generateTimeSlotsForBarber(preferredBarber, selectedDate);
      slots.forEach(slot => {
        if (!isTimeSlotInPast(slot, selectedDate)) {
          allSlots.add(slot);
        }
      });
    } else {
      barbers.forEach(barber => {
        const slots = generateTimeSlotsForBarber(barber.id, selectedDate);
        slots.forEach(slot => {
          if (!isTimeSlotInPast(slot, selectedDate)) {
            allSlots.add(slot);
          }
        });
      });
    }

    return Array.from(allSlots).sort();
  };

  const getTimeSlotsWithAvailability = (): TimeSlotInfo[] => {
    const timeSlots = getAllTimeSlots();
    
    return timeSlots.map(time => {
      let availableBarbers;
      
      if (preferredBarber) {
        availableBarbers = isSlotAvailable(preferredBarber, time) ? [preferredBarber] : [];
      } else {
        availableBarbers = barbers.filter(barber => 
          isSlotAvailable(barber.id, time)
        ).map(barber => barber.id);
      }
      
      return {
        time,
        availableBarbers,
        totalBarbers: preferredBarber ? 1 : barbers.length
      };
    });
  };

  const isSlotAvailable = (barber: string, time: string) => {
    if (isTimeSlotInPast(time, selectedDate)) {
      return false;
    }

    if (!generateTimeSlotsForBarber(barber, selectedDate).includes(time)) {
      return false;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    const existingAppointment = appointments.find(apt => {
      const aptTime = apt.appointment_time.includes(':') 
        ? apt.appointment_time.substring(0, 5) 
        : apt.appointment_time;
      
      return apt.appointment_date === dateStr &&
             aptTime === time &&
             apt.barber === barber &&
             apt.location === selectedLocation &&
             (apt.status === 'confirmada' || apt.status === 'completada');
    });

    const isBlocked = blockedSlots.some(slot =>
      slot.barber_id === barber &&
      slot.blocked_date === dateStr &&
      slot.blocked_time === time
    );

    return !existingAppointment && !isBlocked;
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    if (preferredBarber) {
      if (isSlotAvailable(preferredBarber, timeSlot) && onSlotSelect) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        onSlotSelect(preferredBarber, dateStr, timeSlot, selectedLocation);
      }
    } else {
      setSelectedTimeSlot(timeSlot);
    }
  };

  const handleBarberSelection = (barberId: string, time: string) => {
    if (isSlotAvailable(barberId, time) && onSlotSelect) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      onSlotSelect(barberId, dateStr, time, selectedLocation);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Cargando disponibilidad...</p>
      </div>
    );
  }

  const timeSlots = getTimeSlotsWithAvailability();

  if (barbers.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">No hay barberos disponibles</h3>
        <p className="text-muted-foreground">No hay barberos activos en la sede seleccionada</p>
      </div>
    );
  }

  if (preferredBarber && timeSlots.length === 0) {
    return (
      <div className="space-y-6">
        <DateNavigator
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          locations={locations}
        />

        <Card>
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {barbers.find(b => b.id === preferredBarber)?.name} no tiene horarios disponibles
            </h3>
            <p className="text-muted-foreground mb-4">
              Tu barbero preferido no tiene horarios disponibles para {format(selectedDate, 'dd \'de\' MMMM', { locale: es })}. 
              Prueba con otro día.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (timeSlots.length === 0 && isToday(selectedDate)) {
    return (
      <div className="space-y-6">
        <DateNavigator
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          locations={locations}
        />

        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No hay horarios disponibles para hoy
            </h3>
            <p className="text-muted-foreground mb-4">
              Los horarios de hoy ya han pasado o están ocupados. Por favor selecciona otro día.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DateNavigator
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        locations={locations}
      />

      {isToday(selectedDate) && (
        <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Clock className="w-5 h-5" />
            <span className="font-medium text-sm">
              Solo se muestran horarios disponibles con al menos 30 minutos de anticipación
            </span>
          </div>
        </div>
      )}

      {preferredBarber && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-foreground">
            <User className="w-5 h-5 text-primary" />
            <span className="font-medium">
              Mostrando horarios disponibles para: <strong>{barbers.find(b => b.id === preferredBarber)?.name}</strong>
            </span>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
            <Calendar className="w-5 h-5 text-primary" />
            {preferredBarber ? 
              `Horarios de ${barbers.find(b => b.id === preferredBarber)?.name}` :
              `Selecciona una Hora - ${locations.find(l => l.id === selectedLocation)?.name}`
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <TimeSlotGrid
            timeSlots={timeSlots}
            selectedTimeSlot={selectedTimeSlot}
            preferredBarber={preferredBarber}
            onTimeSlotClick={handleTimeSlotClick}
          />

          {selectedTimeSlot && !preferredBarber && (
            <BarberSelector
              barbers={barbers}
              selectedTimeSlot={selectedTimeSlot}
              isSlotAvailable={isSlotAvailable}
              onBarberSelection={handleBarberSelection}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityCalendar;
