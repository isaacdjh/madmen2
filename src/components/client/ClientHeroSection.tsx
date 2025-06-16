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
          {/* Logo Principal - Ahora más grande */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/5d557fb8-205e-4120-b27d-62c08ba09e6f.png" 
              alt="Mad Men Logo" 
              className="w-48 h-48 md:w-64 md:h-64 mx-auto object-contain"
            />
          </div>

          {/* Descripción Elegante - sin título Mad Men */}
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Donde el estilo clásico se encuentra con la excelencia moderna. 
            El arte de la barbería tradicional perfeccionado en Madrid.
          </p>

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
            <Button 
              size="lg" 
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold px-8 py-4 text-lg"
              onClick={onBookingClick}
            >
              <Calendar className="w-6 h-6 mr-3" />
              Reservar Mi Cita
            </Button>
            
            <p className="text-sm text-white/70">
              La experiencia Mad Men te espera
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
