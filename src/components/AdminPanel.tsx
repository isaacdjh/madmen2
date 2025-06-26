import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin, Phone, Mail, CheckCircle, X, Eye, CreditCard } from 'lucide-react';
import PaymentWithBonuses from '@/components/PaymentWithBonuses';

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
  client_id?: string;
  price?: number;
}

const AdminPanel = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filter, setFilter] = useState<'all' | 'confirmada' | 'cancelada' | 'completada'>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAppointment, setPaymentAppointment] = useState<Appointment | null>(null);

  // Centros con nombres actualizados
  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: '$45' },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: '$25' },
    { id: 'cut-beard', name: 'Corte + Barba', price: '$65' },
    { id: 'shave', name: 'Afeitado Tradicional', price: '$35' },
    { id: 'treatments', name: 'Tratamientos Especiales', price: '$40' }
  ];

  // Barberos actualizados con los nombres reales de cada centro
  const barbersByLocation = {
    'cristobal-bordiu': [
      { id: 'luis-bracho', name: 'Luis Bracho' },
      { id: 'jesus-hernandez', name: 'Jesús Hernández' },
      { id: 'luis-alfredo', name: 'Luis Alfredo' },
      { id: 'dionys-bracho', name: 'Dionys Bracho' }
    ],
    'general-pardinas': [
      { id: 'isaac-hernandez', name: 'Isaac Hernández' },
      { id: 'carlos-lopez', name: 'Carlos López' },
      { id: 'luis-urbinez', name: 'Luis Urbiñez' },
      { id: 'randy-valdespino', name: 'Randy Valdespino' }
    ]
  };

  useEffect(() => {
    // Cargar citas del localStorage
    const loadAppointments = () => {
      const stored = localStorage.getItem('appointments');
      if (stored) {
        const loadedAppointments = JSON.parse(stored);
        console.log('Citas cargadas desde localStorage:', loadedAppointments);
        setAppointments(loadedAppointments);
      }
    };

    loadAppointments();
    
    // Actualizar cada 5 segundos para mostrar nuevas citas
    const interval = setInterval(loadAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateAppointmentStatus = (id: string, status: 'confirmada' | 'cancelada' | 'completada') => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const handlePaymentClick = (appointment: Appointment) => {
    setPaymentAppointment(appointment);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    if (paymentAppointment) {
      updateAppointmentStatus(paymentAppointment.id, 'completada');
    }
    setShowPaymentModal(false);
    setPaymentAppointment(null);
  };

  const filteredAppointments = appointments.filter(apt => 
    filter === 'all' || apt.status === filter
  );

  const getAllBarbers = () => {
    return [...barbersByLocation['cristobal-bordiu'], ...barbersByLocation['general-pardinas']];
  };

  const getLocationName = (id: string) => {
    const location = locations.find(l => l.id === id);
    return location ? location.name : id;
  };

  const getServiceName = (id: string) => {
    const service = services.find(s => s.id === id);
    return service ? service.name : id;
  };

  const getBarberName = (id: string) => {
    const barber = getAllBarbers().find(b => b.id === id);
    return barber ? barber.name : id;
  };

  const getServicePrice = (id: string) => {
    const service = services.find(s => s.id === id);
    return service ? service.price : '';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
  const totalRevenue = appointments
    .filter(apt => apt.status === 'completada')
    .reduce((sum, apt) => {
      const price = getServicePrice(apt.service);
      return sum + (price ? parseInt(price.replace('$', '')) : 0);
    }, 0);

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-barbershop-dark mb-2">Panel Administrativo</h1>
        <p className="text-sm md:text-base text-muted-foreground">Gestión de citas y reservas de Mad Men Barbería</p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Citas</p>
                <p className="text-lg md:text-2xl font-bold text-barbershop-dark">{appointments.length}</p>
              </div>
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-barbershop-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Hoy</p>
                <p className="text-lg md:text-2xl font-bold text-barbershop-dark">{todayAppointments.length}</p>
              </div>
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-barbershop-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Confirmadas</p>
                <p className="text-lg md:text-2xl font-bold text-green-600">
                  {appointments.filter(apt => apt.status === 'confirmada').length}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Ingresos</p>
                <p className="text-lg md:text-2xl font-bold text-barbershop-gold">${totalRevenue}</p>
              </div>
              <User className="w-6 h-6 md:w-8 md:h-8 text-barbershop-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Responsive */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={`${filter === 'all' ? 'bg-barbershop-gold text-barbershop-dark' : ''} whitespace-nowrap text-xs md:text-sm`}
          size="sm"
        >
          Todas
        </Button>
        <Button 
          variant={filter === 'confirmada' ? 'default' : 'outline'}
          onClick={() => setFilter('confirmada')}
          className={`${filter === 'confirmada' ? 'bg-barbershop-gold text-barbershop-dark' : ''} whitespace-nowrap text-xs md:text-sm`}
          size="sm"
        >
          Confirmadas
        </Button>
        <Button 
          variant={filter === 'completada' ? 'default' : 'outline'}
          onClick={() => setFilter('completada')}
          className={`${filter === 'completada' ? 'bg-barbershop-gold text-barbershop-dark' : ''} whitespace-nowrap text-xs md:text-sm`}
          size="sm"
        >
          Completadas
        </Button>
        <Button 
          variant={filter === 'cancelada' ? 'default' : 'outline'}
          onClick={() => setFilter('cancelada')}
          className={`${filter === 'cancelada' ? 'bg-barbershop-gold text-barbershop-dark' : ''} whitespace-nowrap text-xs md:text-sm`}
          size="sm"
        >
          Canceladas
        </Button>
      </div>

      {/* Appointments List - Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold mb-4">Citas Programadas ({filteredAppointments.length})</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No hay citas para mostrar
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-barbershop-dark truncate">{appointment.customerName}</h3>
                        <p className="text-sm text-muted-foreground truncate">{getServiceName(appointment.service)}</p>
                      </div>
                      <Badge className={`${getStatusColor(appointment.status)} ml-2 whitespace-nowrap`}>
                        {appointment.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{getLocationName(appointment.location)}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{appointment.date} a las {appointment.time}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <User className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{getBarberName(appointment.barber)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      {appointment.status === 'confirmada' && (
                        <>
                          <Button 
                            size="sm"
                            onClick={() => handlePaymentClick(appointment)}
                            className="bg-barbershop-gold hover:bg-barbershop-gold/90 text-barbershop-dark"
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Cobrar</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelada')}
                          >
                            <X className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Cancelar</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Appointment Details - Responsive */}
        <div className="xl:sticky xl:top-24 xl:h-fit">
          <h2 className="text-lg md:text-xl font-bold mb-4">Detalles de la Cita</h2>
          {selectedAppointment ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base md:text-lg">
                  <span>#{selectedAppointment.id}</span>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm md:text-base">Información del Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{selectedAppointment.customerName}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{selectedAppointment.customerPhone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{selectedAppointment.customerEmail}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm md:text-base">Detalles del Servicio</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{getLocationName(selectedAppointment.location)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span>{selectedAppointment.date} a las {selectedAppointment.time}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{getBarberName(selectedAppointment.barber)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="truncate mr-2">{getServiceName(selectedAppointment.service)}</span>
                      <span className="font-bold text-barbershop-gold whitespace-nowrap">
                        {getServicePrice(selectedAppointment.service)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Creada: {new Date(selectedAppointment.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedAppointment.status === 'confirmada' && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completada')}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Completada
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelada')}
                      className="flex-1"
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar Cita
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Selecciona una cita para ver los detalles
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {paymentAppointment && (
        <PaymentWithBonuses
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          appointmentId={paymentAppointment.id}
          clientId={paymentAppointment.client_id || null}
          serviceName={getServiceName(paymentAppointment.service)}
          servicePrice={paymentAppointment.price || parseFloat(getServicePrice(paymentAppointment.service).replace('$', '')) || 0}
          barber={getBarberName(paymentAppointment.barber)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default AdminPanel;
