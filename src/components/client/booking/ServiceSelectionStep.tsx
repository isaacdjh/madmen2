import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock, Scissors, User } from 'lucide-react';

interface ServiceSelectionStepProps {
  formData: any;
  setFormData: (data: any) => void;
  services: any[];
  onNext: () => void;
}

const ServiceSelectionStep = ({ 
  formData, 
  setFormData, 
  services, 
  onNext 
}: ServiceSelectionStepProps) => {
  const handleServiceSelect = (service: any) => {
    setFormData({
      ...formData,
      service: service.name,
      servicePrice: service.price,
      serviceDuration: service.duration
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'corte':
        return <Scissors className="w-5 h-5" />;
      case 'barba':
        return <User className="w-5 h-5" />;
      case 'combo':
        return <Check className="w-5 h-5" />;
      default:
        return <Scissors className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'corte':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'barba':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'combo':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Scissors className="w-5 h-5 text-primary" />
          Selecciona tu Servicio
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Elige el servicio que deseas reservar
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <Card 
              key={service.id}
              className={`cursor-pointer transition-all duration-200 border-2 ${
                formData.service === service.name 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(service.category)}
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                </div>
                
                {service.description && (
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {service.price}€
                  </div>
                </div>

                {formData.service === service.name && (
                  <div className="mt-3 flex items-center gap-2 text-primary">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Servicio seleccionado</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={onNext}
            disabled={!formData.service}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceSelectionStep;