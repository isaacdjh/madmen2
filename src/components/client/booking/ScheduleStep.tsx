
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';
import AvailabilityCalendar from '../AvailabilityCalendar';

interface ScheduleStepProps {
  formData: any;
  availableBarbers: any[];
  onSlotSelect: (barber: string, date: string, time: string, location: string) => void;
  onPrevious: () => void;
}

const ScheduleStep = ({ 
  formData, 
  availableBarbers, 
  onSlotSelect, 
  onPrevious 
}: ScheduleStepProps) => {
  const getBarberName = (id: string) => {
    const barber = availableBarbers.find(b => b.id === id);
    return barber?.name || id;
  };

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Calendar className="w-5 h-5 text-primary" />
          Selecciona Fecha y Hora
        </CardTitle>
        {formData.preferredBarber && (
          <div className="text-sm text-primary bg-primary/10 p-3 rounded-lg border border-primary/20">
            <User className="w-4 h-4 inline mr-2" />
            Barbero seleccionado: <strong>{getBarberName(formData.preferredBarber)}</strong>
            <p className="text-xs text-muted-foreground mt-1">
              Solo se mostrarán los horarios disponibles de este barbero.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <AvailabilityCalendar 
          onSlotSelect={onSlotSelect} 
          preferredBarber={formData.preferredBarber || undefined}
        />
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={onPrevious}
            className="border-border text-foreground hover:bg-muted"
          >
            Anterior
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleStep;
