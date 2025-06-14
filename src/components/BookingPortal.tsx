import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Scissors, User, CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllBarbers, getAllServices, type Barber, type Service } from '@/lib/supabase-helpers';

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
      const servicesData = await getAllServices();
      setServices(servicesData.filter((service: Service) => service.active));
      const barbersData = await getAllBarbers();
      setBarbers(barbersData.filter(barber => barber.status === 'active'));
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setServices([
        { id: 'classic-cut', name: 'Corte Clásico', description: 'Corte tradicional con tijera y máquina', price: 45, duration: 45, category: 'corte', active: true, created_at: '', updated_at: '' },
        { id: 'beard-trim', name: 'Arreglo de Barba', description: 'Perfilado y arreglo de barba', price: 25, duration: 30, category: 'barba', active: true, created_at: '', updated_at: '' },
        { id: 'cut-beard', name: 'Corte + Barba', description: 'Combo completo corte y barba', price: 65, duration: 75, category: 'combo', active: true, created_at: '', updated_at: '' }
      ]);
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
          <p className="mt-4 text-muted-foreground text-sm">Cargando portal de reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 md:py-8">
      <div className="max-w-full px-4 sm:px-6 md:px-8 mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block p-3 bg-barbershop-gold/20 rounded-full mb-4">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-barbershop-gold" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-barbershop-dark mb-4">Portal de Reservas</h2>
            <p className="text-muted-foreground text-base md:text-lg leading-normal">Reserva tu cita en 4 sencillos pasos</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
            {/* Aquí continúan los pasos con mejoras responsivas que puedes aplicar en los botones, inputs y grids internos */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPortal;
