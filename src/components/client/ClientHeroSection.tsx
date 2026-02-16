
import { Button } from '@/components/ui/button';
import { Calendar, Star, MapPin } from 'lucide-react';
import heroVideo from '@/assets/hero-barbershop-bg.mp4';

interface ClientHeroSectionProps {
  onBookingClick: () => void;
}

const ClientHeroSection = ({ onBookingClick }: ClientHeroSectionProps) => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center text-white overflow-hidden" aria-label="Barbería en Madrid - Mad Men Barbería Tradicional">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-barbershop-dark/70" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo Principal - Centrado donde estaban las letras amarillas */}
          <div className="mb-6">
            <img 
              src="/lovable-uploads/5d557fb8-205e-4120-b27d-62c08ba09e6f.png" 
              alt="Mad Men Logo" 
              className="w-32 h-32 md:w-40 md:h-40 mx-auto object-contain"
            />
          </div>

          {/* H1 SEO - visible para buscadores */}
          <h1 className="sr-only">Barbería en Madrid - Mad Men Barbería Tradicional - Corte de pelo y afeitado profesional</h1>
          
          {/* Descripción Elegante */}
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Donde el estilo clásico se encuentra con la excelencia moderna. 
            El arte de la barbería tradicional perfeccionado en Madrid.
          </p>

          {/* Botones móviles para reservas - solo visible en móviles */}
          <div className="md:hidden flex flex-wrap gap-2 justify-center mb-8">
            <Button 
              onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/108540', '_blank')}
              size="sm"
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold px-3 py-2"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Salamanca
            </Button>
            <Button 
              onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/160842', '_blank')}
              size="sm"
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold px-3 py-2"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Retiro
            </Button>
          </div>

          {/* Características destacadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Star className="w-8 h-8 text-barbershop-gold mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Excelencia Garantizada</h3>
              <p className="text-sm text-white/80">Barberos profesionales con técnicas tradicionales</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <MapPin className="w-8 h-8 text-barbershop-gold mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Dos Ubicaciones</h3>
              <p className="text-sm text-white/80">Salamanca y Retiro</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Calendar className="w-8 h-8 text-barbershop-gold mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Citas Flexibles</h3>
              <p className="text-sm text-white/80">Horarios amplios todos los días</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold px-6 py-4 text-base"
                onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/108540', '_blank')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Reservar Salamanca
              </Button>
              
              <Button 
                size="lg" 
                className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold px-6 py-4 text-base"
                onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/160842', '_blank')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Reservar Retiro
              </Button>
            </div>
            
            <p className="text-sm text-white/70">
              Reservas rápidas a través de Booksy
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent" />
    </section>
  );
};

export default ClientHeroSection;
