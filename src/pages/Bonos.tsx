import { Helmet } from 'react-helmet-async';
import ClientNavigation from '@/components/client/ClientNavigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift, Scissors, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Bonos = () => {
  const bonos4Servicios = [
    {
      title: 'Bono Corte de Pelo',
      validFor: 'Corte de pelo',
      services: 4,
      price: '68,00',
      originalPrice: '83,96',
      savings: '15,96',
      icon: Scissors,
      popular: true,
    },
    {
      title: 'Bono Corte + Arreglo de Barba',
      validFor: 'Corte de pelo y arreglo de barba',
      services: 4,
      price: '116,00',
      originalPrice: '143,96',
      savings: '27,96',
      icon: Star,
      popular: false,
    },
    {
      title: 'Bono Arreglo de Barba',
      validFor: 'Arreglo de barba',
      services: 4,
      price: '55,00',
      originalPrice: '71,96',
      savings: '16,96',
      icon: Scissors,
      popular: false,
    },
    {
      title: 'Bono Rapado + Arreglo de Barba',
      validFor: 'Rapado y arreglo de barba',
      services: 4,
      price: '92,00',
      originalPrice: '123,96',
      savings: '31,96',
      icon: Gift,
      popular: false,
    },
    {
      title: 'Bono Rapado',
      validFor: 'Rapado',
      services: 4,
      price: '55,00',
      originalPrice: '71,96',
      savings: '16,96',
      icon: Scissors,
      popular: false,
    },
  ];

  const bonos3Servicios = [
    {
      title: 'Bono Corte de Pelo',
      validFor: 'Corte de pelo',
      services: 3,
      price: '54,00',
      originalPrice: '62,97',
      savings: '8,97',
      icon: Scissors,
    },
    {
      title: 'Bono Corte + Arreglo de Barba',
      validFor: 'Corte de pelo y arreglo de barba',
      services: 3,
      price: '90,00',
      originalPrice: '107,97',
      savings: '17,97',
      icon: Star,
    },
    {
      title: 'Bono Arreglo de Barba',
      validFor: 'Arreglo de barba',
      services: 3,
      price: '44,00',
      originalPrice: '53,97',
      savings: '9,97',
      icon: Scissors,
    },
    {
      title: 'Bono Rapado + Arreglo de Barba',
      validFor: 'Rapado y arreglo de barba',
      services: 3,
      price: '73,00',
      originalPrice: '92,97',
      savings: '19,97',
      icon: Gift,
    },
    {
      title: 'Bono Rapado',
      validFor: 'Rapado',
      services: 3,
      price: '44,00',
      originalPrice: '53,97',
      savings: '9,97',
      icon: Scissors,
    },
  ];

  const benefits = [
    'Sin fecha de caducidad',
    'Válido en cualquier sede',
    'Ahorro garantizado',
  ];

  return (
    <>
      <Helmet>
        <title>Bonos de Ahorro | Mad Men Barbería Tradicional Madrid</title>
        <meta name="description" content="Ahorra con nuestros bonos de servicios. Packs de 3 y 4 servicios con descuentos de hasta 32€. Válidos en todas nuestras sedes." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <ClientNavigation onBookingClick={() => window.open('https://madmenbarberia.com/reserva', '_blank')} />
        
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <Link to="/">
              <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
            
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-primary mb-6">Bonos de Ahorro</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Ahorra en cada visita con nuestros packs de servicios. 
                Cuanto más compras, más ahorras.
              </p>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
                  <Check className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* Bonos de 4 servicios */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-primary text-center mb-8">
                Bonos de 4 Servicios
                <span className="block text-lg font-normal text-muted-foreground mt-2">Mayor ahorro</span>
              </h2>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {bonos4Servicios.map((bono, index) => {
                  const IconComponent = bono.icon;
                  return (
                    <Card key={index} className={`relative overflow-hidden hover:border-primary/50 transition-colors ${bono.popular ? 'border-primary border-2' : ''}`}>
                      {bono.popular && (
                        <Badge className="absolute top-3 right-3 bg-primary">
                          Más Popular
                        </Badge>
                      )}
                      <CardHeader className="text-center pb-2">
                        <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{bono.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{bono.services} servicios</p>
                        <p className="text-xs text-muted-foreground">Válido para: {bono.validFor}</p>
                      </CardHeader>
                      <CardContent className="text-center space-y-3">
                        <div>
                          <span className="text-3xl font-bold text-primary">{bono.price} €</span>
                          <p className="text-sm text-muted-foreground line-through">{bono.originalPrice} €</p>
                        </div>
                        <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                          Ahorras {bono.savings} €
                        </div>
                        <p className="text-xs text-muted-foreground">Caducidad: Nunca</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Bonos de 3 servicios */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-primary text-center mb-8">
                Bonos de 3 Servicios
                <span className="block text-lg font-normal text-muted-foreground mt-2">Para empezar a ahorrar</span>
              </h2>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {bonos3Servicios.map((bono, index) => {
                  const IconComponent = bono.icon;
                  return (
                    <Card key={index} className="hover:border-primary/50 transition-colors">
                      <CardHeader className="text-center pb-2">
                        <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{bono.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{bono.services} servicios</p>
                        <p className="text-xs text-muted-foreground">Válido para: {bono.validFor}</p>
                      </CardHeader>
                      <CardContent className="text-center space-y-3">
                        <div>
                          <span className="text-3xl font-bold text-primary">{bono.price} €</span>
                          <p className="text-sm text-muted-foreground line-through">{bono.originalPrice} €</p>
                        </div>
                        <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                          Ahorras {bono.savings} €
                        </div>
                        <p className="text-xs text-muted-foreground">Caducidad: Nunca</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            {/* CTA */}
            <div className="text-center bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-primary mb-4">¿Cómo comprar un bono?</h3>
              <p className="text-muted-foreground mb-6">
                Visita cualquiera de nuestras sedes y adquiere tu bono directamente. 
                También puedes consultarnos por WhatsApp para más información.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://madmenbarberia.com/reserva" target="_blank" rel="noopener noreferrer">
                  <Button size="lg">Reservar Cita</Button>
                </a>
                <a href="https://wa.me/34623158565?text=Hola%20Mad%20Men%2C%20quiero%20información%20sobre%20los%20bonos%20de%20ahorro" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">Consultar por WhatsApp</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bonos;
