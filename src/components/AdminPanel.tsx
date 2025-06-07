
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Settings, Bell, Eye } from 'lucide-react';

const AdminPanel = () => {
  const todayAppointments = [
    { id: 1, client: 'Juan Pérez', service: 'Corte + Barba', time: '10:00', barber: 'Carlos', status: 'confirmed' },
    { id: 2, client: 'Miguel Torres', service: 'Corte Clásico', time: '11:30', barber: 'Miguel', status: 'pending' },
    { id: 3, client: 'Antonio Silva', service: 'Afeitado', time: '15:00', barber: 'Antonio', status: 'confirmed' },
    { id: 4, client: 'Luis García', service: 'Tratamiento', time: '16:30', barber: 'Carlos', status: 'completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'completed': return 'Completada';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">Panel de Administración</h2>
        <p className="text-muted-foreground">Gestiona todas las operaciones de tu barbería desde un solo lugar</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Citas Hoy</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos Hoy</p>
                <p className="text-2xl font-bold">$1,280</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes Nuevos</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ocupación</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Citas de Hoy</span>
            <Button size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Ver Todas
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{appointment.client}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{appointment.time}</p>
                    <p className="text-sm text-muted-foreground">{appointment.barber}</p>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusText(appointment.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Horarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Configura disponibilidad y bloques de tiempo</p>
            <Button className="w-full">Configurar Horarios</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Añade, edita o elimina servicios del catálogo</p>
            <Button className="w-full">Gestionar Servicios</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Ajustes generales de la barbería</p>
            <Button className="w-full">Configurar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
