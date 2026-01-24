import { Helmet } from 'react-helmet-async';
import ClientNavigation from '@/components/client/ClientNavigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scissors, Clock, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Servicios = () => {
  const services = [
    {
      category: 'Cortes de Cabello',
      items: [
        { name: 'Corte Clásico', price: 18, duration: 30, description: 'Corte tradicional con tijera y máquina' },
        { name: 'Corte Degradado', price: 20, duration: 35, description: 'Fade con degradado profesional' },
        { name: 'Corte Premium', price: 25, duration: 45, description: 'Incluye lavado, corte y styling' },
      ]
    },
    {
      category: 'Barba',
      items: [
        { name: 'Arreglo de Barba', price: 12, duration: 20, description: 'Perfilado y recorte de barba' },
        { name: 'Afeitado Clásico', price: 18, duration: 30, description: 'Afeitado con navaja y toalla caliente' },
        { name: 'Tratamiento Barba', price: 22, duration: 35, description: 'Hidratación y cuidado completo' },
      ]
    },
    {
      category: 'Combos',
      items: [
        { name: 'Corte + Barba', price: 28, duration: 50, description: 'Nuestro servicio más popular' },
        { name: 'Experiencia Mad Men', price: 45, duration: 75, description: 'Corte premium + afeitado clásico + tratamiento' },
      ]
    },
    {
      category: 'Tratamientos',
      items: [
        { name: 'Black Mask', price: 10, duration: 15, description: 'Limpieza profunda de poros' },
        { name: 'Keratina Capilar', price: 35, duration: 45, description: 'Tratamiento de hidratación intensiva' },
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Servicios | Mad Men Barbería Tradicional Madrid</title>
        <meta name="description" content="Descubre nuestros servicios de barbería: cortes clásicos, degradados, afeitado con navaja, tratamientos de barba y más. Precios desde 12€." />
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
              <h1 className="text-5xl font-bold text-primary mb-6">Nuestros Servicios</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Más de 20 años perfeccionando el arte de la barbería tradicional. 
                Cada servicio es una experiencia única.
              </p>
            </div>
            
            <div className="space-y-12 max-w-5xl mx-auto">
              {services.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-3xl font-bold text-primary mb-6 border-b border-border pb-3">
                    {category.category}
                  </h2>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((service, serviceIndex) => (
                      <Card key={serviceIndex} className="hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Scissors className="w-5 h-5 text-primary" />
                            {service.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-muted-foreground text-sm">{service.description}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center text-muted-foreground text-sm">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.duration} min
                            </div>
                            <div className="flex items-center text-primary font-bold text-lg">
                              <Euro className="w-4 h-4 mr-1" />
                              {service.price}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <a href="https://madmenbarberia.com/reserva" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="text-lg px-8 py-6">
                  Reservar Cita
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Servicios;
