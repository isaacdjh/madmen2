import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, Scissors, CheckCircle } from 'lucide-react';

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

interface Barber {
  id: number;
  name: string;
}

interface BookingData {
  location: number | null;
  service: number | null;
  barber: number | null;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

interface ClientBookingFormProps {
  onBack: () => void;
}

const ClientBookingForm = ({ onBack }: ClientBookingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    location: null,
    service: null,
    barber: null,
    date: '',
    time: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
  });

  const locations: Location[] = [
    { id: 1, name: 'Mad Men Chamberí', address: 'Calle de Sta Engracia, 131', phone: '+34 910 52 78 65' },
    { id: 2, name: 'Mad Men Ríos Rosas', address: 'Calle de Bretón de los Herreros, 11', phone: '+34 91 442 37 85' },
    { id: 3, name: 'Mad Men Arapiles', address: 'Calle de Arapiles, 7', phone: '+34 91 593 92 49' },
  ];

  const services: Service[] = [
    { id: 1, name: 'Corte de pelo', price: 20 },
    { id: 2, name: 'Arreglo de barba', price: 15 },
    { id: 3, name: 'Afeitado clásico', price: 25 },
  ];

  const barbers: Barber[] = [
    { id: 1, name: 'Carlos' },
    { id: 2, name: 'Miguel' },
    { id: 3, name: 'David' },
  ];

  const updateBookingData = (key: keyof BookingData, value: any) => {
    setBookingData({ ...bookingData, [key]: value });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const getSelectedLocationName = () => {
    const location = locations.find((loc) => loc.id === bookingData.location);
    return location ? location.name : 'No seleccionado';
  };

  const getSelectedServiceName = () => {
    const service = services.find((serv) => serv.id === bookingData.service);
    return service ? service.name : 'No seleccionado';
  };

    const getSelectedServicePrice = () => {
    const service = services.find((serv) => serv.id === bookingData.service);
    return service ? service.price + '€' : 'No seleccionado';
  };

  const getSelectedBarberName = () => {
    const barber = barbers.find((barb) => barb.id === bookingData.barber);
    return barber ? barber.name : 'No seleccionado';
  };

  const handleConfirmBooking = () => {
    console.log('Reserva confirmada:', bookingData);
    alert('¡Reserva confirmada! Te enviaremos un email de confirmación.');
    onBack();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Selecciona una ubicación
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingData.location && (
                <div className="bg-card border border-primary/20 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-bold mb-4 text-primary">Detalles de tu cita:</h3>
                  <div className="space-y-2 text-sm text-card-foreground">
                    <p><strong>Ubicación:</strong> {getSelectedLocationName()}</p>
                    <p><strong>Servicio:</strong> {getSelectedServiceName()}</p>
                    <p><strong>Barbero:</strong> {getSelectedBarberName()}</p>
                    <p><strong>Fecha:</strong> {bookingData.date}</p>
                    <p><strong>Hora:</strong> {bookingData.time}</p>
                  </div>
                </div>
              )}
              
              <div className="grid gap-4">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      bookingData.location === location.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => updateBookingData('location', location.id)}
                  >
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                    <p className="text-sm text-muted-foreground">{location.phone}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                Selecciona un servicio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      bookingData.service === service.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => updateBookingData('service', service.id)}
                  >
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.price}€</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Selecciona un barbero
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      bookingData.barber === barber.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => updateBookingData('barber', barber.id)}
                  >
                    <h3 className="font-semibold">{barber.name}</h3>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <label htmlFor="date" className="block text-sm font-medium text-muted-foreground">
                  Fecha:
                </label>
                <input
                  type="date"
                  id="date"
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-primary/50 focus:border-primary text-sm"
                  value={bookingData.date}
                  onChange={(e) => updateBookingData('date', e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="time" className="block text-sm font-medium text-muted-foreground">
                  Hora:
                </label>
                <select
                  id="time"
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-primary/50 focus:border-primary text-sm"
                  value={bookingData.time}
                  onChange={(e) => updateBookingData('time', e.target.value)}
                >
                  <option value="">Selecciona una hora</option>
                  {[...Array(12)].map((_, i) => {
                    const hour = i + 9;
                    return (
                      <>
                        <option key={`${hour}:00`} value={`${hour}:00`}>{`${hour}:00`}</option>
                        <option key={`${hour}:30`} value={`${hour}:30`}>{`${hour}:30`}</option>
                      </>
                    );
                  })}
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor="customerName" className="block text-sm font-medium text-muted-foreground">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="customerName"
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-primary/50 focus:border-primary text-sm"
                  value={bookingData.customerName}
                  onChange={(e) => updateBookingData('customerName', e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="customerPhone" className="block text-sm font-medium text-muted-foreground">
                  Teléfono:
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-primary/50 focus:border-primary text-sm"
                  value={bookingData.customerPhone}
                  onChange={(e) => updateBookingData('customerPhone', e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="customerEmail" className="block text-sm font-medium text-muted-foreground">
                  Email:
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-primary/50 focus:border-primary text-sm"
                  value={bookingData.customerEmail}
                  onChange={(e) => updateBookingData('customerEmail', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Confirmar reserva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
                <h3 className="font-bold mb-4 text-primary">Resumen de tu cita:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span><strong>Ubicación:</strong> {getSelectedLocationName()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-primary" />
                    <span><strong>Servicio:</strong> {getSelectedServiceName()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span><strong>Barbero:</strong> {getSelectedBarberName()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span><strong>Fecha:</strong> {bookingData.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span><strong>Hora:</strong> {bookingData.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span><strong>Cliente:</strong> {bookingData.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span><strong>Teléfono:</strong> {bookingData.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span><strong>Email:</strong> {bookingData.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-primary/20">
                    <span className="text-lg font-bold text-primary">Precio: {getSelectedServicePrice()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  Al confirmar esta reserva, recibirás un email de confirmación con todos los detalles. 
                  Si necesitas hacer cambios, puedes contactarnos por teléfono.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-12">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            <div className="flex items-center gap-4">
              <Scissors className="w-6 h-6" />
              <span>Nueva Reserva</span>
            </div>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </CardHeader>
        <CardContent className="pl-6 pt-0">
          {renderStepContent()}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button variant="secondary" onClick={prevStep}>
                Anterior
              </Button>
            )}
            {currentStep < 4 ? (
              <Button onClick={nextStep}>Siguiente</Button>
            ) : (
              <Button onClick={handleConfirmBooking}>Confirmar Reserva</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientBookingForm;
