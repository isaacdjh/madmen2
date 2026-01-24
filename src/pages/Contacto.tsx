
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Mail, MapPin, Phone, Instagram, MessageCircle } from 'lucide-react';
import ClientNavigation from '@/components/client/ClientNavigation';

const Contacto = () => {
  return (
    <>
      <Helmet>
        <title>Contacto - Mad Men Barbería Madrid</title>
        <meta name="description" content="Contacta con Mad Men Barbería en Madrid. Encuentra nuestras direcciones en Salamanca y Retiro, teléfonos, horarios y redes sociales." />
      </Helmet>
      
      <ClientNavigation onBookingClick={() => {}} />
      
      <div className="min-h-screen bg-barbershop-dark pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-barbershop-gold/20 text-barbershop-gold border-barbershop-gold/30 mb-4">
              Información Completa
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contacta con <span className="text-barbershop-gold">Mad Men</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Estamos aquí para atenderte. Visítanos en cualquiera de nuestras ubicaciones 
              o contáctanos por teléfono, email o redes sociales.
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Salamanca */}
            <Card className="bg-barbershop-navy/50 border-barbershop-gold/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-barbershop-gold/10 p-6 border-b border-barbershop-gold/20">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="/images/barber-pole.gif" alt="Barber pole" className="h-10 w-auto" />
                    <h2 className="text-2xl font-bold text-white">Mad Men Salamanca</h2>
                  </div>
                  <p className="text-gray-400">Nuestra sede principal en el corazón de Madrid</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-barbershop-gold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium">Dirección</h3>
                      <p className="text-gray-400">General Pardiñas 101</p>
                      <p className="text-gray-400">Barrio Salamanca, Madrid</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-barbershop-gold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium">Teléfono</h3>
                      <a href="tel:+34910597766" className="text-gray-400 hover:text-barbershop-gold transition-colors">
                        +34 910 597 766
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-barbershop-gold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium">Horario</h3>
                      <p className="text-gray-400">Lun - Vie: 11:00 - 21:00</p>
                      <p className="text-gray-400">Sáb: 10:00 - 21:00</p>
                      <p className="text-gray-400">Dom: Cerrado</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/108540', '_blank')}
                    className="w-full bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 mt-4"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar en Salamanca
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Retiro */}
            <Card className="bg-barbershop-navy/50 border-barbershop-gold/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-barbershop-gold/10 p-6 border-b border-barbershop-gold/20">
                  <div className="flex items-center gap-3 mb-2">
                    <img src="/images/barber-pole.gif" alt="Barber pole" className="h-10 w-auto" />
                    <h2 className="text-2xl font-bold text-white">Mad Men Retiro</h2>
                  </div>
                  <p className="text-gray-400">Nuestra nueva sede junto al Parque del Retiro</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-barbershop-gold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium">Dirección</h3>
                      <p className="text-gray-400">Calle Alcalde Sainz de Baranda 53</p>
                      <p className="text-gray-400">28009 Madrid</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-barbershop-gold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium">Teléfono</h3>
                      <a href="tel:+34912231715" className="text-gray-400 hover:text-barbershop-gold transition-colors">
                        +34 912 231 715
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-barbershop-gold mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium">Horario</h3>
                      <p className="text-gray-400">Lun - Vie: 11:00 - 21:00</p>
                      <p className="text-gray-400">Sáb: 10:00 - 21:00</p>
                      <p className="text-barbershop-gold">Dom: 10:00 - 17:00 ✓</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/160842', '_blank')}
                    className="w-full bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 mt-4"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar en Retiro
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* General Contact Info */}
          <Card className="bg-barbershop-navy/50 border-barbershop-gold/20 mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-8">Información General</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-barbershop-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-barbershop-gold" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Email</h3>
                  <a href="mailto:madmenmadrid@outlook.es" className="text-gray-400 hover:text-barbershop-gold transition-colors">
                    madmenmadrid@outlook.es
                  </a>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-barbershop-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Instagram className="w-8 h-8 text-barbershop-gold" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Instagram</h3>
                  <a 
                    href="https://www.instagram.com/madmenmadrid/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-barbershop-gold transition-colors"
                  >
                    @madmenmadrid
                  </a>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-barbershop-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-barbershop-gold" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">WhatsApp</h3>
                  <a 
                    href="https://wa.me/34623158565" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-barbershop-gold transition-colors"
                  >
                    +34 623 158 565
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work With Us CTA */}
          <div className="text-center p-8 bg-barbershop-navy/50 rounded-2xl border border-barbershop-gold/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Quieres trabajar con nosotros?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Si eres barbero profesional y te gustaría formar parte del equipo Mad Men, 
              envíanos tu currículum y nos pondremos en contacto contigo.
            </p>
            <Button 
              onClick={() => window.open('mailto:madmenmadrid@outlook.es?subject=Solicitud de Empleo - Mad Men&body=Estimados señores de Mad Men,%0D%0A%0D%0AMe dirijo a ustedes para expresar mi interés en formar parte de su equipo de barberos profesionales.%0D%0A%0D%0AAdjunto mi curriculum vitae.%0D%0A%0D%0ASaludos cordiales,', '_blank')}
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar Currículum
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacto;
