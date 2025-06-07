
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    { name: 'Corte Clásico', price: '$45', duration: '45 min', description: 'Corte tradicional con tijeras y máquina' },
    { name: 'Arreglo de Barba', price: '$25', duration: '30 min', description: 'Perfilado y mantenimiento de barba' },
    { name: 'Corte + Barba', price: '$65', duration: '75 min', description: 'Servicio completo de corte y barba' },
    { name: 'Afeitado Tradicional', price: '$35', duration: '45 min', description: 'Afeitado con navaja y toallas calientes' },
    { name: 'Tratamientos', price: '$40', duration: '60 min', description: 'Tratamientos capilares y faciales' },
  ];

  return (
    <section className="py-20 bg-muted/50">
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
  );
};

export default ServicesSection;
