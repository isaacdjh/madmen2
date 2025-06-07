
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Star } from 'lucide-react';

interface HeroSectionProps {
  onBookingClick: () => void;
  onLearnMoreClick: () => void;
}

const HeroSection = ({ onBookingClick, onLearnMoreClick }: HeroSectionProps) => {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 barbershop-gradient opacity-85"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Mad Men: Sistema de Gestión de Barbería Tradicional
        </h1>
        
        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Plataforma web integral diseñada exclusivamente para Mad Men Barbería Tradicional. Gestiona reservas, pagos y clientes con 
          nuestra solución completa que funciona en cualquier dispositivo sin necesidad de aplicaciones.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-accent text-barbershop-dark hover:bg-accent/90 font-semibold px-8 py-3 text-lg"
            onClick={onBookingClick}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Solicitar Demo
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-barbershop-dark font-semibold px-8 py-3 text-lg"
            onClick={onLearnMoreClick}
          >
            Conocer Más
          </Button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Calendar className="w-8 h-8 gold-accent mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Reservas Online</h3>
            <p className="text-sm opacity-80">Sistema completo de gestión de citas en tiempo real</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Clock className="w-8 h-8 gold-accent mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Gestión de Horarios</h3>
            <p className="text-sm opacity-80">Control total de disponibilidad y horarios de trabajo</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Star className="w-8 h-8 gold-accent mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Experiencia Premium</h3>
            <p className="text-sm opacity-80">Interfaz elegante diseñada para barbería tradicional</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
