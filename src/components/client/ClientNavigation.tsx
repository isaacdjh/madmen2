
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

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
            <Link 
              to="/"
              className={`text-white hover:text-barbershop-gold transition-colors font-medium ${location.pathname === '/' ? 'text-barbershop-gold' : ''}`}
            >
              Inicio
            </Link>
            <Link 
              to="/ubicaciones"
              className={`text-white hover:text-barbershop-gold transition-colors font-medium ${location.pathname === '/ubicaciones' ? 'text-barbershop-gold' : ''}`}
            >
              Ubicaciones
            </Link>
            <Link 
              to="/servicios"
              className={`text-white hover:text-barbershop-gold transition-colors font-medium ${location.pathname === '/servicios' ? 'text-barbershop-gold' : ''}`}
            >
              Servicios
            </Link>
            <Link 
              to="/equipo"
              className={`text-white hover:text-barbershop-gold transition-colors font-medium ${location.pathname === '/equipo' ? 'text-barbershop-gold' : ''}`}
            >
              Equipo
            </Link>
          </div>

          {/* Desktop Booking Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/101632', '_blank')}
              size="sm"
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Río Rosa
            </Button>
            <Button 
              onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/108540', '_blank')}
              size="sm"
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Salamanca
            </Button>
            
            {/* Menu Drawer Trigger */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-dark">
                  <Menu className="w-5 h-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-barbershop-navy border-primary/30">
                <DrawerHeader>
                  <DrawerTitle className="text-primary text-center text-lg font-bold">Más Información</DrawerTitle>
                  <DrawerDescription className="text-primary/80 text-center">
                    Descubre todo lo que Mad Men tiene para ofrecerte
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-6 space-y-4">
                  <Link to="/productos">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Productos STMNT
                    </Button>
                  </Link>
                  <Link to="/bonos">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Bonos de Ahorro
                    </Button>
                  </Link>
                  <Button 
                    onClick={sendCurriculum}
                    variant="outline" 
                    className="w-full justify-start border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Trabajar con Nosotros
                  </Button>
                  <Button 
                    onClick={() => window.open('mailto:madmenmadrid@outlook.es', '_blank')}
                    variant="outline" 
                    className="w-full justify-start border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contacto
                  </Button>
                  <Link to="/contacto">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Información Completa
                    </Button>
                  </Link>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Cerrar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-barbershop-navy border-primary/30">
                <DrawerHeader>
                  <DrawerTitle className="text-primary text-center text-lg font-bold">Mad Men</DrawerTitle>
                  <DrawerDescription className="text-primary/80 text-center">
                    Barbería Tradicional
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-6 space-y-3">
                  <Link to="/">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-primary hover:text-accent hover:bg-primary/10"
                    >
                      Inicio
                    </Button>
                  </Link>
                  <Link to="/ubicaciones">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-primary hover:text-accent hover:bg-primary/10"
                    >
                      Ubicaciones
                    </Button>
                  </Link>
                  <Link to="/servicios">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-primary hover:text-accent hover:bg-primary/10"
                    >
                      Servicios
                    </Button>
                  </Link>
                  <Link to="/productos">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-primary hover:text-accent hover:bg-primary/10"
                    >
                      Productos
                    </Button>
                  </Link>
                  <Link to="/bonos">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-primary hover:text-accent hover:bg-primary/10"
                    >
                      Bonos de Ahorro
                    </Button>
                  </Link>
                  <Link to="/equipo">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-primary hover:text-accent hover:bg-primary/10"
                    >
                      Equipo
                    </Button>
                  </Link>
                  <Button 
                    onClick={sendCurriculum}
                    variant="outline" 
                    className="w-full justify-start border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Trabajar con Nosotros
                  </Button>
                  <Link to="/contacto">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-primary hover:text-accent hover:bg-primary/10"
                    >
                      Contacto
                    </Button>
                  </Link>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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
