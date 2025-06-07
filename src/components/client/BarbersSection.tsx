
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors } from 'lucide-react';

const BarbersSection = () => {
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

  return (
    <section className="py-20 bg-background">
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
  );
};

export default BarbersSection;
