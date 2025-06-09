
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { format, addDays, subDays, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { getAllAppointments, type Appointment } from '@/lib/supabase-helpers';

interface AvailabilityCalendarProps {
  onSlotSelect?: (barber: string, date: string, time: string, location: string) => void;
}

const AvailabilityCalendar = ({ onSlotSelect }: AvailabilityCalendarProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('cristobal-bordiu');
  const [isLoading, setIsLoading] = useState(true);
  const [barbers, setBarbers] = useState<any[]>([]);

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  // Obtener barberos del localStorage (del área de empleados)
  const getStoredBarbers = () => {
    const stored = localStorage.getItem('barbers');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  };

  // Cargar barberos al inicio
  useEffect(() => {
    const storedBarbers = getStoredBarbers();
    setBarbers(storedBarbers);
    
    // Listener para cambios en localStorage
    const handleStorageChange = () => {
      const updatedBarbers = getStoredBarbers();
      setBarbers(updatedBarbers);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar cambios locales
    const interval = setInterval(() => {
      const currentBarbers = getStoredBarbers();
      const currentBarbersStr = JSON.stringify(currentBarbers);
      const stateBarbersStr = JSON.stringify(barbers);
      
      if (currentBarbersStr !== stateBarbersStr) {
        setBarbers(currentBarbers);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [barbers]);

  // Obtener horario de trabajo para un barbero en un día específico
  const getBarberWorkHours = (barberId: string, date: Date) => {
    const barber = barbers.find((b: any) => b.id === barberId);
    
    if (!barber || barber.status !== 'active') return null;

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[getDay(date)];
    const daySchedule = barber.weekSchedule?.[dayName];

    return daySchedule?.isWorking ? daySchedule : null;
  };

  // Generar slots de tiempo basados en el horario del barbero
  const generateTimeSlotsForBarber = (barberId: string, date: Date) => {
    const workHours = getBarberWorkHours(barberId, date);
    if (!workHours) return [];

    const slots = [];
    const [startHour, startMinute] = workHours.start.split(':').map(Number);
    const [endHour, endMinute] = workHours.end.split(':').map(Number);
    const [breakStartHour, breakStartMinute] = workHours.breakStart.split(':').map(Number);
    const [breakEndHour, breakEndMinute] = workHours.breakEnd.split(':').map(Number);

    // Generar slots de 30 minutos
    for (let hour = startHour; hour < endHour || (hour === endHour && startMinute < endMinute); hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === endHour && minute >= endMinute) break;
        
        // Saltar horario de descanso
        const currentTime = hour * 60 + minute;
        const breakStart = breakStartHour * 60 + breakStartMinute;
        const breakEnd = breakEndHour * 60 + breakEndMinute;
        
        if (currentTime >= breakStart && currentTime < breakEnd) continue;

        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }

    return slots;
  };

  // Obtener todos los slots únicos para mostrar en el calendario
  const getAllTimeSlots = () => {
    const allSlots = new Set<string>();
    
    barbers.forEach(barber => {
      const slots = generateTimeSlotsForBarber(barber.id, selectedDate);
      slots.forEach(slot => allSlots.add(slot));
    });

    return Array.from(allSlots).sort();
  };

  const timeSlots = getAllTimeSlots();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSlotAvailable = (barber: string, time: string) => {
    // Verificar si el barbero trabaja en este horario
    if (!generateTimeSlotsForBarber(barber, selectedDate).includes(time)) {
      return false;
    }

    // Verificar si hay una cita
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const appointment = appointments.find(apt => 
      apt.appointment_date === dateStr &&
      apt.appointment_time === time &&
      apt.barber === barber &&
      apt.location === selectedLocation &&
      apt.status !== 'cancelada'
    );

    // Verificar si está bloqueado
    const blockedSlots = JSON.parse(localStorage.getItem('blockedSlots') || '[]');
    const isBlocked = blockedSlots.some((slot: any) =>
      slot.barber === barber &&
      slot.date === dateStr &&
      slot.time === time
    );

    return !appointment && !isBlocked;
  };

  const handleSlotClick = (barber: string, time: string) => {
    if (isSlotAvailable(barber, time) && onSlotSelect) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      onSlotSelect(barber, dateStr, time, selectedLocation);
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
        <p className="text-gray-500">En este momento no hay barberos configurados en el sistema</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Navegación de fecha */}
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

          {/* Botón hoy */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
            className="text-barbershop-gold"
          >
            Hoy
          </Button>
        </div>

        {/* Selector de ubicación */}
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

      {/* Calendario Grid mejorado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-barbershop-gold" />
            Disponibilidad de Barberos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header con barberos */}
              <div className={`grid border-b`} style={{ gridTemplateColumns: `200px repeat(${barbers.length}, 1fr)` }}>
                <div className="p-4 bg-gray-50 font-semibold border-r">Hora</div>
                {barbers.map((barber) => {
                  const workHours = getBarberWorkHours(barber.id, selectedDate);
                  return (
                    <div key={barber.id} className="p-4 bg-gray-50 font-semibold text-center border-r last:border-r-0 flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-barbershop-gold" />
                        {barber.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {workHours ? `${workHours.start} - ${workHours.end}` : 'No disponible'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Filas de tiempo */}
              {timeSlots.map((time) => (
                <div key={time} className={`grid border-b last:border-b-0`} style={{ gridTemplateColumns: `200px repeat(${barbers.length}, 1fr)` }}>
                  <div className="p-3 bg-gray-50 font-medium border-r flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-barbershop-gold" />
                    {time}
                  </div>
                  {barbers.map((barber) => {
                    const available = isSlotAvailable(barber.id, time);
                    const isWorking = generateTimeSlotsForBarber(barber.id, selectedDate).includes(time);
                    
                    return (
                      <div 
                        key={`${barber.id}-${time}`} 
                        className={`p-2 border-r last:border-r-0 min-h-[50px] ${
                          !isWorking 
                            ? 'bg-gray-100' 
                            : available 
                              ? 'bg-green-50 hover:bg-green-100 cursor-pointer' 
                              : 'bg-red-50'
                        }`}
                        onClick={() => available && handleSlotClick(barber.id, time)}
                      >
                        <div className="h-full flex items-center justify-center">
                          {!isWorking ? (
                            <span className="text-gray-400 text-sm">
                              No disponible
                            </span>
                          ) : available ? (
                            <span className="text-green-600 font-medium text-sm">
                              Disponible
                            </span>
                          ) : (
                            <span className="text-red-500 text-sm">
                              Ocupado
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityCalendar;
