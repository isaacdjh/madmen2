import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, MapPin, User, Mail, Phone, Scissors } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FinalConfirmationStepProps {
  formData: any;
  services: any[];
  locations: any[];
  availableBarbers: any[];
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onPrevious: () => void;
}

const FinalConfirmationStep = ({ 
  formData, 
  services, 
  locations, 
  availableBarbers, 
  isSubmitting, 
  onSubmit,
  onPrevious 
}: FinalConfirmationStepProps) => {
  const selectedService = services.find(s => s.id === formData.service);
  const selectedLocation = locations.find(l => l.id === formData.location);
  const selectedBarber = availableBarbers.find(b => b.id === formData.barber);
  const preferredBarber = availableBarbers.find(b => b.id === formData.preferredBarber);

  const appointmentDate = formData.date ? new Date(formData.date + 'T00:00:00') : null;

  return (
    <Card className="bg-background text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Confirmar Reserva
        </CardTitle>
        <p className="text-muted-foreground">Revisa los detalles de tu cita antes de confirmar</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumen de la cita */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-foreground mb-3">Detalles de tu cita:</h3>
          
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{selectedLocation?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formData.location === 'cristobal-bordiu' ? 'Cristóbal Bordiú, 29' : 'General Pardiñas, 101'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">
                  {selectedBarber?.name || preferredBarber?.name || 'Cualquier barbero disponible'}
                </p>
                <p className="text-sm text-muted-foreground">Barbero profesional</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">
                  {appointmentDate ? format(appointmentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es }) : 'Fecha no seleccionada'}
                </p>
                <p className="text-sm text-muted-foreground">Fecha de la cita</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{formData.time}</p>
                <p className="text-sm text-muted-foreground">Hora de la cita</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Scissors className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{selectedService?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedService?.price}€ - {selectedService?.duration} min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Datos del cliente */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-foreground mb-3">Tus datos:</h3>
          
          <div className="grid gap-2">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-primary" />
              <span className="text-foreground">{formData.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-foreground">{formData.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-foreground">{formData.email}</span>
            </div>
          </div>
        </div>

        {/* Mensaje de confirmación */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Confirmación por email
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Te enviaremos un email de confirmación con todos los detalles de tu cita
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={onPrevious}
            disabled={isSubmitting}
            className="border-border text-foreground hover:bg-muted"
          >
            Anterior
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Confirmando...
              </div>
            ) : (
              'Confirmar Cita'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalConfirmationStep;