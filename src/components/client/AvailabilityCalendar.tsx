import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { format, addDays, subDays, getDay, isToday, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  getAllAppointments, 
  getBarbersWithSchedules,
  getBlockedSlots,
  type Appointment,
  type Barber,
  type BarberSchedule,
  type BlockedSlot
} from '@/lib/supabase-helpers';

interface AvailabilityCalendarProps {
  onSlotSelect?: (barber: string, date: string, time: string, location: string) => void;
}

interface BarberWithSchedules extends Barber {
  schedules: BarberSchedule[];
}

interface TimeSlotInfo {
  time: string;
  availableBarbers: string[];
  totalBarbers: number;
}

const AvailabilityCalendar = ({ onSlotSelect }: AvailabilityCalendarProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('cristobal-bordiu');
  const [isLoading, setIsLoading] = useState(true);
  const [barbers, setBarbers] = useState<BarberWithSchedules[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  useEffect(() => {
    loadData();
  }, [selectedLocation]);

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

  // Obtener horario de trabajo para un barbero en un día específico
  const getBarberWorkHours = (barberId: string, date: Date) => {
    const barber = barbers.find(b => b.id === barberId);
    
    if (!barber || barber.status !== 'active') return null;

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[getDay(date)];
    const daySchedule = barber.schedules.find(s => s.day_of_week === dayName);

    return daySchedule?.is_working ? daySchedule : null;
  };

  // Generar slots de tiempo basados en el horario del barbero
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

    // Generar slots de 30 minutos
    for (let hour = startHour; hour < endHour || (hour === endHour && startMinute < endMinute); hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === endHour && minute >= endMinute) break;
        
        // Saltar horario de descanso si existe
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

  // Función para verificar si un horario ya pasó (solo para el día actual)
  const isTimeSlotInPast = (timeSlot: string, date: Date) => {
    if (!isToday(date)) return false; // Si no es hoy, no está en el pasado
    
    const now = new Date();
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    
    // Agregar un margen de 30 minutos para evitar reservas de último momento
    const slotTimeWithMargin = new Date(slotTime);
    slotTimeWithMargin.setMinutes(slotTimeWithMargin.getMinutes() + 30);
    
    return isBefore(slotTimeWithMargin, now);
  };

  // Obtener todos los slots únicos disponibles (filtrando los que ya pasaron)
  const getAllTimeSlots = () => {
    const allSlots = new Set<string>();
    
    barbers.forEach(barber => {
      const slots = generateTimeSlotsForBarber(barber.id, selectedDate);
      slots.forEach(slot => {
        // Solo agregar slots que no hayan pasado
        if (!isTimeSlotInPast(slot, selectedDate)) {
          allSlots.add(slot);
        }
      });
    });

    return Array.from(allSlots).sort();
  };

  // Get time slots with availability info
  const getTimeSlotsWithAvailability = (): TimeSlotInfo[] => {
    const timeSlots = getAllTimeSlots();
    
    return timeSlots.map(time => {
      const availableBarbers = barbers.filter(barber => 
        isSlotAvailable(barber.id, time)
      ).map(barber => barber.id);
      
      return {
        time,
        availableBarbers,
        totalBarbers: barbers.length
      };
    });
  };

  const isSlotAvailable = (barber: string, time: string) => {
    // Verificar si el horario ya pasó
    if (isTimeSlotInPast(time, selectedDate)) {
      return false;
    }

    // Verificar si el barbero trabaja en este horario
    if (!generateTimeSlotsForBarber(barber, selectedDate).includes(time)) {
      return false;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    console.log('Verificando disponibilidad para:', { 
      barber, 
      time, 
      dateStr, 
      location: selectedLocation 
    });

    // Verificar si hay una cita confirmada en este horario
    const existingAppointment = appointments.find(apt => {
      // Normalizar el tiempo de la cita para comparar (quitar segundos si existen)
      const aptTime = apt.appointment_time.includes(':') 
        ? apt.appointment_time.substring(0, 5) 
        : apt.appointment_time;
      
      const matches = apt.appointment_date === dateStr &&
                     aptTime === time &&
                     apt.barber === barber &&
                     apt.location === selectedLocation &&
                     (apt.status === 'confirmada' || apt.status === 'completada');
      
      if (matches) {
        console.log('Cita encontrada que bloquea el horario:', apt);
      }
      
      return matches;
    });

    // Verificar si está bloqueado manualmente
    const isBlocked = blockedSlots.some(slot =>
      slot.barber_id === barber &&
      slot.blocked_date === dateStr &&
      slot.blocked_time === time
    );

    const available = !existingAppointment && !isBlocked;
    
    console.log('Resultado disponibilidad:', {
      barber,
      time,
      available,
      existingAppointment: !!existingAppointment,
      isBlocked,
      isPastTime: isTimeSlotInPast(time, selectedDate)
    });

    return available;
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-barbershop-gold mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando disponibilidad...</p>
      </div>
    );
  }

  // Si no hay barberos, mostrar mensaje
  if (barbers.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay barberos disponibles</h3>
        <p className="text-gray-500">No hay barberos activos en la sede seleccionada</p>
      </div>
    );
  }

  // Get time slots with availability info
  const timeSlots = getTimeSlotsWithAvailability();

  // Si no hay horarios disponibles para hoy
  if (timeSlots.length === 0 && isToday(selectedDate)) {
    return (
      <div className="space-y-6">
        {/* Controles de navegación */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                disabled={format(selectedDate, 'yyyy-MM-dd') <= format(new Date(), 'yyyy-MM-dd')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-lg font-semibold min-w-[200px] text-center">
                {format(selectedDate, 'EEEE, dd \'de\' MMMM', { locale: es })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
              className="text-barbershop-gold"
            >
              Hoy
            </Button>
          </div>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Seleccionar centro" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mensaje de no disponibilidad para hoy */}
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay horarios disponibles para hoy
            </h3>
            <p className="text-gray-500 mb-4">
              Los horarios de hoy ya han pasado o están ocupados. Por favor selecciona otro día.
            </p>
            <Button 
              onClick={() => setSelectedDate(addDays(new Date(), 1))}
              className="bg-barbershop-gold hover:bg-barbershop-gold/90"
            >
              Ver mañana
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date and Location Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              disabled={format(selectedDate, 'yyyy-MM-dd') <= format(new Date(), 'yyyy-MM-dd')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-base sm:text-lg font-semibold min-w-[180px] sm:min-w-[200px] text-center">
              {format(selectedDate, 'EEEE, dd \'de\' MMMM', { locale: es })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
            className="text-barbershop-gold"
          >
            Hoy
          </Button>
        </div>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Seleccionar centro" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Info message for today */}
      {isToday(selectedDate) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Clock className="w-5 h-5" />
            <span className="font-medium text-sm">
              Solo se muestran horarios disponibles con al menos 30 minutos de anticipación
            </span>
          </div>
        </div>
      )}

      {/* Time Slots Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-barbershop-gold" />
            Selecciona una Hora - {locations.find(l => l.id === selectedLocation)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Time Slots Grid - Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {timeSlots.map((slot) => {
              const isAvailable = slot.availableBarbers.length > 0;
              const isSelected = selectedTimeSlot === slot.time;
              
              return (
                <Button
                  key={slot.time}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => isAvailable && handleTimeSlotClick(slot.time)}
                  disabled={!isAvailable}
                  className={`
                    h-12 sm:h-14 flex flex-col justify-center items-center text-xs sm:text-sm font-medium
                    ${isSelected 
                      ? 'bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 border-2 border-barbershop-gold' 
                      : isAvailable 
                        ? 'border-barbershop-gold/50 text-barbershop-dark hover:bg-barbershop-gold/10 hover:border-barbershop-gold' 
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="font-semibold">{slot.time}</span>
                  <span className="text-xs opacity-80">
                    {isAvailable ? `${slot.availableBarbers.length} disponible${slot.availableBarbers.length > 1 ? 's' : ''}` : 'Ocupado'}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Show available barbers for selected time slot */}
          {selectedTimeSlot && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-barbershop-gold" />
                Barberos disponibles para {selectedTimeSlot}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {barbers
                  .filter(barber => isSlotAvailable(barber.id, selectedTimeSlot))
                  .map((barber) => (
                    <Button
                      key={barber.id}
                      variant="outline"
                      onClick={() => handleBarberSelection(barber.id, selectedTimeSlot)}
                      className="h-16 sm:h-20 flex flex-col justify-center items-center text-left border-2 border-barbershop-gold/20 hover:border-barbershop-gold hover:bg-barbershop-gold/10 transition-all"
                    >
                      <span className="font-semibold text-barbershop-dark text-sm sm:text-base">{barber.name}</span>
                      <span className="text-xs text-gray-600">{selectedTimeSlot}</span>
                    </Button>
                  ))}
              </div>
              
              {barbers.filter(barber => isSlotAvailable(barber.id, selectedTimeSlot)).length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay barberos disponibles para esta hora</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityCalendar;
