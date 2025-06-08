
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, Instagram } from 'lucide-react';

const LocationsSection = () => {
  const locations = [
    {
      name: 'Mad Men Río Rosa',
      address: 'Cristóbal Bordiú 29, Barrio Río Rosa, Madrid',
      phone: '+34 916 832 731',
      hours: 'Lun-Vie: 11:00 - 21:00\nSáb: 10:00 - 21:00\nDom: 10:00 - 17:00',
      barbers: ['Luis Bracho', 'Jesús Hernández', 'Luis Alfredo', 'Dionys Bracho']
    },
    {
      name: 'Mad Men Salamanca',
      address: 'General Pardiñas 101, Barrio Salamanca, Madrid',
      phone: '+34 910 597 766',
      hours: 'Lun-Vie: 11:00 - 21:00\nSáb: 10:00 - 21:00\nDom: 10:00 - 17:00',
      barbers: ['Isaac Hernández', 'Carlos López', 'Luis Urbiñez', 'Randy Valdespino']
    }
  ];

  return (
    <section id="ubicaciones" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Nuestras Ubicaciones</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dos ubicaciones estratégicas en Madrid para brindarte el mejor servicio
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((location, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/5d557fb8-205e-4120-b27d-62c08ba09e6f.png" 
                      alt="Mad Men Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {location.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-primary mt-0.5" />
                    <p className="text-muted-foreground">{location.address}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-primary" />
                    <a href={`tel:${location.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {location.phone}
                    </a>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 mr-3 text-primary mt-0.5" />
                    <p className="text-muted-foreground whitespace-pre-line">{location.hours}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2 text-primary">Barberos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.barbers.map((barber, i) => (
                        <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                          {barber}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Contact Info */}
        <div className="text-center mt-12">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-bold text-primary mb-4">Información de Contacto</h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <strong>Email:</strong> 
                <a href="mailto:madmenmadrid@outlook.es" className="ml-2 text-primary hover:underline">
                  madmenmadrid@outlook.es
                </a>
              </p>
              <div className="flex items-center justify-center">
                <Instagram className="w-4 h-4 mr-2 text-primary" />
                <a 
                  href="https://www.instagram.com/madmenmadrid/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @madmenmadrid
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
