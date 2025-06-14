
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const CancelAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      loadAppointment();
    }
  }, [appointmentId]);

  const loadAppointment = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (name, email, phone)
        `)
        .eq('id', appointmentId)
        .single();

      if (error) throw error;

      if (data.status === 'cancelada') {
        setCancelled(true);
      }

      setAppointment(data);
    } catch (error) {
      console.error('Error cargando cita:', error);
      toast.error('No se pudo cargar la información de la cita');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!appointment) return;

    setCancelling(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelada' })
        .eq('id', appointmentId);

      if (error) throw error;

      setCancelled(true);
      toast.success('Cita cancelada exitosamente');
    } catch (error) {
      console.error('Error cancelando cita:', error);
      toast.error('Error al cancelar la cita');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getLocationName = (locationId: string) => {
    const locations = {
      'cristobal-bordiu': 'Mad Men Cristóbal Bordiú',
      'general-pardinas': 'Mad Men General Pardiñas'
    };
    return locations[locationId as keyof typeof locations] || locationId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-barbershop-dark mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información de la cita...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <CardTitle>Cita no encontrada</CardTitle>
            <CardDescription>
              No se pudo encontrar la cita solicitada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle>Cita Cancelada</CardTitle>
            <CardDescription>
              Tu cita ha sido cancelada exitosamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Detalles de la cita cancelada:</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Cliente:</span> {appointment.clients?.name}</p>
                  <p><span className="font-medium">Fecha:</span> {formatDate(appointment.appointment_date)}</p>
                  <p><span className="font-medium">Hora:</span> {appointment.appointment_time}</p>
                  <p><span className="font-medium">Barbero:</span> {appointment.barber}</p>
                  <p><span className="font-medium">Centro:</span> {getLocationName(appointment.location)}</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Cancelar Cita</CardTitle>
          <CardDescription>
            ¿Estás seguro de que quieres cancelar esta cita?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Detalles de la cita:</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Cliente:</span> {appointment.clients?.name}</p>
                <p><span className="font-medium">Fecha:</span> {formatDate(appointment.appointment_date)}</p>
                <p><span className="font-medium">Hora:</span> {appointment.appointment_time}</p>
                <p><span className="font-medium">Servicio:</span> {appointment.service}</p>
                <p><span className="font-medium">Barbero:</span> {appointment.barber}</p>
                <p><span className="font-medium">Centro:</span> {getLocationName(appointment.location)}</p>
                <p><span className="font-medium">Precio:</span> {appointment.price}€</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Importante:</strong> Una vez cancelada, no podrás deshacer esta acción. 
                Si cambias de opinión, tendrás que reservar una nueva cita.
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Volver
              </Button>
              <Button 
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1"
              >
                {cancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CancelAppointment;
