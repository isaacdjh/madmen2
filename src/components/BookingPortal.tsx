
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Scissors, User, CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllBarbers, type Barber } from '@/lib/supabase-helpers';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: 'corte' | 'barba' | 'combo' | 'tratamiento';
  active: boolean;
}

const BookingPortal = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar servicios desde localStorage
      const storedServices = localStorage.getItem('services');
      if (storedServices) {
        const allServices = JSON.parse(storedServices);
        setServices(allServices.filter((service: Service) => service.active));
      } else {
        // Servicios por defecto
        setServices([
          { id: 'classic-cut', name: 'Corte Clásico', description: 'Corte tradicional con tijera y máquina', price: 45, duration: 45, category: 'corte', active: true },
          { id: 'beard-trim', name: 'Arreglo de Barba', description: 'Perfilado y arreglo de barba', price: 25, duration: 30, category: 'barba', active: true },
          { id: 'cut-beard', name: 'Corte + Barba', description: 'Combo completo corte y barba', price: 65, duration: 75, category: 'combo', active: true },
          { id: 'shave', name: 'Afeitado Tradicional', description: 'Afeitado clásico con navaja', price: 35, duration: 45, category: 'barba', active: true },
          { id: 'treatments', name: 'Tratamientos Especiales', description: 'Tratamientos capilares y faciales', price: 40, duration: 60, category: 'tratamiento', active: true }
        ]);
      }

      // Cargar barberos desde Supabase
      const barbersData = await getAllBarbers();
      setBarbers(barbersData.filter(barber => barber.status === 'active'));
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // Barberos por defecto en caso de error
      setBarbers([
        { id: 'carlos', name: 'Carlos Mendoza', location: 'cristobal-bordiu', status: 'active', created_at: '', updated_at: '' },
        { id: 'miguel', name: 'Miguel Rodríguez', location: 'general-pardinas', status: 'active', created_at: '', updated_at: '' },
        { id: 'antonio', name: 'Antonio López', location: 'cristobal-bordiu', status: 'active', created_at: '', updated_at: '' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSpecialty = (index: number) => {
    const specialties = ['Cortes Clásicos', 'Barbas y Afeitado', 'Estilos Modernos', 'Tratamientos Especiales', 'Cortes y Barbas'];
    return specialties[index % specialties.length];
  };

  const getExperience = (index: number) => {
    const experiences = ['8 años', '12 años', '6 años', '10 años', '5 años'];
    return experiences[index % experiences.length];
  };

  const getRating = (index: number) => {
    const ratings = [4.9, 4.8, 4.7, 4.9, 4.8];
    return ratings[index % ratings.length];
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-barbershop-gold mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando portal de reservas...</p>
        </div>
      </div>
    );
  }

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
                            {service.category === 'combo' && (
                              <span className="bg-barbershop-gold text-barbershop-dark text-xs px-2 py-1 rounded-full font-bold">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{service.duration} min</p>
                        </div>
                        <span className="font-bold text-xl text-barbershop-gold">€{service.price}</span>
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
                  {barbers.map((barber, index) => (
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
                          <p className="text-sm text-muted-foreground">{getSpecialty(index)}</p>
                          <p className="text-xs text-muted-foreground">{getExperience(index)} de experiencia</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-barbershop-gold fill-current" />
                          <span className="font-bold text-barbershop-gold">{getRating(index)}</span>
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
                      <p><strong>Precio:</strong> €{services.find(s => s.id === selectedService)?.price}</p>
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
