
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin, Phone, Mail, CheckCircle, X, Eye } from 'lucide-react';

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

const AdminPanel = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filter, setFilter] = useState<'all' | 'confirmada' | 'cancelada' | 'completada'>('all');

  // Centros sincronizados con el sistema de reservas del cliente
  const locations = [
    { id: 'condesa', name: 'Mad Men Condesa' },
    { id: 'polanco', name: 'Mad Men Polanco' }
  ];

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: '$45' },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: '$25' },
    { id: 'cut-beard', name: 'Corte + Barba', price: '$65' },
    { id: 'shave', name: 'Afeitado Tradicional', price: '$35' },
    { id: 'treatments', name: 'Tratamientos Especiales', price: '$40' }
  ];

  // Barberos sincronizados por centro
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

  // Función para obtener todos los barberos
  const getAllBarbers = () => {
    return [...barbersByLocation.condesa, ...barbersByLocation.polanco];
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

  const filteredAppointments = appointments.filter(apt => 
    filter === 'all' || apt.status === filter
  );

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Panel Administrativo</h1>
        <p className="text-muted-foreground">Gestión de citas y reservas de Mad Men Barbería</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Citas</p>
                <p className="text-2xl font-bold text-barbershop-dark">{appointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-barbershop-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoy</p>
                <p className="text-2xl font-bold text-barbershop-dark">{todayAppointments.length}</p>
              </div>
              <Clock className="w-8 h-8 text-barbershop-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter(apt => apt.status === 'confirmada').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos</p>
                <p className="text-2xl font-bold text-barbershop-gold">${totalRevenue}</p>
              </div>
              <User className="w-8 h-8 text-barbershop-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-barbershop-gold text-barbershop-dark' : ''}
        >
          Todas
        </Button>
        <Button 
          variant={filter === 'confirmada' ? 'default' : 'outline'}
          onClick={() => setFilter('confirmada')}
          className={filter === 'confirmada' ? 'bg-barbershop-gold text-barbershop-dark' : ''}
        >
          Confirmadas
        </Button>
        <Button 
          variant={filter === 'completada' ? 'default' : 'outline'}
          onClick={() => setFilter('completada')}
          className={filter === 'completada' ? 'bg-barbershop-gold text-barbershop-dark' : ''}
        >
          Completadas
        </Button>
        <Button 
          variant={filter === 'cancelada' ? 'default' : 'outline'}
          onClick={() => setFilter('cancelada')}
          className={filter === 'cancelada' ? 'bg-barbershop-gold text-barbershop-dark' : ''}
        >
          Canceladas
        </Button>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Citas Programadas ({filteredAppointments.length})</h2>
          <div className="space-y-4">
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
                      <div>
                        <h3 className="font-bold text-barbershop-dark">{appointment.customerName}</h3>
                        <p className="text-sm text-muted-foreground">{getServiceName(appointment.service)}</p>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {getLocationName(appointment.location)}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {appointment.date} a las {appointment.time}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <User className="w-4 h-4 mr-2" />
                        {getBarberName(appointment.barber)}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
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
                            onClick={() => updateAppointmentStatus(appointment.id, 'completada')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelada')}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancelar
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

        {/* Appointment Details */}
        <div>
          <h2 className="text-xl font-bold mb-4">Detalles de la Cita</h2>
          {selectedAppointment ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>#{selectedAppointment.id}</span>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Información del Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      {selectedAppointment.customerName}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      {selectedAppointment.customerPhone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      {selectedAppointment.customerEmail}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Detalles del Servicio</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      {getLocationName(selectedAppointment.location)}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      {selectedAppointment.date} a las {selectedAppointment.time}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      {getBarberName(selectedAppointment.barber)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{getServiceName(selectedAppointment.service)}</span>
                      <span className="font-bold text-barbershop-gold">
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
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completada')}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Completada
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelada')}
                      className="flex-1"
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
    </div>
  );
};

export default AdminPanel;
