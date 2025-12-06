import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, CheckCircle } from 'lucide-react';

interface LocationStepProps {
  formData: any;
  setFormData: (fn: (prev: any) => any) => void;
  locations: any[];
  onNext: () => void;
}

const LocationStep = ({ 
  formData, 
  setFormData, 
  locations, 
  onNext 
}: LocationStepProps) => {
  const locationDetails = [
    {
      id: 'cristobal-bordiu',
      name: 'Mad Men Cristóbal Bordiú',
      address: 'Cristóbal Bordiú, 29, Madrid',
      phone: '+34 916 832 731',
      hours: 'Lun-Sáb: 10:00-21:00'
    },
    {
      id: 'general-pardinas',
      name: 'Mad Men General Pardiñas',
      address: 'General Pardiñas, 101, Madrid',
      phone: '+34 910 597 766',
      hours: 'Lun-Sáb: 10:00-21:00'
    },
    {
      id: 'retiro',
      name: 'Mad Men Retiro',
      address: 'Calle Alcalde Sainz de Baranda 53, 28009 Madrid',
      phone: '+34 912 231 715',
      hours: 'Lun-Vie: 11:00-21:00 | Sáb: 10:00-21:00 | Dom: 10:00-17:00',
      bookingUrl: 'https://booksy.com/es-es/instant-experiences/widget/160842'
    }
  ];

  const handleLocationSelect = (locationId: string) => {
    setFormData(prev => ({ ...prev, location: locationId }));
  };

  return (
    <Card className="bg-background text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <MapPin className="w-5 h-5 text-primary" />
          Selecciona tu Ubicación
        </CardTitle>
        <p className="text-muted-foreground">Elige el centro más cercano a ti</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {locationDetails.map((location) => (
            <div
              key={location.id}
              className={`
                border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 
                ${formData.location === location.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
              onClick={() => handleLocationSelect(location.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{location.name}</h3>
                    {formData.location === location.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{location.address}</p>
                  <p className="text-sm text-muted-foreground mb-1">📞 {location.phone}</p>
                  <p className="text-sm text-muted-foreground">🕒 {location.hours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={onNext}
            disabled={!formData.location}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationStep;