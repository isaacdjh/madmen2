
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Scissors, User, CheckCircle, Star } from 'lucide-react';

const BookingPortal = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: '$45', duration: '45 min', popular: true },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: '$25', duration: '30 min', popular: false },
    { id: 'cut-beard', name: 'Corte + Barba', price: '$65', duration: '75 min', popular: true },
    { id: 'shave', name: 'Afeitado Tradicional', price: '$35', duration: '45 min', popular: false },
    { id: 'treatments', name: 'Tratamientos Especiales', price: '$40', duration: '60 min', popular: false },
  ];

  const barbers = [
    { id: 'carlos', name: 'Carlos Mendoza', specialty: 'Cortes Clásicos', experience: '8 años', rating: 4.9 },
    { id: 'miguel', name: 'Miguel Rodríguez', specialty: 'Barbas y Afeitado', experience: '12 años', rating: 4.8 },
    { id: 'antonio', name: 'Antonio López', specialty: 'Estilos Modernos', experience: '6 años', rating: 4.7 },
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-barbershop-gold/20 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-barbershop-gold" />
            </div>
            <h2 className="text-4xl font-bold text-barbershop-dark mb-4">Portal de Reservas</h2>
            <p className="text-muted-foreground text-lg">Reserva tu cita en 4 sencillos pasos</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Step 1: Date Selection */}
            <Card className="card-hover border-2 hover:border-barbershop-gold/50">
              <CardHeader className="bg-gradient-to-r from-barbershop-dark to-barbershop-navy text-white rounded-t-lg">
                <CardTitle className="flex items-center text-barbershop-gold">
                  <Calendar className="w-6 h-6 mr-3" />
                  1. Elige fecha y hora
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-6">
                  Selecciona el momento que mejor se adapte a tu agenda con disponibilidad en tiempo real.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-3 text-barbershop-dark">Fecha</label>
                    <input
                      type="date"
                      className="w-full p-3 border-2 rounded-lg focus:border-barbershop-gold focus:outline-none transition-colors"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-3 text-barbershop-dark">Hora disponible</label>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.slice(0, 9).map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "text-sm font-medium transition-all duration-300",
                            selectedTime === time 
                              ? "bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90" 
                              : "border-barbershop-gold/50 text-barbershop-dark hover:bg-barbershop-gold/10"
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

            {/* Step 2: Service Selection */}
            <Card className="card-hover border-2 hover:border-barbershop-gold/50">
              <CardHeader className="bg-gradient-to-r from-barbershop-dark to-barbershop-navy text-white rounded-t-lg">
                <CardTitle className="flex items-center text-barbershop-gold">
                  <Scissors className="w-6 h-6 mr-3" />
                  2. Selecciona servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-6">
                  Explora nuestro catálogo completo de servicios con precios y duración detallados.
                </p>
                
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedService === service.id 
                          ? 'border-barbershop-gold bg-barbershop-gold/10 shadow-lg' 
                          : 'border-gray-200 hover:border-barbershop-gold/50 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-barbershop-dark">{service.name}</h4>
                            {service.popular && (
                              <span className="bg-barbershop-gold text-barbershop-dark text-xs px-2 py-1 rounded-full font-bold">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{service.duration}</p>
                        </div>
                        <span className="font-bold text-xl text-barbershop-gold">{service.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Barber Selection */}
            <Card className="card-hover border-2 hover:border-barbershop-gold/50">
              <CardHeader className="bg-gradient-to-r from-barbershop-dark to-barbershop-navy text-white rounded-t-lg">
                <CardTitle className="flex items-center text-barbershop-gold">
                  <User className="w-6 h-6 mr-3" />
                  3. Elige tu barbero
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-6">
                  Reserva con tu barbero favorito según su disponibilidad actualizada.
                </p>
                
                <div className="space-y-4">
                  {barbers.map((barber) => (
                    <div
                      key={barber.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedBarber === barber.id 
                          ? 'border-barbershop-gold bg-barbershop-gold/10 shadow-lg' 
                          : 'border-gray-200 hover:border-barbershop-gold/50 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedBarber(barber.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-barbershop-dark text-lg">{barber.name}</h4>
                          <p className="text-sm text-muted-foreground">{barber.specialty}</p>
                          <p className="text-xs text-muted-foreground">{barber.experience} de experiencia</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-barbershop-gold fill-current" />
                          <span className="font-bold text-barbershop-gold">{barber.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Confirmation */}
            <Card className="card-hover border-2 hover:border-barbershop-gold/50">
              <CardHeader className="bg-gradient-to-r from-barbershop-dark to-barbershop-navy text-white rounded-t-lg">
                <CardTitle className="flex items-center text-barbershop-gold">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  4. Confirmación
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-6">
                  Recibe confirmación por correo y SMS con opción de cancelar hasta 3 horas antes.
                </p>
                
                {selectedDate && selectedTime && selectedService && selectedBarber ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-green-800 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Resumen de tu reserva:
                    </h4>
                    <div className="text-sm text-green-700 space-y-2">
                      <p><strong>Fecha:</strong> {selectedDate}</p>
                      <p><strong>Hora:</strong> {selectedTime}</p>
                      <p><strong>Servicio:</strong> {services.find(s => s.id === selectedService)?.name}</p>
                      <p><strong>Barbero:</strong> {barbers.find(b => b.id === selectedBarber)?.name}</p>
                      <p><strong>Precio:</strong> {services.find(s => s.id === selectedService)?.price}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-6">
                    <p className="text-sm text-gray-600 text-center">
                      Completa los pasos anteriores para ver el resumen de tu reserva.
                    </p>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-bold py-3 text-lg rounded-lg transition-all duration-300 hover:scale-105 shadow-lg" 
                  disabled={!selectedDate || !selectedTime || !selectedService || !selectedBarber}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar Reserva
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPortal;
