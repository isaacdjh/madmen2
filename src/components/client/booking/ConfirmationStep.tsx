
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Mail, MapPin, Scissors } from 'lucide-react';

interface ConfirmationStepProps {
  formData: any;
  services: any[];
  locations: any[];
  availableBarbers: any[];
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onPrevious: () => void;
}

const ConfirmationStep = ({ 
  formData, 
  services, 
  locations, 
  availableBarbers, 
  isSubmitting, 
  onSubmit, 
  onPrevious 
}: ConfirmationStepProps) => {
  const getLocationName = (id: string) => locations.find(l => l.id === id)?.name || '';
  const getBarberName = (id: string) => {
    const barber = availableBarbers.find(b => b.id === id);
    return barber?.name || id;
  };
  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-barbershop-gold" />
          Confirmar Reserva
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg mb-4">Resumen de tu cita</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-barbershop-gold" />
                <span className="font-medium">Cliente:</span>
                <span>{formData.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-barbershop-gold" />
                <span className="font-medium">Teléfono:</span>
                <span>{formData.phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-barbershop-gold" />
                <span className="font-medium">Email:</span>
                <span>{formData.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-barbershop-gold" />
                <span className="font-medium">Servicio:</span>
                <span>{getServiceName(formData.service)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-barbershop-gold" />
                <span className="font-medium">Centro:</span>
                <span>{getLocationName(formData.location)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-barbershop-gold" />
                <span className="font-medium">Barbero:</span>
                <span>{getBarberName(formData.barber)}</span>
                {formData.preferredBarber && formData.barber === formData.preferredBarber && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Tu preferido
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-barbershop-gold" />
                <span className="font-medium">Fecha:</span>
                <span>{formData.date}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-barbershop-gold" />
                <span className="font-medium">Hora:</span>
                <span>{formData.time}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Precio:</span>
                <span className="text-barbershop-gold">
                  {services.find(s => s.id === formData.service)?.price}€
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={onPrevious}
              disabled={isSubmitting}
            >
              Anterior
            </Button>
            
            <Button 
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-barbershop-gold hover:bg-barbershop-gold/90"
            >
              {isSubmitting ? 'Reservando...' : 'Confirmar Reserva'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfirmationStep;
