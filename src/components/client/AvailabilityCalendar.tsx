
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
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

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  const barbers = [
    { id: 'alejandro', name: 'Alejandro' },
    { id: 'carlos', name: 'Carlos' },
    { id: 'miguel', name: 'Miguel' },
    { id: 'david', name: 'David' }
  ];

  // Generar horas de trabajo (9:00 AM a 8:00 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 20) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const appointment = appointments.find(apt => 
      apt.appointment_date === dateStr &&
      apt.appointment_time === time &&
      apt.barber === barber &&
      apt.location === selectedLocation &&
      apt.status !== 'cancelada'
    );
    return !appointment;
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

      {/* Calendario Grid */}
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
              <div className="grid grid-cols-5 border-b">
                <div className="p-4 bg-gray-50 font-semibold border-r">Hora</div>
                {barbers.map((barber) => (
                  <div key={barber.id} className="p-4 bg-gray-50 font-semibold text-center border-r last:border-r-0 flex items-center justify-center gap-2">
                    <User className="w-4 h-4 text-barbershop-gold" />
                    {barber.name}
                  </div>
                ))}
              </div>

              {/* Filas de tiempo */}
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-5 border-b last:border-b-0">
                  <div className="p-3 bg-gray-50 font-medium border-r flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-barbershop-gold" />
                    {time}
                  </div>
                  {barbers.map((barber) => {
                    const available = isSlotAvailable(barber.id, time);
                    
                    return (
                      <div 
                        key={`${barber.id}-${time}`} 
                        className={`p-2 border-r last:border-r-0 min-h-[50px] ${
                          available 
                            ? 'bg-green-50 hover:bg-green-100 cursor-pointer' 
                            : 'bg-red-50'
                        }`}
                        onClick={() => available && handleSlotClick(barber.id, time)}
                      >
                        <div className="h-full flex items-center justify-center">
                          {available ? (
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
