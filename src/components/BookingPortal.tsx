
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Scissors, User, CheckCircle } from 'lucide-react';

const BookingPortal = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: '$45', duration: '45 min' },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: '$25', duration: '30 min' },
    { id: 'cut-beard', name: 'Corte + Barba', price: '$65', duration: '75 min' },
    { id: 'shave', name: 'Afeitado Tradicional', price: '$35', duration: '45 min' },
    { id: 'treatments', name: 'Tratamientos', price: '$40', duration: '60 min' },
  ];

  const barbers = [
    { id: 'carlos', name: 'Carlos Mendoza', specialty: 'Cortes Clásicos', experience: '8 años' },
    { id: 'miguel', name: 'Miguel Rodríguez', specialty: 'Barbas y Afeitado', experience: '12 años' },
    { id: 'antonio', name: 'Antonio López', specialty: 'Estilos Modernos', experience: '6 años' },
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Portal de Reservas para Clientes</h2>
          <p className="text-muted-foreground text-lg">Reserva tu cita en 4 sencillos pasos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Step 1: Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                1. Elige fecha y hora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona el momento que mejor se adapte a tu agenda con disponibilidad en tiempo real.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fecha</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Hora disponible</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.slice(0, 6).map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="text-xs"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scissors className="w-5 h-5 mr-2 text-primary" />
                2. Selecciona servicio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Explora nuestro catálogo completo de servicios con precios y duración detallados.
              </p>
              
              <div className="space-y-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedService === service.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                      </div>
                      <span className="font-semibold text-primary">{service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Barber Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                3. Elige barbero
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Reserva con tu barbero favorito según su disponibilidad actualizada.
              </p>
              
              <div className="space-y-3">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedBarber === barber.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedBarber(barber.id)}
                  >
                    <h4 className="font-medium">{barber.name}</h4>
                    <p className="text-sm text-muted-foreground">{barber.specialty}</p>
                    <p className="text-xs text-muted-foreground">{barber.experience} de experiencia</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Confirmation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                4. Confirmación inmediata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Recibe confirmación por correo y SMS con opción de cancelar hasta 3 horas antes.
              </p>
              
              {selectedDate && selectedTime && selectedService && selectedBarber ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-green-800 mb-2">Resumen de tu reserva:</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>Fecha:</strong> {selectedDate}</p>
                    <p><strong>Hora:</strong> {selectedTime}</p>
                    <p><strong>Servicio:</strong> {services.find(s => s.id === selectedService)?.name}</p>
                    <p><strong>Barbero:</strong> {barbers.find(b => b.id === selectedBarber)?.name}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600">
                    Completa los pasos anteriores para ver el resumen de tu reserva.
                  </p>
                </div>
              )}
              
              <Button 
                className="w-full" 
                disabled={!selectedDate || !selectedTime || !selectedService || !selectedBarber}
              >
                Confirmar Reserva
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPortal;
