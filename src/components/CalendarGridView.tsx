
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, User, Phone, Mail, MapPin, DollarSign, Gift, ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react';
import { format, addDays, subDays, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { getAllAppointments, updateAppointmentStatus, getClientCompleteData, type Appointment, type Client, type ClientBonus, type Payment } from '@/lib/supabase-helpers';

interface BlockedSlot {
  barber: string;
  date: string;
  time: string;
  reason?: string;
}

const CalendarGridView = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('cristobal-bordiu');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [clientData, setClientData] = useState<{
    client: Client | null;
    appointments: Appointment[];
    bonuses: ClientBonus[];
    payments: Payment[];
  }>({ client: null, appointments: [], bonuses: [], payments: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isClientDataLoading, setIsClientDataLoading] = useState(false);

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

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: 45 },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: 25 },
    { id: 'cut-beard', name: 'Corte + Barba', price: 65 },
    { id: 'shave', name: 'Afeitado Tradicional', price: 35 },
    { id: 'treatments', name: 'Tratamientos Especiales', price: 40 }
  ];

  // Obtener barberos del localStorage (del área de empleados)
  const getStoredBarbers = () => {
    const stored = localStorage.getItem('barbers');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  };

  // Obtener horario de trabajo para un barbero en un día específico
  const getBarberWorkHours = (barberId: string, date: Date) => {
    const storedBarbers = getStoredBarbers();
    const barber = storedBarbers.find((b: any) => b.id === barberId);
    
    if (!barber) return null;

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
    loadBlockedSlots();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      toast.error('Error al cargar las citas');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlockedSlots = () => {
    const stored = localStorage.getItem('blockedSlots');
    if (stored) {
      setBlockedSlots(JSON.parse(stored));
    }
  };

  const saveBlockedSlots = (slots: BlockedSlot[]) => {
    setBlockedSlots(slots);
    localStorage.setItem('blockedSlots', JSON.stringify(slots));
  };

  const getAppointmentForSlot = (barber: string, time: string) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return appointments.find(apt => 
      apt.appointment_date === dateStr &&
      apt.appointment_time === time &&
      apt.barber === barber &&
      apt.location === selectedLocation
    );
  };

  const isSlotBlocked = (barber: string, time: string) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return blockedSlots.some(slot =>
      slot.barber === barber &&
      slot.date === dateStr &&
      slot.time === time
    );
  };

  const isBarberWorking = (barberId: string, time: string) => {
    const workHours = getBarberWorkHours(barberId, selectedDate);
    if (!workHours) return false;

    const barberSlots = generateTimeSlotsForBarber(barberId, selectedDate);
    return barberSlots.includes(time);
  };

  const toggleSlotBlock = (barber: string, time: string) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingBlock = blockedSlots.find(slot =>
      slot.barber === barber &&
      slot.date === dateStr &&
      slot.time === time
    );

    if (existingBlock) {
      // Desbloquear
      const newSlots = blockedSlots.filter(slot => slot !== existingBlock);
      saveBlockedSlots(newSlots);
      toast.success('Horario desbloqueado');
    } else {
      // Bloquear
      const newBlock: BlockedSlot = {
        barber,
        date: dateStr,
        time,
        reason: 'Bloqueado manualmente'
      };
      saveBlockedSlots([...blockedSlots, newBlock]);
      toast.success('Horario bloqueado');
    }
  };

  const handleAppointmentClick = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsClientDataLoading(true);

    try {
      const data = await getClientCompleteData(appointment.client_id);
      setClientData(data);
    } catch (error) {
      console.error('Error al cargar datos del cliente:', error);
      toast.error('Error al cargar los datos del cliente');
    } finally {
      setIsClientDataLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      await loadAppointments();
      toast.success('Estado actualizado correctamente');
      
      if (selectedAppointment && selectedAppointment.id === appointmentId) {
        setSelectedAppointment({ ...selectedAppointment, status: newStatus as any });
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const getServiceName = (id: string) => {
    return services.find(s => s.id === id)?.name || id;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800 border-green-200';
      case 'completada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-barbershop-gold"></div>
          <span className="ml-3 text-gray-600">Cargando calendario...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header mejorado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-barbershop-dark mb-2">Calendario de Citas</h1>
        <p className="text-gray-600">Gestiona las citas y horarios de los barberos</p>
      </div>

      {/* Controles mejorados */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Navegación de fecha mejorada */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                className="hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="bg-barbershop-gold/10 px-4 py-2 rounded-lg">
                <div className="text-lg font-bold text-barbershop-dark min-w-[220px] text-center">
                  {format(selectedDate, 'EEEE, dd \'de\' MMMM', { locale: es })}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Botón hoy mejorado */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
              className="text-barbershop-gold hover:bg-barbershop-gold/10 font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Hoy
            </Button>
          </div>

          {/* Selector de ubicación mejorado */}
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-500" />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[280px] bg-white border-gray-200">
                <SelectValue placeholder="Seleccionar centro" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Calendario Grid mejorado */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-barbershop-gold/10 to-barbershop-gold/5 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Calendar className="w-6 h-6 text-barbershop-gold" />
            Horarios y Disponibilidad
            <Badge variant="outline" className="ml-auto">
              {timeSlots.length} franjas horarias
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header con barberos mejorado */}
              <div className="grid grid-cols-5 border-b bg-gray-50">
                <div className="p-4 font-bold text-gray-700 border-r bg-gray-100 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-barbershop-gold" />
                  Horario
                </div>
                {barbers.map((barber) => (
                  <div key={barber.id} className="p-4 font-bold text-center border-r last:border-r-0 bg-white">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <User className="w-4 h-4 text-barbershop-gold" />
                      <span className="text-barbershop-dark">{barber.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getBarberWorkHours(barber.id, selectedDate) ? 'Disponible' : 'No trabaja'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Filas de tiempo mejoradas */}
              {timeSlots.map((time, index) => (
                <div key={time} className={`grid grid-cols-5 border-b last:border-b-0 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <div className="p-4 bg-gray-50 font-semibold border-r flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-barbershop-dark">{time}</div>
                      <div className="text-xs text-gray-500">
                        {parseInt(time.split(':')[0]) < 12 ? 'AM' : 'PM'}
                      </div>
                    </div>
                  </div>
                  {barbers.map((barber) => {
                    const appointment = getAppointmentForSlot(barber.id, time);
                    const isBlocked = isSlotBlocked(barber.id, time);
                    const isWorking = isBarberWorking(barber.id, time);
                    
                    return (
                      <div 
                        key={`${barber.id}-${time}`} 
                        className="p-2 border-r last:border-r-0 min-h-[70px] relative"
                      >
                        {!isWorking ? (
                          <div className="h-full flex items-center justify-center bg-gray-100 rounded text-gray-400 text-sm">
                            No disponible
                          </div>
                        ) : appointment ? (
                          <div 
                            className="bg-gradient-to-br from-barbershop-gold/20 to-barbershop-gold/10 border-2 border-barbershop-gold/40 rounded-lg p-3 cursor-pointer hover:shadow-lg transition-all h-full"
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            <div className="text-sm font-bold text-barbershop-dark truncate mb-1">
                              {getServiceName(appointment.service)}
                            </div>
                            {appointment.price && (
                              <div className="text-sm font-semibold text-green-600 mb-1">
                                {appointment.price}€
                              </div>
                            )}
                            <Badge 
                              className={`${getStatusColor(appointment.status)} text-xs px-2 py-1`}
                              variant="secondary"
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        ) : isBlocked ? (
                          <div 
                            className="bg-red-100 border-2 border-red-300 rounded-lg p-3 cursor-pointer hover:bg-red-200 transition-colors h-full flex items-center justify-center"
                            onClick={() => toggleSlotBlock(barber.id, time)}
                          >
                            <div className="text-center">
                              <Lock className="w-5 h-5 text-red-600 mx-auto mb-1" />
                              <span className="text-xs font-medium text-red-700">Bloqueado</span>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="bg-green-50 border-2 border-green-200 rounded-lg p-3 cursor-pointer hover:bg-green-100 transition-colors h-full flex items-center justify-center group"
                            onClick={() => toggleSlotBlock(barber.id, time)}
                          >
                            <div className="text-center">
                              <Unlock className="w-5 h-5 text-green-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-medium text-green-700">Disponible</span>
                              <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Click para bloquear
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leyenda */}
      <div className="mt-6 bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-700 mb-3">Leyenda</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border-2 border-green-200 rounded"></div>
            <span className="text-sm text-gray-600">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-barbershop-gold/20 border-2 border-barbershop-gold/40 rounded"></div>
            <span className="text-sm text-gray-600">Con cita</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
            <span className="text-sm text-gray-600">Bloqueado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-sm text-gray-600">No disponible</span>
          </div>
        </div>
      </div>

      {/* Dialog de detalles del cliente */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Completa del Cliente
            </DialogTitle>
          </DialogHeader>

          {isClientDataLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-barbershop-gold mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando datos del cliente...</p>
            </div>
          ) : clientData.client ? (
            <div className="space-y-6">
              {/* Datos del cliente */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Datos del Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{clientData.client.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{clientData.client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{clientData.client.email}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cliente desde: {format(new Date(clientData.client.created_at), 'dd/MM/yyyy', { locale: es })}
                  </div>
                </CardContent>
              </Card>

              {/* Cita actual */}
              {selectedAppointment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detalles de la Cita</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{format(new Date(selectedAppointment.appointment_date), 'dd/MM/yyyy', { locale: es })} - {selectedAppointment.appointment_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{getServiceName(selectedAppointment.service)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{locations.find(l => l.id === selectedAppointment.location)?.name} - {barbers.find(b => b.id === selectedAppointment.barber)?.name}</span>
                    </div>
                    {selectedAppointment.price && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-bold text-barbershop-gold">{selectedAppointment.price}€</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-4">
                      {selectedAppointment.status === 'confirmada' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(selectedAppointment.id, 'completada')}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            Completar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(selectedAppointment.id, 'cancelada')}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bonos activos */}
              {clientData.bonuses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="w-5 h-5 text-barbershop-gold" />
                      Bonos Activos ({clientData.bonuses.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {clientData.bonuses.map((bonus) => (
                        <div key={bonus.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Bono - {bonus.services_remaining} servicios restantes</div>
                            <div className="text-sm text-muted-foreground">
                              Vendido por: {bonus.sold_by_barber} | {format(new Date(bonus.purchase_date), 'dd/MM/yyyy', { locale: es })}
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {bonus.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No se pudieron cargar los datos del cliente
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarGridView;
