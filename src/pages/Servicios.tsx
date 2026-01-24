import { Helmet } from 'react-helmet-async';
import ClientNavigation from '@/components/client/ClientNavigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scissors, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Servicios = () => {
  const services = [
    {
      category: 'Cortes de Cabello',
      items: [
        { name: 'Corte de pelo', price: '20,99', duration: '30min', description: 'Corte profesional con tijera y máquina' },
        { name: 'Corte de niño hasta 12 años', price: '14,99', duration: '30min', description: 'Corte especial para los más pequeños' },
        { name: 'Corte de jubilado', price: '14,99', duration: '30min', description: 'Tarifa especial para jubilados' },
        { name: 'Rapado', price: '17,99', duration: '30min', description: 'Rapado completo con máquina' },
      ]
    },
    {
      category: 'Barba',
      items: [
        { name: 'Arreglo de barba', price: '17,99', duration: '30min', description: 'Perfilado y recorte profesional' },
        { name: 'Tinte para barba', price: '25,00', duration: '30min', description: 'Coloración profesional de barba' },
      ]
    },
    {
      category: 'Combos',
      items: [
        { name: 'Corte de pelo y arreglo de barba', price: '35,99', duration: '1h', description: 'Nuestro servicio más popular' },
        { name: 'Rapado y arreglo de barba', price: '30,99', duration: '1h', description: 'Rapado completo con arreglo de barba' },
      ]
    },
    {
      category: 'Tratamientos Faciales',
      items: [
        { name: 'Mascarilla facial', price: '14,00', duration: '30min', description: 'Limpieza y cuidado facial' },
        { name: 'Mascarilla facial VIP', price: '20,99', duration: '30min', description: 'Tratamiento facial premium' },
        { name: 'Mascarilla hidratante', price: '8,00', duration: '15min', description: 'Hidratación intensiva' },
      ]
    },
    {
      category: 'Coloración',
      items: [
        { name: 'Tinte de pelo', price: '35,00', duration: '1h', description: 'Coloración profesional de cabello' },
        { name: 'Tinte color fantasía', price: '90,00', duration: '4h', description: 'Colores especiales y creativos' },
      ]
    },
    {
      category: 'Servicios Adicionales',
      items: [
        { name: 'Cejas con cuchilla', price: '5,00', duration: '5min', description: 'Perfilado de cejas' },
        { name: 'Depilación de nariz', price: '5,00', duration: '5min', description: 'Eliminación de vello nasal' },
        { name: 'Depilación de oído', price: '5,00', duration: '5min', description: 'Eliminación de vello del oído' },
        { name: 'Lavar y peinar', price: '11,00', duration: '15min', description: 'Lavado y peinado profesional' },
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Servicios | Mad Men Barbería Tradicional Madrid</title>
        <meta name="description" content="Descubre nuestros servicios de barbería: cortes clásicos, degradados, afeitado con navaja, tratamientos de barba y más. Precios desde 12€." />
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
            
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-primary mb-6">Nuestros Servicios</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Más de 20 años perfeccionando el arte de la barbería tradicional. 
                Cada servicio es una experiencia única.
              </p>
            </div>
            
            <div className="space-y-12 max-w-5xl mx-auto">
              {services.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-3xl font-bold text-primary mb-6 border-b border-border pb-3">
                    {category.category}
                  </h2>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((service, serviceIndex) => (
                      <Card key={serviceIndex} className="hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Scissors className="w-5 h-5 text-primary" />
                            {service.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-muted-foreground text-sm">{service.description}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center text-muted-foreground text-sm">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.duration}
                            </div>
                            <div className="text-primary font-bold text-lg">
                              {service.price} €
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <a href="https://madmenbarberia.com/reserva" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="text-lg px-8 py-6">
                  Reservar Cita
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Servicios;
