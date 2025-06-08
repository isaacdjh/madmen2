
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Phone } from 'lucide-react';

interface ClientHeroSectionProps {
  onBookingClick: () => void;
}

const ClientHeroSection = ({ onBookingClick }: ClientHeroSectionProps) => {
  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 barbershop-gradient opacity-90"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/10 rounded-full p-4 backdrop-blur-sm border border-accent/30">
            <img 
              src="/lovable-uploads/5d557fb8-205e-4120-b27d-62c08ba09e6f.png" 
              alt="Mad Men Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Mad Men
        </h1>
        <h2 className="text-2xl md:text-3xl mb-4 gold-accent">
          Barbería Tradicional
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
          Donde el estilo clásico se encuentra con la excelencia moderna. 
          Más de 20 años perfeccionando el arte de la barbería tradicional en Madrid.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-accent text-barbershop-dark hover:bg-accent/90 font-semibold px-8 py-4 text-lg rounded-lg shadow-xl transition-all duration-300 hover:scale-105"
            onClick={onBookingClick}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Reservar Cita
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white text-white hover:bg-white hover:text-barbershop-dark font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300"
          >
            <Phone className="w-5 h-5 mr-2" />
            Llamar Ahora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ClientHeroSection;
