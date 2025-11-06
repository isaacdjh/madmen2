import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, Gift, CheckCircle, MapPin, User, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BonusPackage {
  id: string;
  name: string;
  description: string | null;
  services_included: number;
  price: number;
  active: boolean;
}

const BonusSection = () => {
  const [bonuses, setBonuses] = useState<BonusPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBonuses = async () => {
      try {
        const { data, error } = await supabase
          .from('bonus_packages')
          .select('*')
          .eq('active', true)
          .order('services_included', { ascending: false })
          .order('price', { ascending: false });

        if (error) throw error;
        setBonuses(data || []);
      } catch (error) {
        console.error('Error loading bonuses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBonuses();
  }, []);

  const calculateRegularPrice = (packageName: string, servicesIncluded: number): number => {
    const servicesPrices: Record<string, number> = {
      'corte': 20.99,
      'corte+barba': 35.50,
      'barba': 17,
      'rapado+barba': 28.50
    };

    const lowerName = packageName.toLowerCase();
    
    if (lowerName.includes('corte+barba') || lowerName.includes('corte + barba')) {
      return servicesPrices['corte+barba'] * servicesIncluded;
    } else if (lowerName.includes('rapado+barba') || lowerName.includes('rapado + barba')) {
      return servicesPrices['rapado+barba'] * servicesIncluded;
    } else if (lowerName.includes('barba')) {
      return servicesPrices['barba'] * servicesIncluded;
    } else if (lowerName.includes('corte')) {
      return servicesPrices['corte'] * servicesIncluded;
    }
    
    return 0;
  };

  const benefits = [
    {
      icon: <Gift className="h-5 w-5" />,
      title: "Ahorro garantizado",
      description: "Hasta 28€ de descuento"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Sin caducidad",
      description: "Úsalo cuando quieras"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Válido en ambas tiendas",
      description: "Calle Cristóbal Bordiu 29 y Calle General Pardiñas 101"
    },
    {
      icon: <User className="h-5 w-5" />,
      title: "Personal e intransferible",
      description: "Registrado a tu nombre"
    }
  ];

  return (
    <section id="bonos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Gift className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-bold text-foreground">
              Bonos MAD MEN
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            💈 Tu barbería de confianza, ahora con más ventajas. 
            Valoramos tu fidelidad y te ofrecemos nuestros bonos de 4 servicios, 
            pensados para que disfrutes con ahorro, comodidad y sin preocuparte por pagar en cada visita.
          </p>
        </div>

        {/* Bonuses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {loading ? (
            <div className="col-span-full text-center text-muted-foreground">
              Cargando bonos...
            </div>
          ) : bonuses.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">
              No hay bonos disponibles
            </div>
          ) : (
            bonuses.map((bonus) => {
              const regularPrice = calculateRegularPrice(bonus.name, bonus.services_included);
              const savings = regularPrice - bonus.price;
              
              return (
                <Card key={bonus.id} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Scissors className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-bold">{bonus.name}</CardTitle>
                    <CardDescription className="text-sm">{bonus.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {bonus.price}€
                      </div>
                      <div className="text-sm text-muted-foreground line-through">
                        Precio regular: {regularPrice.toFixed(2)}€
                      </div>
                    </div>
                    <Badge variant="secondary" className="mb-4">
                      Ahorro: {savings.toFixed(2)}€
                    </Badge>
                  </CardContent>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-primary/10">
                      {bonus.services_included} servicios
                    </Badge>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* How it works */}
        <div className="bg-muted/50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
            🧾 ¿Cómo funciona?
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-foreground">
                  <strong>Pagas el bono por adelantado</strong> y lo vas utilizando hasta agotarlo.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-foreground">
                  <strong>No es necesario abonar nada</strong> en cada visita.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-foreground">
                  <strong>Puedes usarlo en cualquiera</strong> de nuestras dos barberías.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-foreground">
                  <strong>Se aplica automáticamente</strong> con tu nombre y servicio al venir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                {benefit.icon}
              </div>
              <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-primary/5 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              ✅ ¡Empieza a ahorrar hoy!
            </h3>
            <p className="text-muted-foreground mb-6">
              Visítanos en cualquiera de nuestras dos barberías y adquiere tu bono. 
              Ahorro real garantizado sin caducidad.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Visitar Barbería
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BonusSection;