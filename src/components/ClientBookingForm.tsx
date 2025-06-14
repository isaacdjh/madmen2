
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, MapPin, Scissors } from 'lucide-react';
import { toast } from 'sonner';
import { createOrGetClient, createAppointment, getBarbersWithSchedules } from '@/lib/supabase-helpers';
import AvailabilityCalendar from './client/AvailabilityCalendar';
import { useEffect } from 'react';

interface ClientBookingFormProps {
  onBack: () => void;
}

const ClientBookingForm = ({ onBack }: ClientBookingFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    preferredBarber: '', // Barbero preferido
    barber: '',
    location: '',
    date: '',
    time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableBarbers, setAvailableBarbers] = useState<any[]>([]);

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: 45, duration: 30 },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: 25, duration: 20 },
    { id: 'cut-beard', name: 'Corte + Barba', price: 65, duration: 45 },
    { id: 'shave', name: 'Afeitado Tradicional', price: 35, duration: 30 },
    { id: 'treatments', name: 'Tratamientos Especiales', price: 40, duration: 40 }
  ];

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  // Cargar barberos disponibles
  useEffect(() => {
    const loadBarbers = async () => {
      try {
        // Cargar barberos de ambas ubicaciones
        const [bordiu, pardinas] = await Promise.all([
          getBarbersWithSchedules('cristobal-bordiu'),
          getBarbersWithSchedules('general-pardinas')
        ]);
        
        const allBarbers = [...bordiu, ...pardinas].filter(barber => barber.status === 'active');
        setAvailableBarbers(allBarbers);
      } catch (error) {
        console.error('Error cargando barberos:', error);
      }
    };
    
    loadBarbers();
  }, []);

  const handleSlotSelect = (barber: string, date: string, time: string, location: string) => {
    console.log('Slot seleccionado:', { barber, date, time, location });
    
    setFormData(prev => ({
      ...prev,
      barber,
      date,
      time,
      location
    }));
    setStep(3); // Ir al paso final
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email || !formData.service || 
        !formData.barber || !formData.date || !formData.time || !formData.location) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creando cita con datos:', formData);
      
      // Crear o encontrar cliente
      const client = await createOrGetClient(formData.name, formData.phone, formData.email);
      
      // Obtener precio del servicio
      const selectedService = services.find(s => s.id === formData.service);
      
      // Crear cita
      const appointmentData = {
        client_id: client.id,
        location: formData.location,
        service: formData.service,
        barber: formData.barber,
        appointment_date: formData.date,
        appointment_time: formData.time,
        price: selectedService?.price,
        status: 'confirmada' as const
      };
      
      console.log('Datos de la cita a crear:', appointmentData);
      
      const newAppointment = await createAppointment(appointmentData);
      
      console.log('Cita creada exitosamente:', newAppointment);

      toast.success('¡Cita reservada con éxito!');
      
      // Resetear formulario y volver
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        preferredBarber: '',
        barber: '',
        location: '',
        date: '',
        time: ''
      });
      setStep(1);
      onBack();
      
    } catch (error) {
      console.error('Error al crear cita:', error);
      toast.error('Error al reservar la cita. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocationName = (id: string) => locations.find(l => l.id === id)?.name || '';
  const getBarberName = (id: string) => {
    const barber = availableBarbers.find(b => b.id === id);
    return barber?.name || id;
  };
  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-barbershop-dark hover:bg-barbershop-gold/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-barbershop-dark">Reservar Cita</h1>
            <p className="text-gray-600">Completa los pasos para reservar tu cita</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum === step 
                    ? 'bg-barbershop-gold text-white' 
                    : stepNum < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    stepNum < step ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-20">
            <span className="text-sm text-gray-600">Datos</span>
            <span className="text-sm text-gray-600">Horario</span>
            <span className="text-sm text-gray-600">Confirmar</span>
          </div>
        </div>

        {/* Step 1: Datos personales y servicio */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-barbershop-gold" />
                Datos Personales y Servicio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <Label htmlFor="service">Servicio *</Label>
                <Select value={formData.service} onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{service.name}</span>
                          <span className="text-barbershop-gold font-medium ml-4">{service.price}€</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sección para barbero preferido */}
              <div>
                <Label htmlFor="preferredBarber">Barbero preferido (opcional)</Label>
                <Select 
                  value={formData.preferredBarber} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, preferredBarber: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un barbero o déjalo en blanco para ver todos los horarios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin preferencia (mostrar todos los horarios)</SelectItem>
                    {availableBarbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{barber.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {locations.find(l => l.id === barber.location)?.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  Si seleccionas un barbero, solo verás sus horarios disponibles.
                  Si no seleccionas ninguno, podrás elegir entre todos los barberos disponibles.
                </p>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.phone || !formData.email || !formData.service}
                  className="bg-barbershop-gold hover:bg-barbershop-gold/90"
                >
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Selección de horario */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-barbershop-gold" />
                Selecciona Fecha y Hora
              </CardTitle>
              {formData.preferredBarber && (
                <div className="text-sm text-barbershop-gold bg-barbershop-gold/10 p-3 rounded-lg">
                  <User className="w-4 h-4 inline mr-2" />
                  Barbero seleccionado: <strong>{getBarberName(formData.preferredBarber)}</strong>
                  <p className="text-xs text-gray-600 mt-1">
                    Solo se mostrarán los horarios disponibles de este barbero.
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <AvailabilityCalendar 
                onSlotSelect={handleSlotSelect} 
                preferredBarber={formData.preferredBarber || undefined}
              />
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                >
                  Anterior
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmación */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-barbershop-gold" />
                Confirmar Reserva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Resumen de la cita */}
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg mb-4">Resumen de tu cita</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-barbershop-gold" />
                      <span className="font-medium">Cliente:</span>
                      <span>{formData.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-barbershop-gold" />
                      <span className="font-medium">Teléfono:</span>
                      <span>{formData.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-barbershop-gold" />
                      <span className="font-medium">Email:</span>
                      <span>{formData.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-barbershop-gold" />
                      <span className="font-medium">Servicio:</span>
                      <span>{getServiceName(formData.service)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-barbershop-gold" />
                      <span className="font-medium">Centro:</span>
                      <span>{getLocationName(formData.location)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-barbershop-gold" />
                      <span className="font-medium">Barbero:</span>
                      <span>{getBarberName(formData.barber)}</span>
                      {formData.preferredBarber && formData.barber === formData.preferredBarber && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Tu preferido
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-barbershop-gold" />
                      <span className="font-medium">Fecha:</span>
                      <span>{formData.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-barbershop-gold" />
                      <span className="font-medium">Hora:</span>
                      <span>{formData.time}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Precio:</span>
                      <span className="text-barbershop-gold">
                        {services.find(s => s.id === formData.service)?.price}€
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                  >
                    Anterior
                  </Button>
                  
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-barbershop-gold hover:bg-barbershop-gold/90"
                  >
                    {isSubmitting ? 'Reservando...' : 'Confirmar Reserva'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientBookingForm;
