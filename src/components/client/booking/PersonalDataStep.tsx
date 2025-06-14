
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';

interface PersonalDataStepProps {
  formData: any;
  setFormData: (fn: (prev: any) => any) => void;
  services: any[];
  availableBarbers: any[];
  locations: any[];
  onNext: () => void;
}

const PersonalDataStep = ({ 
  formData, 
  setFormData, 
  services, 
  availableBarbers, 
  locations, 
  onNext 
}: PersonalDataStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-barbershop-gold" />
          Datos Personales y Servicio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Tu nombre completo"
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Tu número de teléfono"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <Label htmlFor="service">Servicio *</Label>
          <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un servicio" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  <div className="flex justify-between items-center w-full">
                    <span>{service.name}</span>
                    <span className="text-barbershop-gold font-medium ml-4">{service.price}€</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="preferredBarber">Barbero preferido (opcional)</Label>
          <Select 
            value={formData.preferredBarber} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, preferredBarber: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un barbero o déjalo en blanco para ver todos los horarios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sin preferencia (mostrar todos los horarios)</SelectItem>
              {availableBarbers.map((barber) => (
                <SelectItem key={barber.id} value={barber.id}>
                  <div className="flex justify-between items-center w-full">
                    <span>{barber.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {locations.find(l => l.id === barber.location)?.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            Si seleccionas un barbero, solo verás sus horarios disponibles.
            Si no seleccionas ninguno, podrás elegir entre todos los barberos disponibles.
          </p>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={onNext}
            disabled={!formData.name || !formData.phone || !formData.email || !formData.service}
            className="bg-barbershop-gold hover:bg-barbershop-gold/90"
          >
            Siguiente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDataStep;
