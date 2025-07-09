
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface TimeSlotInfo {
  time: string;
  availableBarbers: string[];
  totalBarbers: number;
}

interface TimeSlotGridProps {
  timeSlots: TimeSlotInfo[];
  selectedTimeSlot: string | null;
  preferredBarber?: string;
  onTimeSlotClick: (timeSlot: string) => void;
}

const TimeSlotGrid = ({ 
  timeSlots, 
  selectedTimeSlot, 
  preferredBarber, 
  onTimeSlotClick 
}: TimeSlotGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {timeSlots.map((slot) => {
        const isAvailable = slot.availableBarbers.length > 0;
        const isSelected = selectedTimeSlot === slot.time;
        
        return (
          <Button
            key={slot.time}
            variant={isSelected ? "default" : "outline"}
            onClick={() => isAvailable && onTimeSlotClick(slot.time)}
            disabled={!isAvailable}
            className={`
              h-12 sm:h-14 flex flex-col justify-center items-center text-xs sm:text-sm font-medium
              ${isSelected 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary' 
                : isAvailable 
                  ? 'border-border text-foreground hover:bg-muted hover:border-primary' 
                  : 'border-border text-muted-foreground cursor-not-allowed'
              }
            `}
          >
            <span className="font-semibold">{slot.time}</span>
            <span className="text-xs opacity-80">
              {isAvailable ? 
                (preferredBarber ? 'Disponible' : `${slot.availableBarbers.length} disponible${slot.availableBarbers.length > 1 ? 's' : ''}`) 
                : 'Ocupado'
              }
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default TimeSlotGrid;
