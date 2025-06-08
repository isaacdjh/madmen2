
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, MapPin, Star } from 'lucide-react';

const BarbersSection = () => {
  const locations = [
    {
      name: 'Mad Men Río Rosa',
      address: 'Cristóbal Bordiú 29',
      barbers: [
        { name: 'Luis Bracho', specialty: 'Cortes Clásicos y Modernos', experience: '+15 años' },
        { name: 'Jesús Hernández', specialty: 'Especialista en Barbas', experience: '+12 años' },
        { name: 'Luis Alfredo', specialty: 'Cortes de Tendencia', experience: '+10 años' },
        { name: 'Dionys Bracho', specialty: 'Afeitado Tradicional', experience: '+8 años' }
      ]
    },
    {
      name: 'Mad Men Salamanca',
      address: 'General Pardiñas 101',
      barbers: [
        { name: 'Isaac Hernández', specialty: 'Master Barber', experience: '+20 años' },
        { name: 'Carlos López', specialty: 'Estilos Clásicos', experience: '+14 años' },
        { name: 'Luis Urbiñez', specialty: 'Cortes y Barbas', experience: '+11 años' },
        { name: 'Randy Valdespino', specialty: 'Técnicas Modernas', experience: '+9 años' }
      ]
    }
  ];

  return (
    <section id="equipo" className="py-24 modern-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-primary mb-6">Nuestro Equipo de Expertos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            8 barberos profesionales con décadas de experiencia combinada. 
            Cada uno especializado en diferentes técnicas y estilos para brindarte el mejor servicio.
          </p>
        </div>
        
        <div className="space-y-16">
          {locations.map((location, locationIndex) => (
            <div key={locationIndex}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center bg-card border border-border rounded-xl px-6 py-4 glass-effect">
                  <div className="w-8 h-8 mr-4 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/5d557fb8-205e-4120-b27d-62c08ba09e6f.png" 
                      alt="Mad Men Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-primary mb-1">{location.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{location.address}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {location.barbers.map((barber, index) => (
                  <Card key={index} className="barber-card text-center overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-primary/20">
                        <Scissors className="w-12 h-12 text-primary" />
                      </div>
                      <CardTitle className="text-xl text-primary">{barber.name}</CardTitle>
                      <div className="flex items-center justify-center">
                        <Star className="w-4 h-4 text-barbershop-gold mr-1" />
                        <span className="text-sm text-muted-foreground">{barber.experience}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-primary/30 text-primary bg-primary/5 px-3 py-2"
                      >
                        {barber.specialty}
                      </Badge>
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Barbero profesional especializado en técnicas tradicionales y modernas
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-card border border-border rounded-xl p-8 max-w-3xl mx-auto glass-effect">
            <h3 className="text-2xl font-bold text-primary mb-4">¿Por qué elegir nuestro equipo?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-barbershop-gold mb-2">+100</div>
                <div className="text-sm text-muted-foreground">Años de experiencia combinada</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-barbershop-gold mb-2">8</div>
                <div className="text-sm text-muted-foreground">Barberos especializados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-barbershop-gold mb-2">2</div>
                <div className="text-sm text-muted-foreground">Ubicaciones en Madrid</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BarbersSection;
