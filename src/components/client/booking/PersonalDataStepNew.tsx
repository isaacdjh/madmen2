import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';

interface PersonalDataStepNewProps {
  formData: any;
  setFormData: (fn: (prev: any) => any) => void;
  services: any[];
  onNext: () => void;
  onPrevious: () => void;
}

const PersonalDataStepNew = ({ 
  formData, 
  setFormData, 
  services, 
  onNext,
  onPrevious 
}: PersonalDataStepNewProps) => {
  return (
    <Card className="bg-background text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <User className="w-5 h-5 text-primary" />
          Datos Personales
        </CardTitle>
        <p className="text-muted-foreground">Completa tus datos para confirmar la reserva</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-foreground">Nombre completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Tu nombre completo"
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-foreground">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Tu número de teléfono"
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email" className="text-foreground">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="tu@email.com"
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>


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
            disabled={!formData.name || !formData.phone || !formData.email}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDataStepNew;