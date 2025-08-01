import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, Star, Gift, ArrowRight } from 'lucide-react';

interface OffersSectionProps {
  onViewBonuses: () => void;
}

const OffersSection = ({ onViewBonuses }: OffersSectionProps) => {
  const offers = [
    {
      title: 'Bono 5 Servicios',
      description: 'Ahorra comprando por adelantado',
      discount: '15% OFF',
      price: '85€',
      originalPrice: '100€',
      icon: Scissors,
      popular: true,
    },
    {
      title: 'Bono 10 Servicios',
      description: 'La mejor oferta para clientes frecuentes',
      discount: '25% OFF',
      price: '150€',
      originalPrice: '200€',
      icon: Star,
      popular: false,
    },
    {
      title: 'Bono Regalo',
      description: 'Regalo perfecto para alguien especial',
      discount: 'Válido 1 año',
      price: 'Desde 20€',
      originalPrice: '',
      icon: Gift,
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Ofertas Especiales
          </Badge>
          <h2 className="text-4xl font-bold text-primary mb-4">
            Descuentos Exclusivos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Aprovecha nuestros bonos y promociones especiales. Ahorra más mientras cuidas tu imagen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {offers.map((offer, index) => {
            const IconComponent = offer.icon;
            return (
              <Card 
                key={index} 
                className={`relative transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  offer.popular ? 'border-primary shadow-lg ring-2 ring-primary/20' : ''
                }`}
              >
                {offer.popular && (
                  <Badge 
                    variant="default" 
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground"
                  >
                    Más Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <IconComponent className="w-12 h-12 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{offer.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{offer.description}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <Badge 
                      variant="destructive" 
                      className="mb-2 bg-accent text-accent-foreground"
                    >
                      {offer.discount}
                    </Badge>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-primary">{offer.price}</p>
                      {offer.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {offer.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            onClick={onViewBonuses}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
          >
            Ver Todos los Bonos
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            * Bonos válidos por 12 meses desde la fecha de compra
          </p>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;