
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Euro, Clock, User, LogOut, TrendingUp } from 'lucide-react';

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

interface BarberSession {
  id: string;
  name: string;
  location: string;
  loginTime: string;
}

interface BarberDashboardProps {
  onLogout: () => void;
}

const BarberDashboard = ({ onLogout }: BarberDashboardProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barberSession, setBarberSession] = useState<BarberSession | null>(null);

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

  useEffect(() => {
    // Cargar sesión del barbero
    const session = localStorage.getItem('barberSession');
    if (session) {
      setBarberSession(JSON.parse(session));
    }

    // Cargar citas
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

  const handleLogout = () => {
    localStorage.removeItem('barberSession');
    onLogout();
  };

  if (!barberSession) {
    return <div>Cargando...</div>;
  }

  // Filtrar solo las citas del barbero actual
  const myAppointments = appointments.filter(apt => apt.barber === barberSession.id);
  
  // Citas de hoy
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = myAppointments.filter(apt => apt.date === today && apt.status === 'confirmada');
  
  // Citas completadas del mes actual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyCompletedAppointments = myAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return apt.status === 'completada' && 
           aptDate.getMonth() === currentMonth && 
           aptDate.getFullYear() === currentYear;
  });

  // Calcular facturación
  const monthlyRevenue = monthlyCompletedAppointments.reduce((sum, apt) => {
    const service = services.find(s => s.id === apt.service);
    return sum + (service ? service.price : 0);
  }, 0);

  // Calcular comisión (10% si supera 3000€)
  const commission = monthlyRevenue > 3000 ? monthlyRevenue * 0.1 : 0;
  const hasCommission = monthlyRevenue > 3000;

  const getServiceName = (id: string) => {
    return services.find(s => s.id === id)?.name || id;
  };

  const getServicePrice = (id: string) => {
    return services.find(s => s.id === id)?.price || 0;
  };

  const getLocationName = (id: string) => {
    return locations.find(l => l.id === id)?.name || id;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-barbershop-dark text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">¡Hola, {barberSession.name}!</h1>
              <p className="text-barbershop-gold">{getLocationName(barberSession.location)}</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-barbershop-dark"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Citas Hoy</p>
                  <p className="text-2xl font-bold text-barbershop-dark">{todayAppointments.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-barbershop-gold" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completadas (Mes)</p>
                  <p className="text-2xl font-bold text-green-600">{monthlyCompletedAppointments.length}</p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Facturación (Mes)</p>
                  <p className="text-2xl font-bold text-barbershop-gold">{monthlyRevenue}€</p>
                </div>
                <Euro className="w-8 h-8 text-barbershop-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className={hasCommission ? 'border-green-500 bg-green-50' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Comisión (10%)</p>
                  <p className={`text-2xl font-bold ${hasCommission ? 'text-green-600' : 'text-gray-400'}`}>
                    {commission.toFixed(2)}€
                  </p>
                  {hasCommission && (
                    <p className="text-xs text-green-600 mt-1">¡Meta superada!</p>
                  )}
                </div>
                <TrendingUp className={`w-8 h-8 ${hasCommission ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Commission */}
        {!hasCommission && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso hacia comisión (3,000€)</span>
                  <span>{monthlyRevenue}/3,000€</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-barbershop-gold h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((monthlyRevenue / 3000) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Te faltan {(3000 - monthlyRevenue).toFixed(2)}€ para obtener el 10% de comisión
              </p>
            </CardContent>
          </Card>
        )}

        {/* Today's Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Citas de Hoy ({todayAppointments.length})</h2>
            <div className="space-y-4">
              {todayAppointments.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No tienes citas para hoy
                  </CardContent>
                </Card>
              ) : (
                todayAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-barbershop-dark">
                            {appointment.time}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {getServiceName(appointment.service)}
                          </p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <User className="w-4 h-4 mr-2" />
                          Cliente: ****** (Protegido)
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Servicio: {getServiceName(appointment.service)}</span>
                          <span className="font-bold text-barbershop-gold">
                            {getServicePrice(appointment.service)}€
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Monthly Summary */}
          <div>
            <h2 className="text-xl font-bold mb-4">Resumen del Mes</h2>
            <Card>
              <CardHeader>
                <CardTitle>Facturación Detallada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {services.map((service) => {
                    const serviceCount = monthlyCompletedAppointments.filter(apt => apt.service === service.id).length;
                    const serviceRevenue = serviceCount * service.price;
                    
                    if (serviceCount === 0) return null;
                    
                    return (
                      <div key={service.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <span className="font-medium">{service.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">({serviceCount}x)</span>
                        </div>
                        <span className="font-bold">{serviceRevenue}€</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Mes:</span>
                    <span className="text-barbershop-gold">{monthlyRevenue}€</span>
                  </div>
                  {hasCommission && (
                    <div className="flex justify-between items-center text-lg font-bold text-green-600 mt-2">
                      <span>Tu Comisión (10%):</span>
                      <span>{commission.toFixed(2)}€</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;
