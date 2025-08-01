import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, Gift, CheckCircle, MapPin, User, Clock } from 'lucide-react';

const BonusSection = () => {
  const bonuses = [
    {
      name: "Bono Corte de Pelo",
      services: 4,
      price: 60,
      regularPrice: 76,
      savings: 16,
      description: "4 cortes por 60 €"
    },
    {
      name: "Bono Corte + Barba",
      services: 4,
      price: 100,
      regularPrice: 128,
      savings: 28,
      description: "4 servicios por 100 €"
    },
    {
      name: "Bono Arreglo de Barba",
      services: 4,
      price: 48,
      regularPrice: 64,
      savings: 16,
      description: "4 arreglos por 48 €"
    },
    {
      name: "Bono Rapado + Barba",
      services: 4,
      price: 80,
      regularPrice: 108,
      savings: 28,
      description: "4 servicios por 80 €"
    }
  ];

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
          {bonuses.map((bonus, index) => (
            <Card key={index} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
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
                    Precio regular: {bonus.regularPrice}€
                  </div>
                </div>
                <Badge variant="secondary" className="mb-4">
                  Ahorro: {bonus.savings}€
                </Badge>
              </CardContent>
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-primary/10">
                  {bonus.services} servicios
                </Badge>
              </div>
            </Card>
          ))}
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