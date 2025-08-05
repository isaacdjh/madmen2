
import { Button } from '@/components/ui/button';
import { Calendar, Star, MapPin } from 'lucide-react';

interface ClientHeroSectionProps {
  onBookingClick: () => void;
}

const ClientHeroSection = ({ onBookingClick }: ClientHeroSectionProps) => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center barbershop-gradient text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-repeat opacity-30" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo Principal - Centrado donde estaban las letras amarillas */}
          <div className="mb-6">
            <img 
              src="/lovable-uploads/abef21ef-e8bf-4631-a2c1-f781e0a01eed.png" 
              alt="Mad Men Barbería Tradicional" 
              className="w-32 h-32 md:w-40 md:h-40 mx-auto object-contain"
            />
          </div>

          {/* Descripción Elegante - sin título Mad Men */}
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Donde el estilo clásico se encuentra con la excelencia moderna. 
            El arte de la barbería tradicional perfeccionado en Madrid.
          </p>

          {/* Botones móviles para reservas - solo visible en móviles */}
          <div className="md:hidden flex gap-4 justify-center mb-8">
            <Button 
              onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/101632', '_blank')}
              size="sm"
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold px-4 py-2"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Río Rosa
            </Button>
            <Button 
              onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/108540', '_blank')}
              size="sm"
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold px-4 py-2"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Salamanca
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
              <p className="text-sm text-white/80">Río Rosa y Salamanca, Madrid</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Calendar className="w-8 h-8 text-barbershop-gold mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Citas Flexibles</h3>
              <p className="text-sm text-white/80">Horarios amplios todos los días</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold px-8 py-4 text-lg"
                onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/101632', '_blank')}
              >
                <Calendar className="w-6 h-6 mr-3" />
                Reservar Río Rosa
              </Button>
              
              <Button 
                size="lg" 
                className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold px-8 py-4 text-lg"
                onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/108540', '_blank')}
              >
                <Calendar className="w-6 h-6 mr-3" />
                Reservar Salamanca
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
