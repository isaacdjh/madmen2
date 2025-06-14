
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface BarberSelectorProps {
  barbers: any[];
  selectedTimeSlot: string;
  isSlotAvailable: (barberId: string, time: string) => boolean;
  onBarberSelection: (barberId: string, time: string) => void;
}

const BarberSelector = ({ 
  barbers, 
  selectedTimeSlot, 
  isSlotAvailable, 
  onBarberSelection 
}: BarberSelectorProps) => {
  const availableBarbers = barbers.filter(barber => isSlotAvailable(barber.id, selectedTimeSlot));

  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-barbershop-gold" />
        Barberos disponibles para {selectedTimeSlot}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableBarbers.map((barber) => (
          <Button
            key={barber.id}
            variant="outline"
            onClick={() => onBarberSelection(barber.id, selectedTimeSlot)}
            className="h-16 sm:h-20 flex flex-col justify-center items-center text-left border-2 border-barbershop-gold/20 hover:border-barbershop-gold hover:bg-barbershop-gold/10 transition-all"
          >
            <span className="font-semibold text-barbershop-dark text-sm sm:text-base">{barber.name}</span>
            <span className="text-xs text-gray-600">{selectedTimeSlot}</span>
          </Button>
        ))}
      </div>
      
      {availableBarbers.length === 0 && (
        <p className="text-gray-500 text-center py-4">No hay barberos disponibles para esta hora</p>
      )}
    </div>
  );
};

export default BarberSelector;
