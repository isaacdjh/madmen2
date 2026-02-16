
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, Instagram, Users, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import locationSalamanca from '@/assets/location-salamanca-new.jpg';
import locationRetiro from '@/assets/location-retiro-new.png';

const LocationsSection = () => {
  const locations = [
    {
      name: 'Mad Men Salamanca',
      address: 'General Pardiñas 101, Barrio Salamanca, Madrid',
      phone: '+34 910 597 766',
      hours: 'Lun-Vie: 11:00 - 21:00\nSáb: 10:00 - 21:00\nDom: 10:00 - 17:00',
      barbers: ['Isaac Hernández', 'Carlos López', 'Luis Urbiñez', 'Randy Valdespino'],
      image: locationSalamanca,
      bookingUrl: 'https://booksy.com/es-es/instant-experiences/widget/108540'
    },
    {
      name: 'Mad Men Retiro',
      address: 'Calle Alcalde Sainz de Baranda 53, 28009 Madrid',
      phone: '+34 912 231 715',
      hours: 'Lun-Vie: 11:00 - 21:00\nSáb: 10:00 - 21:00\nDom: 10:00 - 17:00',
      barbers: ['Jorge', 'Rudy'],
      image: locationRetiro,
      bookingUrl: 'https://booksy.com/es-es/instant-experiences/widget/160842'
    }
  ];

  return (
    <section id="ubicaciones" className="py-24 modern-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-primary mb-6">Nuestras Barberías en Madrid</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Dos barberías en los mejores barrios de Madrid: Salamanca y Retiro. 
            Barberos profesionales, corte clásico, afeitado con navaja y arreglo de barba.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {locations.map((location, index) => (
            <Card key={index} className="location-card overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img 
                  src={location.image} 
                  alt={location.name}
                  className="w-full h-full object-cover"
                  style={index === 0 ? { objectPosition: 'center -30px' } : undefined}
                />
                <div className="absolute top-4 left-4 bg-barbershop-dark/90 backdrop-blur-sm rounded-lg p-2">
                    <img 
                      src="/lovable-uploads/a025ce2d-5659-4cd2-b67d-2ca1dd14a5b2.png" 
                      alt="Mad Men Logo" 
                      className="w-8 h-8 object-contain"
                    />
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-primary flex items-center">
                  {location.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{location.address}</p>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                  <a 
                    href={`tel:${location.phone}`} 
                    className="text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    {location.phone}
                  </a>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 text-primary mt-1 flex-shrink-0" />
                  <div className="text-muted-foreground">
                    <div className="font-medium mb-1">Horarios:</div>
                    <div className="text-sm space-y-1">
                      <div>Lun-Vie: 11:00 - 21:00</div>
                      <div>Sábado: 10:00 - 21:00</div>
                      <div>Domingo: 10:00 - 17:00</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex items-center mb-3">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    <h4 className="font-semibold text-primary">Nuestros Barberos:</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {location.barbers.map((barber, i) => (
                      <div key={i} className="bg-primary/10 text-primary px-3 py-2 rounded-lg border border-primary/20 text-center">
                        <span className="text-sm font-medium">{barber}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {location.bookingUrl && (
                  <div className="border-t border-border pt-4 mt-4">
                    <a 
                      href={location.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      Reservar en {location.name.replace('Mad Men ', '')}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Contact Info Global */}
        <div className="text-center">
          <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto glass-effect">
            <h3 className="text-2xl font-bold text-primary mb-6">Información de Contacto General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start">
                  <Mail className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Email</div>
                    <a 
                      href="mailto:madmenmadrid@outlook.es" 
                      className="text-primary hover:text-barbershop-gold transition-colors"
                    >
                      madmenmadrid@outlook.es
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start">
                  <Instagram className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Instagram</div>
                    <a 
                      href="https://www.instagram.com/madmenmadrid/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-barbershop-gold transition-colors"
                    >
                      @madmenmadrid
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Dos ubicaciones, un mismo nivel de excelencia. Más de 20 años perfeccionando el arte de la barbería tradicional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
