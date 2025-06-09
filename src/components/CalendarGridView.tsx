
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, User, Phone, Mail, MapPin, DollarSign, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { getAllAppointments, updateAppointmentStatus, getClientCompleteData, type Appointment, type Client, type ClientBonus, type Payment } from '@/lib/supabase-helpers';

const CalendarGridView = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
      toast.error('Error al cargar las citas');
    } finally {
      setIsLoading(false);
    }
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
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isSlotAvailable = (barber: string, time: string) => {
    return !getAppointmentForSlot(barber, time);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando calendario...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-4">Calendario de Citas</h1>
        
        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Navegación de fecha */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(subDays(selectedDate, 1))}
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
      </div>

      {/* Calendario Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header con barberos */}
              <div className="grid grid-cols-5 border-b">
                <div className="p-4 bg-gray-50 font-semibold border-r">Hora</div>
                {barbers.map((barber) => (
                  <div key={barber.id} className="p-4 bg-gray-50 font-semibold text-center border-r last:border-r-0">
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
                    const appointment = getAppointmentForSlot(barber.id, time);
                    const available = isSlotAvailable(barber.id, time);
                    
                    return (
                      <div 
                        key={`${barber.id}-${time}`} 
                        className={`p-2 border-r last:border-r-0 min-h-[60px] ${
                          available ? 'bg-green-50 hover:bg-green-100' : ''
                        }`}
                      >
                        {appointment ? (
                          <div 
                            className="bg-barbershop-gold/20 border border-barbershop-gold/40 rounded p-2 cursor-pointer hover:bg-barbershop-gold/30 transition-colors h-full"
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            <div className="text-xs font-medium truncate">
                              {getServiceName(appointment.service)}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {appointment.price && `${appointment.price}€`}
                            </div>
                            <Badge 
                              className={`${getStatusColor(appointment.status)} text-xs mt-1`}
                              variant="secondary"
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs text-gray-400">
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
        </CardContent>
      </Card>

      {/* Dialog de detalles del cliente - reutilizando el código existente */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Completa del Cliente
            </DialogTitle>
          </DialogHeader>

          {isClientDataLoading ? (
            <div className="text-center py-8">Cargando datos del cliente...</div>
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
