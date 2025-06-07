
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Star } from 'lucide-react';

interface HeroSectionProps {
  onBookingClick: () => void;
  onLearnMoreClick: () => void;
}

const HeroSection = ({ onBookingClick, onLearnMoreClick }: HeroSectionProps) => {
  return (
    <div className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="inline-block p-3 bg-barbershop-gold/20 rounded-full mb-4">
            <div className="w-16 h-16 bg-barbershop-gold rounded-full flex items-center justify-center">
              <span className="text-barbershop-dark font-bold text-2xl">MB</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-barbershop-gold">Mad Men</span>
          <br />
          <span className="text-white">Barbería Tradicional</span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
          Sistema de gestión integral para barbería. Reservas online, pagos digitales y administración completa 
          en una plataforma elegante y profesional.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button 
            size="lg" 
            className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-bold px-10 py-4 text-lg rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={onBookingClick}
          >
            <Calendar className="w-6 h-6 mr-3" />
            Solicitar Demo
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-dark font-bold px-10 py-4 text-lg rounded-full transition-all duration-300"
            onClick={onLearnMoreClick}
          >
            Conocer Más
          </Button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-barbershop-gold/30 card-hover">
            <Calendar className="w-12 h-12 text-barbershop-gold mb-6 mx-auto" />
            <h3 className="font-bold text-xl mb-3">Reservas Online</h3>
            <p className="text-sm opacity-80 leading-relaxed">Sistema completo de gestión de citas en tiempo real con calendario inteligente</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-barbershop-gold/30 card-hover">
            <Clock className="w-12 h-12 text-barbershop-gold mb-6 mx-auto" />
            <h3 className="font-bold text-xl mb-3">Gestión de Horarios</h3>
            <p className="text-sm opacity-80 leading-relaxed">Control total de disponibilidad y horarios de trabajo personalizables</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-barbershop-gold/30 card-hover">
            <Star className="w-12 h-12 text-barbershop-gold mb-6 mx-auto" />
            <h3 className="font-bold text-xl mb-3">Experiencia Premium</h3>
            <p className="text-sm opacity-80 leading-relaxed">Interfaz elegante diseñada específicamente para barbería tradicional</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
