
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Gift } from 'lucide-react';

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
    <section id="servicios" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Nuestros Servicios</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Servicios profesionales de barbería tradicional con técnicas clásicas y herramientas de primera calidad
          </p>
        </div>

        {/* Bonos Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Gift className="w-12 h-12 text-primary mr-4" />
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/0d116fe9-b6a4-4cca-8d46-59672d4df74d.png" 
                  alt="Mad Men Service Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">💈 ¡Descubre nuestros Bonos Exclusivos! 💳</h3>
            <div className="text-muted-foreground space-y-2 max-w-3xl mx-auto">
              <p className="text-lg mb-4">Ahorra dinero y disfruta de tu look siempre perfecto con nuestros Bonos digitales:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span>Packs de servicios de corte a precio especial</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span>Sin fecha de caducidad: ¡úsalos cuando quieras!</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span>100% digitales: fáciles de guardar y canjear</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="font-semibold">¡Disponibles solo en nuestros centros físicos!</p>
                <p className="text-primary font-bold">👉 Pregunta a tu barbero de confianza por los bonos y empieza a disfrutar de los beneficios.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="service-card h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/0d116fe9-b6a4-4cca-8d46-59672d4df74d.png" 
                      alt="Mad Men Service Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-bold border border-primary/20">
                    {service.price}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-primary">
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-muted-foreground mb-3">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm">{service.duration}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
