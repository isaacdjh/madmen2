
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Gift, Coffee } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    { name: 'Corte', price: '19€', duration: '30-45 min', description: 'Corte tradicional con tijeras y máquina' },
    { name: 'Arreglo de Barba', price: '16€', duration: '20-30 min', description: 'Perfilado y mantenimiento de barba' },
    { name: 'Corte + Barba', price: '32€', duration: '45-60 min', description: 'Servicio completo de corte y barba' },
    { name: 'Corte de Niño', price: '13€', duration: '30 min', description: 'Hasta los 12 años' },
    { name: 'Corte Jubilado', price: '13€', duration: '30-45 min', description: 'Precio especial para jubilados' },
    { name: 'Rapado', price: '16€', duration: '20-30 min', description: 'Rapado completo con máquina' },
    { name: 'Rapado + Barba', price: '27€', duration: '40-50 min', description: 'Rapado completo con arreglo de barba' },
    { name: 'Cejas con Cuchillas', price: '5€', duration: '10 min', description: 'Perfilado de cejas' },
    { name: 'Depilación Nariz', price: '5€', duration: '10 min', description: 'Depilación de vello nasal' },
    { name: 'Depilación Orejas', price: '5€', duration: '10 min', description: 'Depilación de vello de orejas' },
    { name: 'Mascarilla Puntos Negros', price: '12€', duration: '30 min', description: 'Tratamiento facial para puntos negros' },
    { name: 'Mascarilla Facial VIP', price: '20€', duration: '45 min', description: 'Tratamiento facial premium' },
    { name: 'Tinte de Pelo Oscuro', price: '35€', duration: '60 min', description: 'Tinte profesional tonos oscuros' },
    { name: 'Lavar + Peinado', price: '11€', duration: '20 min', description: 'Lavado y peinado profesional' },
    { name: 'Mascarilla Hidratante', price: '8€', duration: '20 min', description: 'Tratamiento hidratante para el cabello' },
  ];

  return (
    <section id="servicios" className="py-24 modern-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-primary mb-6">Nuestros Servicios</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Servicios profesionales de barbería tradicional con técnicas clásicas y herramientas de primera calidad. 
            Cada servicio incluye una atención personalizada y productos premium.
          </p>
        </div>

        {/* Bebida de Cortesía */}
        <div className="bg-barbershop-gold/10 border border-barbershop-gold/20 rounded-lg p-8 mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Coffee className="w-12 h-12 text-barbershop-gold mr-4" />
            <Gift className="w-12 h-12 text-barbershop-gold" />
          </div>
          <h3 className="text-2xl font-bold text-barbershop-dark mb-2">Bebida de Cortesía</h3>
          <p className="text-muted-foreground">
            Con cada servicio, disfruta de una bebida de cortesía: café premium, agua, refrescos o cerveza. 
            Porque en Mad Men, tu comodidad es nuestra prioridad.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="service-card h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg border border-primary/20">
                    <img 
                      src="/lovable-uploads/0d116fe9-b6a4-4cca-8d46-59672d4df74d.png" 
                      alt="Mad Men Service Logo" 
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <Badge variant="secondary" className="bg-primary text-primary-foreground font-bold border-0 px-3 py-1">
                    {service.price}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-primary">
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-muted-foreground mb-4">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">{service.duration}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bonos Section - More Prominent */}
        <div className="bg-gradient-to-r from-primary/10 via-barbershop-gold/10 to-primary/10 border border-primary/30 rounded-2xl p-10 glass-effect">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Gift className="w-16 h-16 text-primary mr-6" />
              <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-xl border-2 border-primary/30">
                <img 
                  src="/lovable-uploads/0d116fe9-b6a4-4cca-8d46-59672d4df74d.png" 
                  alt="Mad Men Service Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>
            
            <h3 className="text-4xl font-bold text-primary mb-6">
              💈 ¡Descubre nuestros Bonos Exclusivos! 💳
            </h3>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-xl text-foreground font-medium mb-8">
                Ahorra dinero y disfruta de tu look siempre perfecto con nuestros Bonos digitales:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="text-3xl mb-3">✅</div>
                  <h4 className="font-semibold text-primary mb-2">Packs Especiales</h4>
                  <p className="text-sm text-muted-foreground">Packs de servicios de corte a precio especial</p>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="text-3xl mb-3">⏰</div>
                  <h4 className="font-semibold text-primary mb-2">Sin Caducidad</h4>
                  <p className="text-sm text-muted-foreground">¡Úsalos cuando quieras!</p>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="text-3xl mb-3">📱</div>
                  <h4 className="font-semibold text-primary mb-2">100% Digitales</h4>
                  <p className="text-sm text-muted-foreground">Fáciles de guardar y canjear</p>
                </div>
              </div>
              
              <div className="bg-barbershop-gold/20 border border-barbershop-gold/40 rounded-xl p-6">
                <p className="text-lg font-semibold text-foreground mb-2">
                  ¡Disponibles solo en nuestros centros físicos!
                </p>
                <p className="text-primary font-bold text-xl">
                  👉 Pregunta a tu barbero de confianza por los bonos y empieza a disfrutar de los beneficios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
