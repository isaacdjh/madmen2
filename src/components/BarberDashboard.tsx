
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Users, 
  Clock, 
  Scissors, 
  LogOut,
  DollarSign,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { getAllAppointments, updateAppointmentStatus } from '@/lib/supabase-helpers';
import ClientManagement from './ClientManagement';
import type { Appointment } from '@/lib/supabase-helpers';

interface BarberDashboardProps {
  onLogout: () => void;
}

const BarberDashboard = ({ onLogout }: BarberDashboardProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Obtener información del barbero desde localStorage
  const barberSession = JSON.parse(localStorage.getItem('barberSession') || '{}');
  const barberName = barberSession.barberName || 'Barbero';

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const allAppointments = await getAllAppointments();
      // Filtrar citas del barbero actual
      const barberAppointments = allAppointments.filter(
        appointment => appointment.barber.toLowerCase().includes(barberName.toLowerCase())
      );
      setAppointments(barberAppointments);
    } catch (error) {
      console.error('Error loading barber appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      await loadAppointments(); // Recargar las citas
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.appointment_date === today);
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.appointment_date > today);
  };

  const getCompletedAppointments = () => {
    return appointments.filter(apt => apt.status === 'completada');
  };

  const handleLogout = () => {
    localStorage.removeItem('barberSession');
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-barbershop-gold mx-auto mb-4"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-barbershop-dark text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Panel de {barberName}</h1>
            <p className="text-barbershop-gold text-sm">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-barbershop-dark">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Hoy</TabsTrigger>
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>

          {/* Citas de Hoy */}
          <TabsContent value="today" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Citas Hoy</p>
                      <p className="text-2xl font-bold text-barbershop-dark">
                        {getTodayAppointments().length}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-barbershop-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completadas</p>
                      <p className="text-2xl font-bold text-green-600">
                        {getTodayAppointments().filter(apt => apt.status === 'completada').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pendientes</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {getTodayAppointments().filter(apt => apt.status === 'confirmada').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Citas de Hoy</h3>
              {getTodayAppointments().length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No tienes citas programadas para hoy</p>
                  </CardContent>
                </Card>
              ) : (
                getTodayAppointments()
                  .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
                  .map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{appointment.appointment_time}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                appointment.status === 'completada' 
                                  ? 'bg-green-100 text-green-800'
                                  : appointment.status === 'confirmada'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                            <h4 className="font-semibold">{appointment.customer_name || 'Cliente'}</h4>
                            <p className="text-sm text-muted-foreground">{appointment.service}</p>
                            <p className="text-sm text-muted-foreground">{appointment.location}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            {appointment.status === 'confirmada' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(appointment.id, 'completada')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Completar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(appointment.id, 'cancelada')}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Cancelar
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          {/* Próximas Citas */}
          <TabsContent value="upcoming" className="space-y-4">
            <h3 className="text-lg font-semibold">Próximas Citas</h3>
            {getUpcomingAppointments().length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No tienes citas programadas próximamente</p>
                </CardContent>
              </Card>
            ) : (
              getUpcomingAppointments()
                .sort((a, b) => {
                  const dateComparison = a.appointment_date.localeCompare(b.appointment_date);
                  return dateComparison !== 0 ? dateComparison : a.appointment_time.localeCompare(b.appointment_time);
                })
                .map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {new Date(appointment.appointment_date).toLocaleDateString('es-ES')} - {appointment.appointment_time}
                            </span>
                          </div>
                          <h4 className="font-semibold">{appointment.customer_name || 'Cliente'}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.service}</p>
                          <p className="text-sm text-muted-foreground">{appointment.location}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appointment.status === 'confirmada'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          {/* Clientes */}
          <TabsContent value="clients">
            <ClientManagement isBarberView={true} />
          </TabsContent>

          {/* Estadísticas */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Citas</p>
                      <p className="text-2xl font-bold text-barbershop-dark">
                        {appointments.length}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-barbershop-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completadas</p>
                      <p className="text-2xl font-bold text-green-600">
                        {getCompletedAppointments().length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tasa Éxito</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {appointments.length > 0 
                          ? Math.round((getCompletedAppointments().length / appointments.length) * 100)
                          : 0}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Este Mes</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {appointments.filter(apt => {
                          const aptDate = new Date(apt.appointment_date);
                          const now = new Date();
                          return aptDate.getMonth() === now.getMonth() && 
                                 aptDate.getFullYear() === now.getFullYear();
                        }).length}
                      </p>
                    </div>
                    <Scissors className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Servicios Más Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(
                    appointments.reduce((acc, apt) => {
                      acc[apt.service] = (acc[apt.service] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([service, count]) => (
                      <div key={service} className="flex justify-between items-center">
                        <span className="text-sm">{service}</span>
                        <span className="text-sm font-semibold">{count} citas</span>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BarberDashboard;
