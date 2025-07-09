import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, CheckCircle, Users } from 'lucide-react';

interface BarberSelectionStepProps {
  formData: any;
  setFormData: (fn: (prev: any) => any) => void;
  availableBarbers: any[];
  locations: any[];
  onNext: () => void;
  onPrevious: () => void;
}

const BarberSelectionStep = ({ 
  formData, 
  setFormData, 
  availableBarbers, 
  locations, 
  onNext,
  onPrevious 
}: BarberSelectionStepProps) => {
  const selectedLocation = locations.find(l => l.id === formData.location);
  const locationBarbers = availableBarbers.filter(barber => 
    barber.location === formData.location || !barber.location
  );

  const handleBarberSelect = (barberId: string) => {
    setFormData(prev => ({ ...prev, preferredBarber: barberId }));
  };

  const handleAnyBarberSelect = () => {
    setFormData(prev => ({ ...prev, preferredBarber: '' }));
  };

  return (
    <Card className="bg-background text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <User className="w-5 h-5 text-primary" />
          Selecciona tu Barbero
        </CardTitle>
        <p className="text-muted-foreground">
          En {selectedLocation?.name} - Elige tu barbero preferido o déjanos elegir por ti
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Opción "Cualquier barbero" */}
        <div
          className={`
            border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 
            ${formData.preferredBarber === '' 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }
          `}
          onClick={handleAnyBarberSelect}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Cualquier barbero disponible</h3>
                {formData.preferredBarber === '' && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Te asignaremos el barbero con más disponibilidad
              </p>
            </div>
          </div>
        </div>

        {/* Lista de barberos específicos */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">O elige un barbero específico:</h4>
          <div className="grid gap-3">
            {locationBarbers.map((barber) => (
              <div
                key={barber.id}
                className={`
                  border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 
                  ${formData.preferredBarber === barber.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
                onClick={() => handleBarberSelect(barber.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {barber.photo_url ? (
                      <img 
                        src={barber.photo_url} 
                        alt={barber.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{barber.name}</h3>
                      {formData.preferredBarber === barber.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Barbero profesional
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {locationBarbers.length === 0 && (
          <div className="text-center py-8">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No hay barberos disponibles
            </h3>
            <p className="text-muted-foreground">
              No hay barberos activos en esta ubicación
            </p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={onPrevious}
            className="border-border text-foreground hover:bg-muted"
          >
            Anterior
          </Button>
          <Button 
            onClick={onNext}
            disabled={formData.preferredBarber === undefined}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarberSelectionStep;