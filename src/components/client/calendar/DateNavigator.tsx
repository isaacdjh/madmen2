
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateNavigatorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  locations: Array<{ id: string; name: string }>;
}

const DateNavigator = ({ 
  selectedDate, 
  setSelectedDate, 
  selectedLocation, 
  setSelectedLocation,
  locations 
}: DateNavigatorProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            disabled={format(selectedDate, 'yyyy-MM-dd') <= format(new Date(), 'yyyy-MM-dd')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-base sm:text-lg font-semibold min-w-[180px] sm:min-w-[200px] text-center">
            {format(selectedDate, 'EEEE, dd \'de\' MMMM', { locale: es })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedDate(new Date())}
          className="text-barbershop-gold"
        >
          Hoy
        </Button>
      </div>

      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
        <SelectTrigger className="w-full sm:w-[250px]">
          <SelectValue placeholder="Seleccionar centro" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DateNavigator;
