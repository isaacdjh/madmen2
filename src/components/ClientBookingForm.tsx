
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Clock, User, Phone, Mail, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { createOrGetClient, createAppointment } from '@/lib/supabase-helpers';

const services = [
  { id: 'classic-cut', name: 'Corte Clásico', price: 45 },
  { id: 'beard-trim', name: 'Arreglo de Barba', price: 25 },
  { id: 'cut-beard', name: 'Corte + Barba', price: 65 },
  { id: 'shave', name: 'Afeitado Tradicional', price: 35 },
  { id: 'treatments', name: 'Tratamientos Especiales', price: 40 }
];

const locations = [
  { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
  { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
];

const barbers = [
  { id: 'alejandro', name: 'Alejandro', location: 'cristobal-bordiu' },
  { id: 'carlos', name: 'Carlos', location: 'general-pardinas' },
  { id: 'miguel', name: 'Miguel', location: 'cristobal-bordiu' },
  { id: 'david', name: 'David', location: 'general-pardinas' }
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00'
];

interface ClientBookingFormProps {
  onBack?: () => void;
}

const ClientBookingForm = ({ onBack }: ClientBookingFormProps) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredBarbers = barbers.filter(barber => barber.location === selectedLocation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLocation || !selectedService || !selectedBarber || !selectedDate || !selectedTime || !customerName || !customerPhone || !customerEmail) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear o obtener cliente
      const client = await createOrGetClient(customerName, customerPhone, customerEmail);
      
      // Obtener precio del servicio
      const service = services.find(s => s.id === selectedService);
      const price = service?.price || 0;

      // Crear cita
      await createAppointment({
        client_id: client.id,
        location: selectedLocation,
        service: selectedService,
        barber: selectedBarber,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        price: price
      });

      toast.success('¡Cita reservada correctamente!', {
        description: `Te esperamos el ${format(selectedDate, 'dd/MM/yyyy', { locale: es })} a las ${selectedTime}`
      });

      // Limpiar formulario
      setSelectedLocation('');
      setSelectedService('');
      setSelectedBarber('');
      setSelectedDate(undefined);
      setSelectedTime('');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');

    } catch (error: any) {
      console.error('Error al reservar cita:', error);
      toast.error('Error al reservar la cita. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServicePrice = services.find(s => s.id === selectedService)?.price;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      )}
      
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-barbershop-dark">
            Reserva tu Cita
          </CardTitle>
          <p className="text-muted-foreground">
            Elige tu barbero y horario preferido
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos del cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-barbershop-dark flex items-center gap-2">
                <User className="w-5 h-5" />
                Tus Datos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer-name">Nombre Completo</Label>
                  <Input
                    id="customer-name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="customer-phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Tu número de teléfono"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="customer-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Selección de ubicación */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                Ubicación
              </Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una ubicación" />
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

            {/* Selección de servicio */}
            <div>
              <Label>Servicio</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{service.name}</span>
                        <span className="font-bold text-barbershop-gold ml-4">{service.price}€</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedServicePrice && (
                <p className="text-sm text-barbershop-gold font-bold mt-2">
                  Precio: {selectedServicePrice}€
                </p>
              )}
            </div>

            {/* Selección de barbero */}
            {selectedLocation && (
              <div>
                <Label>Barbero</Label>
                <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu barbero" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredBarbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Selección de fecha */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-4 h-4" />
                Fecha
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {selectedDate ? (
                      format(selectedDate, 'dd/MM/yyyy', { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Selección de hora */}
            {selectedDate && (
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  Hora
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-barbershop-gold text-barbershop-dark" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <Button
              type="submit"
              className="w-full bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Reservando...' : 'Reservar Cita'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientBookingForm;
