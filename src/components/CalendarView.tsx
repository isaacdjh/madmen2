
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, User, Phone, Mail, MapPin, DollarSign, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { getAllAppointments, updateAppointmentStatus, getClientCompleteData, getClientBonuses, type Appointment, type Client, type ClientBonus, type Payment } from '@/lib/supabase-helpers';

const CalendarView = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [clientData, setClientData] = useState<{
    client: Client | null;
    appointments: Appointment[];
    bonuses: ClientBonus[];
    payments: Payment[];
  }>({ client: null, appointments: [], bonuses: [], payments: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isClientDataLoading, setIsClientDataLoading] = useState(false);

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: 45 },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: 25 },
    { id: 'cut-beard', name: 'Corte + Barba', price: 65 },
    { id: 'shave', name: 'Afeitado Tradicional', price: 35 },
    { id: 'treatments', name: 'Tratamientos Especiales', price: 40 }
  ];

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

  const getLocationName = (id: string) => {
    return locations.find(l => l.id === id)?.name || id;
  };

  const getBarberName = (id: string) => {
    return barbers.find(b => b.id === id)?.name || id;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupAppointmentsByDate = (appointments: Appointment[]) => {
    const grouped: { [key: string]: Appointment[] } = {};
    
    appointments.forEach(appointment => {
      const date = appointment.appointment_date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(appointment);
    });

    // Ordenar por fecha
    const sortedDates = Object.keys(grouped).sort();
    const result: { [key: string]: Appointment[] } = {};
    
    sortedDates.forEach(date => {
      result[date] = grouped[date].sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));
    });

    return result;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando citas...</div>
      </div>
    );
  }

  const groupedAppointments = groupAppointmentsByDate(appointments);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Calendario de Citas</h1>
        <p className="text-muted-foreground">Gestiona todas las citas de la barbería</p>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedAppointments).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No hay citas programadas
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-barbershop-dark">
                  <Calendar className="w-5 h-5" />
                  {format(new Date(date), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es })}
                  <Badge variant="secondary" className="ml-2">
                    {dayAppointments.length} citas
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {dayAppointments.map((appointment) => (
                    <Card 
                      key={appointment.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-barbershop-gold" />
                                <span className="font-bold text-lg">{appointment.appointment_time}</span>
                              </div>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>Servicio: {getServiceName(appointment.service)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{getLocationName(appointment.location)} - {getBarberName(appointment.barber)}</span>
                              </div>
                              {appointment.price && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4" />
                                  <span className="font-bold text-barbershop-gold">{appointment.price}€</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {appointment.status === 'confirmada' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(appointment.id, 'completada');
                                  }}
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                >
                                  Completar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(appointment.id, 'cancelada');
                                  }}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  Cancelar
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
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

              {/* Historial de citas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Historial de Citas ({clientData.appointments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {clientData.appointments.map((apt) => (
                      <div key={apt.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                        <div className="flex-1">
                          <div className="text-sm">
                            {format(new Date(apt.appointment_date), 'dd/MM/yyyy', { locale: es })} - {apt.appointment_time}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getServiceName(apt.service)} | {getBarberName(apt.barber)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {apt.price && <span className="text-sm font-medium">{apt.price}€</span>}
                          <Badge className={getStatusColor(apt.status)} variant="secondary">
                            {apt.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Historial de pagos */}
              {clientData.payments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Historial de Pagos ({clientData.payments.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {clientData.payments.map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                          <div>
                            <div className="text-sm font-medium">{payment.amount}€</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(payment.created_at), 'dd/MM/yyyy', { locale: es })} | {payment.payment_method}
                            </div>
                          </div>
                          <Badge className={payment.payment_status === 'completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {payment.payment_status}
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

export default CalendarView;
