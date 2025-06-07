
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientBookingFormProps {
  onBack: () => void;
}

const ClientBookingForm = ({ onBack }: ClientBookingFormProps) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    location: '',
    service: '',
    barber: '',
    date: '',
    time: '',
    customerName: '',
    customerPhone: '',
    customerEmail: ''
  });

  const locations = [
    { id: 'centro', name: 'Mad Men Centro', address: 'Av. Principal 123, Centro Histórico' },
    { id: 'polanco', name: 'Mad Men Polanco', address: 'Av. Presidente Masaryk 456, Polanco' }
  ];

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: '$45', duration: '45 min' },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: '$25', duration: '30 min' },
    { id: 'cut-beard', name: 'Corte + Barba', price: '$65', duration: '75 min' },
    { id: 'shave', name: 'Afeitado Tradicional', price: '$35', duration: '45 min' },
    { id: 'treatments', name: 'Tratamientos Especiales', price: '$40', duration: '60 min' }
  ];

  const barbers = [
    { id: 'carlos', name: 'Carlos Mendoza', specialty: 'Cortes Clásicos' },
    { id: 'miguel', name: 'Miguel Rodríguez', specialty: 'Barbas y Afeitado' },
    { id: 'antonio', name: 'Antonio López', specialty: 'Estilos Modernos' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Simular guardado de cita
    const appointment = {
      id: Date.now().toString(),
      ...bookingData,
      status: 'confirmada',
      createdAt: new Date().toISOString()
    };
    
    // Guardar en localStorage para simular base de datos
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    setStep(5);
  };

  const updateBookingData = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  if (step === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-12">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-barbershop-dark mb-4">¡Cita Confirmada!</h2>
                <p className="text-muted-foreground mb-8">
                  Tu cita ha sido reservada exitosamente. Recibirás una confirmación por email y SMS.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-bold mb-4">Detalles de tu cita:</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Ubicación:</strong> {locations.find(l => l.id === bookingData.location)?.name}</p>
                    <p><strong>Servicio:</strong> {services.find(s => s.id === bookingData.service)?.name}</p>
                    <p><strong>Barbero:</strong> {barbers.find(b => b.id === bookingData.barber)?.name}</p>
                    <p><strong>Fecha:</strong> {bookingData.date}</p>
                    <p><strong>Hora:</strong> {bookingData.time}</p>
                    <p><strong>Cliente:</strong> {bookingData.customerName}</p>
                  </div>
                </div>
                <Button onClick={onBack} className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90">
                  Volver al Inicio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={step === 1 ? onBack : handleBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? 'Volver' : 'Anterior'}
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-barbershop-dark">Reservar Cita</h1>
              <p className="text-muted-foreground">Paso {step} de 4</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    step >= stepNum 
                      ? "bg-barbershop-gold text-barbershop-dark" 
                      : "bg-gray-200 text-gray-500"
                  )}>
                    {stepNum}
                  </div>
                  {stepNum < 4 && (
                    <div className={cn(
                      "w-12 h-1 mx-2",
                      step > stepNum ? "bg-barbershop-gold" : "bg-gray-200"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-barbershop-gold" />
                  Selecciona Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className={cn(
                        "p-4 border-2 rounded-lg cursor-pointer transition-all",
                        bookingData.location === location.id
                          ? "border-barbershop-gold bg-barbershop-gold/10"
                          : "border-gray-200 hover:border-barbershop-gold/50"
                      )}
                      onClick={() => updateBookingData('location', location.id)}
                    >
                      <h3 className="font-bold text-barbershop-dark">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">{location.address}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-barbershop-gold" />
                  Selecciona Servicio, Barbero y Horario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Services */}
                <div>
                  <h3 className="font-bold mb-4">Servicios</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={cn(
                          "p-3 border-2 rounded-lg cursor-pointer transition-all",
                          bookingData.service === service.id
                            ? "border-barbershop-gold bg-barbershop-gold/10"
                            : "border-gray-200 hover:border-barbershop-gold/50"
                        )}
                        onClick={() => updateBookingData('service', service.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.duration}</p>
                          </div>
                          <span className="font-bold text-barbershop-gold">{service.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Barbers */}
                <div>
                  <h3 className="font-bold mb-4">Barberos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {barbers.map((barber) => (
                      <div
                        key={barber.id}
                        className={cn(
                          "p-3 border-2 rounded-lg cursor-pointer transition-all",
                          bookingData.barber === barber.id
                            ? "border-barbershop-gold bg-barbershop-gold/10"
                            : "border-gray-200 hover:border-barbershop-gold/50"
                        )}
                        onClick={() => updateBookingData('barber', barber.id)}
                      >
                        <h4 className="font-bold">{barber.name}</h4>
                        <p className="text-sm text-muted-foreground">{barber.specialty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-bold mb-2 block">Fecha</Label>
                    <Input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => updateBookingData('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label className="font-bold mb-2 block">Hora</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.slice(0, 6).map((time) => (
                        <Button
                          key={time}
                          variant={bookingData.time === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateBookingData('time', time)}
                          className={cn(
                            bookingData.time === time 
                              ? "bg-barbershop-gold text-barbershop-dark" 
                              : "border-barbershop-gold/50"
                          )}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-6 h-6 mr-3 text-barbershop-gold" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="font-bold">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={bookingData.customerName}
                      onChange={(e) => updateBookingData('customerName', e.target.value)}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="font-bold">Teléfono</Label>
                    <Input
                      id="phone"
                      value={bookingData.customerPhone}
                      onChange={(e) => updateBookingData('customerPhone', e.target.value)}
                      placeholder="+52 (55) 1234-5678"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email" className="font-bold">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.customerEmail}
                      onChange={(e) => updateBookingData('customerEmail', e.target.value)}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-barbershop-gold" />
                  Confirmar Reserva
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold mb-4">Resumen de tu cita:</h3>
                  <div className="space-y-2">
                    <p><strong>Ubicación:</strong> {locations.find(l => l.id === bookingData.location)?.name}</p>
                    <p><strong>Servicio:</strong> {services.find(s => s.id === bookingData.service)?.name}</p>
                    <p><strong>Barbero:</strong> {barbers.find(b => b.id === bookingData.barber)?.name}</p>
                    <p><strong>Fecha:</strong> {bookingData.date}</p>
                    <p><strong>Hora:</strong> {bookingData.time}</p>
                    <p><strong>Cliente:</strong> {bookingData.customerName}</p>
                    <p><strong>Teléfono:</strong> {bookingData.customerPhone}</p>
                    <p><strong>Email:</strong> {bookingData.customerEmail}</p>
                    <p><strong>Precio:</strong> {services.find(s => s.id === bookingData.service)?.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <div></div>
            <div className="space-x-4">
              {step < 4 ? (
                <Button 
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !bookingData.location) ||
                    (step === 2 && (!bookingData.service || !bookingData.barber || !bookingData.date || !bookingData.time)) ||
                    (step === 3 && (!bookingData.customerName || !bookingData.customerPhone || !bookingData.customerEmail))
                  }
                  className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
                >
                  Siguiente
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
                >
                  Confirmar Reserva
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientBookingForm;
