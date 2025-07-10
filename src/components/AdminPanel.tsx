
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin, Phone, Mail, CheckCircle, X, Eye, CreditCard, Plus } from 'lucide-react';
import PaymentWithBonuses from '@/components/PaymentWithBonuses';
import CobroExpress from '@/components/CobroExpress';

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
  const [showCobroExpress, setShowCobroExpress] = useState(false);

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
      case 'confirmada': return 'bg-green-600 text-white hover:bg-green-700';
      case 'cancelada': return 'bg-red-600 text-white hover:bg-red-700';
      case 'completada': return 'bg-blue-600 text-white hover:bg-blue-700';
      default: return 'bg-gray-600 text-white hover:bg-gray-700';
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-full">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Panel Administrativo</h1>
            <p className="text-gray-700">Gestión de citas y reservas de Mad Men Barbería</p>
          </div>
          <Button 
            onClick={() => setShowCobroExpress(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Cobro Express
          </Button>
        </div>

        {/* Stats Cards - Improved responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
          <Card className="bg-white shadow-md border border-gray-200">
            <CardContent className="p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">Total Citas</p>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900">{appointments.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 lg:w-8 lg:h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border border-gray-200">
            <CardContent className="p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">Hoy</p>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900">{todayAppointments.length}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 lg:w-8 lg:h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border border-gray-200">
            <CardContent className="p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">Confirmadas</p>
                  <p className="text-xl lg:text-3xl font-bold text-green-600">
                    {appointments.filter(apt => apt.status === 'confirmada').length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 lg:w-8 lg:h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border border-gray-200">
            <CardContent className="p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">Ingresos</p>
                  <p className="text-xl lg:text-3xl font-bold text-orange-600">${totalRevenue}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="w-5 h-5 lg:w-8 lg:h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters - Better mobile layout */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={`${filter === 'all' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} text-sm`}
            size="sm"
          >
            Todas ({appointments.length})
          </Button>
          <Button 
            variant={filter === 'confirmada' ? 'default' : 'outline'}
            onClick={() => setFilter('confirmada')}
            className={`${filter === 'confirmada' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} text-sm`}
            size="sm"
          >
            Confirmadas ({appointments.filter(apt => apt.status === 'confirmada').length})
          </Button>
          <Button 
            variant={filter === 'completada' ? 'default' : 'outline'}
            onClick={() => setFilter('completada')}
            className={`${filter === 'completada' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} text-sm`}
            size="sm"
          >
            Completadas ({appointments.filter(apt => apt.status === 'completada').length})
          </Button>
          <Button 
            variant={filter === 'cancelada' ? 'default' : 'outline'}
            onClick={() => setFilter('cancelada')}
            className={`${filter === 'cancelada' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} text-sm`}
            size="sm"
          >
            Canceladas ({appointments.filter(apt => apt.status === 'cancelada').length})
          </Button>
        </div>

        {/* Main Content - Improved layout without overlap */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Appointments List - Takes 2 columns on desktop */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-bold mb-4 text-gray-900">
                Citas Programadas ({filteredAppointments.length})
              </h2>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700">No hay citas para mostrar</p>
                    <p className="text-sm text-gray-600">Las citas aparecerán aquí cuando se realicen reservas</p>
                  </div>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <Card 
                      key={appointment.id} 
                      className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 ${
                        selectedAppointment?.id === appointment.id 
                          ? 'border-l-blue-500 bg-blue-50 shadow-md' 
                          : 'border-l-gray-300 hover:border-l-blue-400 bg-white'
                      }`}
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 text-base lg:text-lg truncate">
                              {appointment.customerName}
                            </h3>
                            <p className="text-gray-700 truncate text-sm lg:text-base">{getServiceName(appointment.service)}</p>
                          </div>
                          <Badge className={`${getStatusColor(appointment.status)} ml-3 whitespace-nowrap text-xs`}>
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
                          <div className="flex items-center text-gray-700">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500" />
                            <span className="truncate">{getLocationName(appointment.location)}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500" />
                            <span>{appointment.date} - {appointment.time}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <User className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500" />
                            <span className="truncate">{getBarberName(appointment.barber)}</span>
                          </div>
                          <div className="flex items-center font-semibold text-green-600">
                            <span>{getServicePrice(appointment.service)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(appointment);
                            }}
                            className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver Detalles
                          </Button>
                          {appointment.status === 'confirmada' && (
                            <>
                              <Button 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePaymentClick(appointment);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs"
                              >
                                <CreditCard className="w-3 h-3 mr-1" />
                                Cobrar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateAppointmentStatus(appointment.id, 'cancelada');
                                }}
                                className="text-xs bg-red-600 hover:bg-red-700"
                              >
                                <X className="w-3 h-3 mr-1" />
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
          </div>

          {/* Appointment Details - Single column sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6 sticky top-6">
              <h2 className="text-lg lg:text-xl font-bold mb-4 text-gray-900">Detalles de la Cita</h2>
              
              {selectedAppointment ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ID: #{selectedAppointment.id}</span>
                    <Badge className={getStatusColor(selectedAppointment.status)}>
                      {selectedAppointment.status}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Información del Cliente</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="font-medium text-gray-900">{selectedAppointment.customerName}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="text-sm text-gray-700">{selectedAppointment.customerPhone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate">{selectedAppointment.customerEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Detalles del Servicio</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="text-sm text-gray-700">{getLocationName(selectedAppointment.location)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="text-sm text-gray-700">{selectedAppointment.date} a las {selectedAppointment.time}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="text-sm text-gray-700">{getBarberName(selectedAppointment.barber)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="font-medium text-gray-900">{getServiceName(selectedAppointment.service)}</span>
                        <span className="font-bold text-lg text-green-600">
                          {getServicePrice(selectedAppointment.service)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-4">
                      Creada: {new Date(selectedAppointment.createdAt).toLocaleString()}
                    </p>

                    {selectedAppointment.status === 'confirmada' && (
                      <div className="space-y-2">
                        <Button 
                          onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completada')}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Marcar como Completada
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelada')}
                          className="w-full bg-red-600 hover:bg-red-700"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar Cita
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="font-medium text-gray-700">Selecciona una cita</p>
                  <p className="text-sm text-gray-600">Haz clic en cualquier cita para ver sus detalles completos</p>
                </div>
              )}
            </div>
          </div>
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

      {/* Cobro Express Modal */}
      <CobroExpress
        isOpen={showCobroExpress}
        onClose={() => setShowCobroExpress(false)}
      />
    </div>
  );
};

export default AdminPanel;
