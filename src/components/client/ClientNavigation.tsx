
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Menu, X, Mail, Briefcase, Phone } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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

  const sendCurriculum = () => {
    window.open('mailto:madmenmadrid@outlook.es?subject=Solicitud de Empleo - Mad Men&body=Estimados señores de Mad Men,%0D%0A%0D%0AMe dirijo a ustedes para expresar mi interés en formar parte de su equipo de barberos profesionales.%0D%0A%0D%0AAttachments: Por favor, adjunte su curriculum vitae.%0D%0A%0D%0ASaludos cordiales,', '_blank');
  };

  return (
    <nav className="fixed top-0 w-full bg-barbershop-dark/95 backdrop-blur-sm z-50 border-b border-barbershop-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/5d557fb8-205e-4120-b27d-62c08ba09e6f.png" 
                alt="Mad Men Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="text-white hover:text-barbershop-gold transition-colors font-medium"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('ubicaciones')}
              className="text-white hover:text-barbershop-gold transition-colors font-medium"
            >
              Ubicaciones
            </button>
            <button 
              onClick={() => scrollToSection('servicios')}
              className="text-white hover:text-barbershop-gold transition-colors font-medium"
            >
              Servicios
            </button>
            <button 
              onClick={() => scrollToSection('equipo')}
              className="text-white hover:text-barbershop-gold transition-colors font-medium"
            >
              Equipo
            </button>
          </div>

          {/* Desktop Booking Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              onClick={onBookingClick}
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Reservar Cita
            </Button>
            
            {/* Menu Drawer Trigger */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-dark">
                  <Menu className="w-5 h-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-barbershop-dark border-barbershop-gold/30">
                <DrawerHeader>
                  <DrawerTitle className="text-barbershop-gold text-center">Más Información</DrawerTitle>
                  <DrawerDescription className="text-white/70 text-center">
                    Descubre todo lo que Mad Men tiene para ofrecerte
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-6 space-y-4">
                  <Button 
                    onClick={() => scrollToSection('productos')}
                    variant="outline" 
                    className="w-full justify-start border-barbershop-gold/50 text-white hover:bg-barbershop-gold hover:text-barbershop-dark"
                  >
                    Productos STMNT
                  </Button>
                  <Button 
                    onClick={sendCurriculum}
                    variant="outline" 
                    className="w-full justify-start border-barbershop-gold/50 text-white hover:bg-barbershop-gold hover:text-barbershop-dark"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Trabajar con Nosotros
                  </Button>
                  <Button 
                    onClick={() => window.open('mailto:madmenmadrid@outlook.es', '_blank')}
                    variant="outline" 
                    className="w-full justify-start border-barbershop-gold/50 text-white hover:bg-barbershop-gold hover:text-barbershop-dark"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contacto
                  </Button>
                  <Button 
                    onClick={() => scrollToSection('contacto')}
                    variant="outline" 
                    className="w-full justify-start border-barbershop-gold/50 text-white hover:bg-barbershop-gold hover:text-barbershop-dark"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Información Completa
                  </Button>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90">
                      Cerrar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              onClick={onBookingClick}
              size="sm"
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold"
            >
              <Calendar className="w-4 h-4" />
            </Button>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-barbershop-dark border-barbershop-gold/30">
                <DrawerHeader>
                  <DrawerTitle className="text-barbershop-gold text-center">Mad Men</DrawerTitle>
                  <DrawerDescription className="text-white/70 text-center">
                    Barbería Tradicional
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-6 space-y-3">
                  <Button 
                    onClick={() => scrollToSection('inicio')}
                    variant="ghost" 
                    className="w-full justify-start text-white hover:text-barbershop-gold"
                  >
                    Inicio
                  </Button>
                  <Button 
                    onClick={() => scrollToSection('ubicaciones')}
                    variant="ghost" 
                    className="w-full justify-start text-white hover:text-barbershop-gold"
                  >
                    Ubicaciones
                  </Button>
                  <Button 
                    onClick={() => scrollToSection('servicios')}
                    variant="ghost" 
                    className="w-full justify-start text-white hover:text-barbershop-gold"
                  >
                    Servicios
                  </Button>
                  <Button 
                    onClick={() => scrollToSection('productos')}
                    variant="ghost" 
                    className="w-full justify-start text-white hover:text-barbershop-gold"
                  >
                    Productos
                  </Button>
                  <Button 
                    onClick={() => scrollToSection('equipo')}
                    variant="ghost" 
                    className="w-full justify-start text-white hover:text-barbershop-gold"
                  >
                    Equipo
                  </Button>
                  <Button 
                    onClick={sendCurriculum}
                    variant="outline" 
                    className="w-full justify-start border-barbershop-gold/50 text-white hover:bg-barbershop-gold hover:text-barbershop-dark"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Trabajar con Nosotros
                  </Button>
                  <Button 
                    onClick={() => scrollToSection('contacto')}
                    variant="ghost" 
                    className="w-full justify-start text-white hover:text-barbershop-gold"
                  >
                    Contacto
                  </Button>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90">
                      Cerrar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavigation;
