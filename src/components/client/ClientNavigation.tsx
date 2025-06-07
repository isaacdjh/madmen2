
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Menu, X } from 'lucide-react';

interface ClientNavigationProps {
  onBookingClick: () => void;
}

const ClientNavigation = ({ onBookingClick }: ClientNavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-barbershop-dark/95 backdrop-blur-sm z-50 border-b border-barbershop-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-barbershop-gold">Mad Men</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="text-white hover:text-barbershop-gold transition-colors"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('ubicaciones')}
              className="text-white hover:text-barbershop-gold transition-colors"
            >
              Ubicaciones
            </button>
            <button 
              onClick={() => scrollToSection('servicios')}
              className="text-white hover:text-barbershop-gold transition-colors"
            >
              Servicios
            </button>
            <button 
              onClick={() => scrollToSection('productos')}
              className="text-white hover:text-barbershop-gold transition-colors"
            >
              Productos
            </button>
            <button 
              onClick={() => scrollToSection('equipo')}
              className="text-white hover:text-barbershop-gold transition-colors"
            >
              Equipo
            </button>
            <button 
              onClick={() => scrollToSection('contacto')}
              className="text-white hover:text-barbershop-gold transition-colors"
            >
              Contacto
            </button>
          </div>

          {/* Booking Button */}
          <div className="hidden md:flex items-center">
            <Button 
              onClick={onBookingClick}
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Reservar Cita
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-barbershop-gold/20">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="text-white hover:text-barbershop-gold transition-colors text-left"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('ubicaciones')}
                className="text-white hover:text-barbershop-gold transition-colors text-left"
              >
                Ubicaciones
              </button>
              <button 
                onClick={() => scrollToSection('servicios')}
                className="text-white hover:text-barbershop-gold transition-colors text-left"
              >
                Servicios
              </button>
              <button 
                onClick={() => scrollToSection('productos')}
                className="text-white hover:text-barbershop-gold transition-colors text-left"
              >
                Productos
              </button>
              <button 
                onClick={() => scrollToSection('equipo')}
                className="text-white hover:text-barbershop-gold transition-colors text-left"
              >
                Equipo
              </button>
              <button 
                onClick={() => scrollToSection('contacto')}
                className="text-white hover:text-barbershop-gold transition-colors text-left"
              >
                Contacto
              </button>
              <Button 
                onClick={onBookingClick}
                className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 w-full"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reservar Cita
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ClientNavigation;
