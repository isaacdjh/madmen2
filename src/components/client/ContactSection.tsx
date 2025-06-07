
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Mail, MapPin, Phone } from 'lucide-react';

interface ContactSectionProps {
  onBookingClick: () => void;
}

const ContactSection = ({ onBookingClick }: ContactSectionProps) => {
  return (
    <section className="py-20 barbershop-gradient text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-8">Contáctanos</h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-4 gold-accent" />
                <div>
                  <h4 className="font-semibold">Dirección</h4>
                  <p className="opacity-90">Av. Principal 123, Centro Histórico</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-6 h-6 mr-4 gold-accent" />
                <div>
                  <h4 className="font-semibold">Teléfono</h4>
                  <p className="opacity-90">+52 (55) 1234-5678</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-6 h-6 mr-4 gold-accent" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="opacity-90">info@madmenbarberia.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-6 h-6 mr-4 gold-accent" />
                <div>
                  <h4 className="font-semibold">Horarios</h4>
                  <p className="opacity-90">Lun-Sáb: 9:00 - 19:00</p>
                  <p className="opacity-90">Dom: 10:00 - 16:00</p>
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
            <Button 
              size="lg" 
              className="w-full bg-accent text-barbershop-dark hover:bg-accent/90 font-semibold"
              onClick={onBookingClick}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Reservar Ahora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
