
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  location: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: 'confirmada' | 'cancelada' | 'completada';
  createdAt: string;
}

const CalendarView = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('condesa');

  const locations = [
    { id: 'condesa', name: 'Mad Men Condesa' },
    { id: 'polanco', name: 'Mad Men Polanco' }
  ];

  const barbersByLocation = {
    condesa: [
      { id: 'carlos', name: 'Carlos Mendoza' },
      { id: 'miguel', name: 'Miguel Rodríguez' },
      { id: 'antonio', name: 'Antonio López' }
    ],
    polanco: [
      { id: 'ricardo', name: 'Ricardo Herrera' },
      { id: 'fernando', name: 'Fernando Castillo' },
      { id: 'alejandro', name: 'Alejandro Morales' }
    ]
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: '$45' },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: '$25' },
    { id: 'cut-beard', name: 'Corte + Barba', price: '$65' },
    { id: 'shave', name: 'Afeitado Tradicional', price: '$35' },
    { id: 'treatments', name: 'Tratamientos Especiales', price: '$40' }
  ];

  useEffect(() => {
    const loadAppointments = () => {
      const stored = localStorage.getItem('appointments');
      if (stored) {
        setAppointments(JSON.parse(stored));
      }
    };

    loadAppointments();
    const interval = setInterval(loadAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const getAppointmentForSlot = (barberId: string, timeSlot: string) => {
    return appointments.find(
      apt => apt.barber === barberId && 
             apt.time === timeSlot && 
             apt.date === formatDate(selectedDate) &&
             apt.location === selectedLocation &&
             apt.status !== 'cancelada'
    );
  };

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.name || serviceId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'completada': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const currentBarbers = barbersByLocation[selectedLocation as keyof typeof barbersByLocation] || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Vista de Calendario</h1>
        <p className="text-muted-foreground">Programación diaria por barbero y centro</p>
      </div>

      {/* Location and Date Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Location Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-barbershop-gold" />
                <span className="font-medium">Centro:</span>
              </div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-64">
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

            {/* Date Navigation */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={goToPreviousDay}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <h2 className="text-xl font-bold text-barbershop-dark capitalize">
                  {formatDisplayDate(selectedDate)}
                </h2>
              </div>
              <Button variant="outline" onClick={goToNextDay}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button 
                onClick={goToToday}
                className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Hoy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Agenda del Día</span>
            <Badge variant="outline" className="bg-barbershop-gold/10 text-barbershop-dark">
              {locations.find(l => l.id === selectedLocation)?.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header */}
              <div className={`grid border-b bg-gray-50`} style={{ gridTemplateColumns: `120px repeat(${currentBarbers.length}, 1fr)` }}>
                <div className="p-4 font-semibold text-gray-600 border-r">
                  Horario
                </div>
                {currentBarbers.map((barber) => (
                  <div key={barber.id} className="p-4 font-semibold text-center text-barbershop-dark border-r last:border-r-0">
                    {barber.name}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="max-h-96 overflow-y-auto">
                {timeSlots.map((timeSlot) => (
                  <div key={timeSlot} className={`grid border-b hover:bg-gray-50/50 min-h-16`} style={{ gridTemplateColumns: `120px repeat(${currentBarbers.length}, 1fr)` }}>
                    <div className="p-3 font-medium text-gray-600 border-r bg-gray-50/50 flex items-center">
                      {timeSlot}
                    </div>
                    {currentBarbers.map((barber) => {
                      const appointment = getAppointmentForSlot(barber.id, timeSlot);
                      return (
                        <div key={`${barber.id}-${timeSlot}`} className="p-2 border-r last:border-r-0 min-h-16">
                          {appointment ? (
                            <div className={`p-2 rounded-lg h-full flex flex-col justify-center ${getStatusColor(appointment.status)}`}>
                              <div className="font-medium text-xs truncate">
                                {appointment.customerName}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {getServiceName(appointment.service)}
                              </div>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs mt-1 ${getStatusColor(appointment.status)}`}
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                              Disponible
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
              <span className="text-sm">Confirmada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-sm">Completada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span className="text-sm">Disponible</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
