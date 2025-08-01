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
      title: "Bono Corte de Pelo",
      description: "4 cortes por 60€",
      discount: "Ahorro: 16€",
      price: "60€",
      originalPrice: "76€",
      icon: Scissors,
      popular: true,
    },
    {
      title: "Bono Corte + Barba", 
      description: "4 servicios por 100€",
      discount: "Ahorro: 28€",
      price: "100€",
      originalPrice: "128€",
      icon: Star,
      popular: false,
    },
    {
      title: "Bono Arreglo de Barba",
      description: "4 arreglos por 48€", 
      discount: "Ahorro: 16€",
      price: "48€",
      originalPrice: "64€",
      icon: Scissors,
      popular: false,
    },
    {
      title: "Bono Rapado + Barba",
      description: "4 servicios por 80€",
      discount: "Ahorro: 28€",
      price: "80€",
      originalPrice: "108€", 
      icon: Gift,
      popular: false,
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Ofertas Especiales
          </Badge>
          <h2 className="text-4xl font-bold text-primary mb-4">
            Bonos de Ahorro MAD MEN
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            4 servicios con descuentos reales. Sin caducidad y válidos en ambas barberías.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
            💈 Ahorro real garantizado • Sin caducidad • Válido en ambas tiendas
          </p>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;