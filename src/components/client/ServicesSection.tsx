
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, Clock, Star } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: 'corte' | 'barba' | 'combo' | 'tratamiento';
  active: boolean;
}

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    const stored = localStorage.getItem('services');
    if (stored) {
      const allServices = JSON.parse(stored);
      // Solo mostrar servicios activos
      setServices(allServices.filter((service: Service) => service.active));
    } else {
      // Servicios por defecto si no hay ninguno guardado
      const defaultServices: Service[] = [
        {
          id: 'classic-cut',
          name: 'Corte Clásico',
          description: 'Corte tradicional con tijera y máquina',
          price: 45,
          duration: 45,
          category: 'corte',
          active: true
        },
        {
          id: 'beard-trim',
          name: 'Arreglo de Barba',
          description: 'Perfilado y arreglo de barba',
          price: 25,
          duration: 30,
          category: 'barba',
          active: true
        },
        {
          id: 'cut-beard',
          name: 'Corte + Barba',
          description: 'Combo completo corte y barba',
          price: 65,
          duration: 75,
          category: 'combo',
          active: true
        },
        {
          id: 'shave',
          name: 'Afeitado Tradicional',
          description: 'Afeitado clásico con navaja',
          price: 35,
          duration: 45,
          category: 'barba',
          active: true
        },
        {
          id: 'treatments',
          name: 'Tratamientos Especiales',
          description: 'Tratamientos capilares y faciales',
          price: 40,
          duration: 60,
          category: 'tratamiento',
          active: true
        }
      ];
      setServices(defaultServices);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'corte': return 'bg-blue-100 text-blue-800';
      case 'barba': return 'bg-green-100 text-green-800';
      case 'combo': return 'bg-purple-100 text-purple-800';
      case 'tratamiento': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'corte':
      case 'combo':
      default:
        return <Scissors className="w-6 h-6" />;
    }
  };

  return (
    <section id="servicios" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block p-3 bg-barbershop-gold/20 rounded-full mb-4">
            <Scissors className="w-8 h-8 text-barbershop-gold" />
          </div>
          <h2 className="text-4xl font-bold text-barbershop-dark mb-4">Nuestros Servicios</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios de barbería tradicional con las técnicas más modernas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-barbershop-gold/50">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-barbershop-gold/20 rounded-full group-hover:bg-barbershop-gold/30 transition-colors">
                    {getCategoryIcon(service.category)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-barbershop-dark mb-2">{service.name}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-barbershop-gold">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{service.duration} min</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-barbershop-gold">€{service.price}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-barbershop-gold fill-current" />
                    <Star className="w-4 h-4 text-barbershop-gold fill-current" />
                    <Star className="w-4 h-4 text-barbershop-gold fill-current" />
                    <Star className="w-4 h-4 text-barbershop-gold fill-current" />
                    <Star className="w-4 h-4 text-barbershop-gold fill-current" />
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
                  >
                    Reservar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
