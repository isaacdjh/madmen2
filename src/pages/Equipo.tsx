import { Helmet } from 'react-helmet-async';
import ClientNavigation from '@/components/client/ClientNavigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Equipo = () => {
  const barbers = [
    {
      name: 'Isaac Hernández',
      location: 'Salamanca',
      specialty: 'Cortes Clásicos',
      experience: '8 años',
      image: '/lovable-uploads/isaac-barber.jpg',
    },
    {
      name: 'Carlos López',
      location: 'Salamanca',
      specialty: 'Degradados',
      experience: '6 años',
      image: null,
    },
    {
      name: 'Luis Urbiñez',
      location: 'Salamanca',
      specialty: 'Afeitado Tradicional',
      experience: '10 años',
      image: null,
    },
    {
      name: 'Randy Valdespino',
      location: 'Salamanca',
      specialty: 'Cortes Modernos',
      experience: '5 años',
      image: null,
    },
    {
      name: 'Jorge',
      location: 'Retiro',
      specialty: 'Barbería Integral',
      experience: '7 años',
      image: '/lovable-uploads/jorge-barber.jpg',
    },
    {
      name: 'Rudy',
      location: 'Retiro',
      specialty: 'Tratamientos de Barba',
      experience: '6 años',
      image: '/lovable-uploads/rudy-barber.jpg',
    },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <Helmet>
        <title>Nuestro Equipo | Mad Men Barbería Tradicional Madrid</title>
        <meta name="description" content="Conoce a nuestros barberos profesionales. Expertos con años de experiencia en cortes clásicos, degradados y afeitado tradicional." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <ClientNavigation onBookingClick={() => window.open('https://madmenbarberia.com/reserva', '_blank')} />
        
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <Link to="/">
              <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
            
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-primary mb-6">Nuestro Equipo</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Profesionales apasionados por la barbería tradicional. 
                Cada uno con su estilo único pero todos con el mismo compromiso de excelencia.
              </p>
            </div>
            
            {/* Salamanca Team */}
            <div className="mb-16">
              <div className="flex items-center justify-center gap-2 mb-8">
                <MapPin className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold text-primary">Mad Men Salamanca</h2>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
                {barbers.filter(b => b.location === 'Salamanca').map((barber, index) => (
                  <Card key={index} className="text-center hover:border-primary/50 transition-colors">
                    <CardContent className="pt-8 pb-6">
                      <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                        <AvatarImage src={barber.image || undefined} alt={barber.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                          {getInitials(barber.name)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold text-foreground mb-1">{barber.name}</h3>
                      <p className="text-primary text-sm font-medium mb-2">{barber.specialty}</p>
                      <div className="flex items-center justify-center text-muted-foreground text-sm">
                        <Award className="w-4 h-4 mr-1" />
                        {barber.experience}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Retiro Team */}
            <div className="mb-16">
              <div className="flex items-center justify-center gap-2 mb-8">
                <MapPin className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold text-primary">Mad Men Retiro</h2>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
                {barbers.filter(b => b.location === 'Retiro').map((barber, index) => (
                  <Card key={index} className="text-center hover:border-primary/50 transition-colors">
                    <CardContent className="pt-8 pb-6">
                      <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                        <AvatarImage src={barber.image || undefined} alt={barber.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                          {getInitials(barber.name)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold text-foreground mb-1">{barber.name}</h3>
                      <p className="text-primary text-sm font-medium mb-2">{barber.specialty}</p>
                      <div className="flex items-center justify-center text-muted-foreground text-sm">
                        <Award className="w-4 h-4 mr-1" />
                        {barber.experience}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                ¿Quieres formar parte de nuestro equipo?
              </p>
              <a href="mailto:madmenmadrid@outlook.es?subject=Solicitud de empleo - Mad Men Barbería">
                <Button variant="outline" size="lg">
                  Trabaja con Nosotros
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Equipo;
