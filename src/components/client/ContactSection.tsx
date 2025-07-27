
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Mail, MapPin, Phone, Instagram } from 'lucide-react';

interface ContactSectionProps {
  onBookingClick: () => void;
}

const ContactSection = ({ onBookingClick }: ContactSectionProps) => {
  return (
    <section id="contacto" className="py-20 barbershop-gradient text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-8">Contáctanos</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 gold-accent">Mad Men Río Rosa</h3>
                <div className="space-y-3 ml-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 gold-accent" />
                    <p className="opacity-90">Cristóbal Bordiú 29, Barrio Río Rosa, Madrid</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 gold-accent" />
                    <a href="tel:+34916832731" className="opacity-90 hover:text-accent transition-colors">
                      +34 916 832 731
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 gold-accent">Mad Men Salamanca</h3>
                <div className="space-y-3 ml-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 gold-accent" />
                    <p className="opacity-90">General Pardiñas 101, Barrio Salamanca, Madrid</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 gold-accent" />
                    <a href="tel:+34910597766" className="opacity-90 hover:text-accent transition-colors">
                      +34 910 597 766
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-6 h-6 mr-4 gold-accent" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <a href="mailto:madmenmadrid@outlook.es" className="opacity-90 hover:text-accent transition-colors">
                    madmenmadrid@outlook.es
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <Instagram className="w-6 h-6 mr-4 gold-accent" />
                <div>
                  <h4 className="font-semibold">Instagram</h4>
                  <a 
                    href="https://www.instagram.com/madmenmadrid/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="opacity-90 hover:text-accent transition-colors"
                  >
                    @madmenmadrid
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-6 h-6 mr-4 gold-accent" />
                <div>
                  <h4 className="font-semibold">Horarios</h4>
                  <p className="opacity-90">Lun-Vie: 11:00 - 21:00</p>
                  <p className="opacity-90">Sáb: 10:00 - 21:00</p>
                  <p className="opacity-90">Dom: 10:00 - 17:00</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Reserva tu Cita</h3>
            <p className="mb-6 opacity-90">
              ¿Listo para la experiencia Mad Men? Reserva tu cita ahora y descubre 
              por qué somos la barbería preferida de caballeros distinguidos.
            </p>
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full bg-accent text-barbershop-dark hover:bg-accent/90 font-semibold"
                onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/101632', '_blank')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Reservar Río Rosa
              </Button>
              <Button 
                size="lg" 
                className="w-full bg-accent text-barbershop-dark hover:bg-accent/90 font-semibold"
                onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/108540', '_blank')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Reservar Salamanca
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
