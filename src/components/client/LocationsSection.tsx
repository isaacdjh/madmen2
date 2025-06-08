
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';

const LocationsSection = () => {
  const locations = [
    {
      name: 'Mad Men Río Rosa',
      address: 'Cristóbal Bordiú 29, Barrio Río Rosa, Madrid',
      phone: '+34 91 xxx-xxxx',
      hours: 'Lun-Vie: 11:00 - 21:00\nSáb: 10:00 - 21:00\nDom: 10:00 - 17:00',
      barbers: ['Luis Bracho', 'Jesús Hernández', 'Luis Alfredo', 'Dionys Bracho']
    },
    {
      name: 'Mad Men Salamanca',
      address: 'General Pardiñas 101, Barrio Salamanca, Madrid',
      phone: '+34 91 xxx-xxxx',
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
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-accent" />
                  {location.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground">{location.address}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
                    <p className="text-muted-foreground">{location.phone}</p>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 mr-3 text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground whitespace-pre-line">{location.hours}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2">Barberos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.barbers.map((barber, i) => (
                        <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
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
      </div>
    </section>
  );
};

export default LocationsSection;
