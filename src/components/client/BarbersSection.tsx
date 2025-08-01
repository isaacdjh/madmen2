
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Star, MapPin, Calendar } from 'lucide-react';
import { getAllBarbers, type Barber } from '@/lib/supabase-helpers';

const BarbersSection = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBarbers();
      // Solo mostrar barberos activos
      setBarbers(data.filter(barber => barber.status === 'active'));
    } catch (error) {
      console.error('Error al cargar barberos:', error);
      // Barberos por defecto en caso de error
      setBarbers([
        {
          id: 'carlos',
          name: 'Carlos Mendoza',
          location: 'cristobal-bordiu',
          status: 'active',
          created_at: '',
          updated_at: ''
        },
        {
          id: 'miguel',
          name: 'Miguel Rodríguez',
          location: 'general-pardinas',
          status: 'active',
          created_at: '',
          updated_at: ''
        },
        {
          id: 'antonio',
          name: 'Antonio López',
          location: 'cristobal-bordiu',
          status: 'active',
          created_at: '',
          updated_at: ''
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationName = (location?: string) => {
    switch (location) {
      case 'cristobal-bordiu': return 'Mad Men Cristóbal Bordiú';
      case 'general-pardinas': return 'Mad Men General Pardiñas';
      default: return 'Mad Men';
    }
  };

  const getSpecialty = (index: number) => {
    const specialties = [
      'Cortes Clásicos',
      'Barbas y Afeitado',
      'Estilos Modernos',
      'Tratamientos Especiales',
      'Cortes y Barbas'
    ];
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <section id="barberos" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando nuestro equipo...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="barberos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block p-3 bg-primary/20 rounded-full mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">Nuestro Equipo</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conoce a nuestros barberos profesionales, cada uno con años de experiencia y pasión por su oficio
          </p>
        </div>

        {barbers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hay barberos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {barbers.map((barber, index) => (
              <Card key={barber.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-card">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <Avatar className="w-24 h-24 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <AvatarImage 
                        src={barber.photo_url || undefined} 
                        alt={barber.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-lg">
                        {getInitials(barber.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">{barber.name}</h3>
                  <p className="text-primary font-medium mb-2">{getSpecialty(index)}</p>
                  <p className="text-sm text-muted-foreground mb-4">{getExperience(index)} de experiencia</p>
                  
                  <div className="flex items-center justify-center mb-4">
                    <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-sm text-muted-foreground">{getLocationName(barber.location)}</span>
                  </div>

                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-4 h-4 text-primary fill-current" 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-primary">{getRating(index)}</span>
                  </div>

                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group-hover:scale-105 transition-transform duration-300"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar con {barber.name.split(' ')[0]}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BarbersSection;
