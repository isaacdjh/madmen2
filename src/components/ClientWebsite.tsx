
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star, MapPin, Phone, Mail, Scissors, Users } from 'lucide-react';

interface ClientWebsiteProps {
  onBookingClick: () => void;
}

const ClientWebsite = ({ onBookingClick }: ClientWebsiteProps) => {
  const services = [
    { name: 'Corte Clásico', price: '$45', duration: '45 min', description: 'Corte tradicional con tijeras y máquina' },
    { name: 'Arreglo de Barba', price: '$25', duration: '30 min', description: 'Perfilado y mantenimiento de barba' },
    { name: 'Corte + Barba', price: '$65', duration: '75 min', description: 'Servicio completo de corte y barba' },
    { name: 'Afeitado Tradicional', price: '$35', duration: '45 min', description: 'Afeitado con navaja y toallas calientes' },
    { name: 'Tratamientos', price: '$40', duration: '60 min', description: 'Tratamientos capilares y faciales' },
  ];

  const barbers = [
    { 
      name: 'Carlos Mendoza', 
      specialty: 'Cortes Clásicos', 
      experience: '8 años',
      description: 'Especialista en cortes tradicionales y estilos vintage'
    },
    { 
      name: 'Miguel Rodríguez', 
      specialty: 'Barbas y Afeitado', 
      experience: '12 años',
      description: 'Maestro en afeitado tradicional con navaja'
    },
    { 
      name: 'Antonio López', 
      specialty: 'Estilos Modernos', 
      experience: '6 años',
      description: 'Experto en tendencias contemporáneas y fade cuts'
    },
  ];

  const testimonials = [
    { name: 'Juan Carlos', rating: 5, text: 'Excelente servicio, siempre salgo satisfecho. Carlos es un artista.' },
    { name: 'Roberto Silva', rating: 5, text: 'La mejor barbería de la ciudad. Ambiente tradicional y profesional.' },
    { name: 'Diego Morales', rating: 5, text: 'Miguel hace el mejor afeitado con navaja que he experimentado.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          }}
        >
          <div className="absolute inset-0 barbershop-gradient opacity-80"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Mad Men
          </h1>
          <h2 className="text-2xl md:text-3xl mb-4 gold-accent">
            Barbería Tradicional
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Donde el estilo clásico se encuentra con la excelencia moderna. 
            Más de 20 años perfeccionando el arte de la barbería tradicional.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-accent text-barbershop-dark hover:bg-accent/90 font-semibold px-8 py-4 text-lg"
              onClick={onBookingClick}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Reservar Cita
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-barbershop-dark font-semibold px-8 py-4 text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Llamar Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Servicios profesionales de barbería con técnicas tradicionales y herramientas de primera calidad
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{service.name}</span>
                    <Badge variant="secondary" className="gold-accent font-bold">
                      {service.price}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{service.duration}</span>
                  </div>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Barbers Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Nuestro Equipo</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Barberos profesionales con años de experiencia y pasión por su arte
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {barbers.map((barber, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Scissors className="w-12 h-12 text-primary" />
                  </div>
                  <CardTitle>{barber.name}</CardTitle>
                  <p className="text-accent font-semibold">{barber.specialty}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{barber.description}</p>
                  <Badge variant="outline">{barber.experience} de experiencia</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-xl text-muted-foreground">Testimonios reales de clientes satisfechos</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 barbershop-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-8">Contáctanos</h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 mr-4 gold-accent" />
                  <div>
                    <h4 className="font-semibold">Dirección</h4>
                    <p className="opacity-90">Av. Principal 123, Centro Histórico</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-4 gold-accent" />
                  <div>
                    <h4 className="font-semibold">Teléfono</h4>
                    <p className="opacity-90">+52 (55) 1234-5678</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-4 gold-accent" />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="opacity-90">info@madmenbarberia.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-6 h-6 mr-4 gold-accent" />
                  <div>
                    <h4 className="font-semibold">Horarios</h4>
                    <p className="opacity-90">Lun-Sáb: 9:00 - 19:00</p>
                    <p className="opacity-90">Dom: 10:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Reserva tu Cita</h3>
              <p className="mb-6 opacity-90">
                ¿Listo para la experiencia Mad Men? Reserva tu cita ahora y descubre 
                por qué somos la barbería preferida de caballeros distinguidos.
              </p>
              <Button 
                size="lg" 
                className="w-full bg-accent text-barbershop-dark hover:bg-accent/90 font-semibold"
                onClick={onBookingClick}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Reservar Ahora
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientWebsite;
