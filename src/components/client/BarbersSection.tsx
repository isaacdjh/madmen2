
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, MapPin } from 'lucide-react';

const BarbersSection = () => {
  const locations = [
    {
      name: 'Mad Men Río Rosa',
      address: 'Cristóbal Bordiú 29',
      barbers: [
        { name: 'Luis Bracho', specialty: 'Cortes Clásicos y Modernos' },
        { name: 'Jesús Hernández', specialty: 'Especialista en Barbas' },
        { name: 'Luis Alfredo', specialty: 'Cortes de Tendencia' },
        { name: 'Dionys Bracho', specialty: 'Afeitado Tradicional' }
      ]
    },
    {
      name: 'Mad Men Salamanca',
      address: 'General Pardiñas 101',
      barbers: [
        { name: 'Isaac Hernández', specialty: 'Master Barber' },
        { name: 'Carlos López', specialty: 'Estilos Clásicos' },
        { name: 'Luis Urbiñez', specialty: 'Cortes y Barbas' },
        { name: 'Randy Valdespino', specialty: 'Técnicas Modernas' }
      ]
    }
  ];

  return (
    <section id="equipo" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Nuestro Equipo</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Barberos profesionales con años de experiencia y pasión por su arte
          </p>
        </div>
        
        <div className="space-y-12">
          {locations.map((location, locationIndex) => (
            <div key={locationIndex}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-barbershop-dark mb-2">{location.name}</h3>
                <div className="flex items-center justify-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{location.address}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {location.barbers.map((barber, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Scissors className="w-10 h-10 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{barber.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="text-xs">
                        {barber.specialty}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BarbersSection;
