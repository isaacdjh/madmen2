
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';

const LocationsSection = () => {
  const locations = [
    {
      name: 'Mad Men Centro',
      address: 'Av. Principal 123, Centro Histórico',
      phone: '+52 (55) 1234-5678',
      hours: 'Lun-Sáb: 9:00 - 19:00, Dom: 10:00 - 16:00'
    },
    {
      name: 'Mad Men Polanco',
      address: 'Av. Presidente Masaryk 456, Polanco',
      phone: '+52 (55) 8765-4321',
      hours: 'Lun-Sáb: 10:00 - 20:00, Dom: 11:00 - 17:00'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Nuestras Ubicaciones</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dos ubicaciones estratégicas para brindarte el mejor servicio
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
                    <p className="text-muted-foreground">{location.hours}</p>
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
