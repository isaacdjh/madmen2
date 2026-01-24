
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Menu, X, Mail, Briefcase, Phone, Gift } from 'lucide-react';
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

  // Reset scroll position when route changes on mobile
  useEffect(() => {
    // Use setTimeout to avoid conflicts with iOS navigation
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, [location.pathname]);

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
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="w-24 h-20 flex items-center justify-center hover:opacity-80 transition-opacity">
              <img 
                src="/lovable-uploads/5d557fb8-205e-4120-b27d-62c08ba09e6f.png" 
                alt="Mad Men Logo" 
                className="w-full h-full object-contain"
              />
            </Link>
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
              onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/108540', '_blank')}
              size="sm"
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Salamanca
            </Button>
            <Button 
              onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/160842', '_blank')}
              size="sm"
              className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Retiro
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
                  <DrawerTitle className="text-white text-center text-lg font-bold">Más Información</DrawerTitle>
                  <DrawerDescription className="text-white text-center font-medium">
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
                  <Link to="/blog">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Blog & Tips
                    </Button>
                  </Link>
                  <Link to="/amigos">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Invita a un Amigo
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
                      className="w-full justify-start border-primary/50 text-primary hover:text-primary-foreground"
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
                  <DrawerTitle className="text-white text-center text-lg font-bold">Mad Men</DrawerTitle>
                  <DrawerDescription className="text-white text-center font-medium">
                    Barbería Tradicional
                  </DrawerDescription>
                </DrawerHeader>
                 <div className="px-6 space-y-3">
                   <DrawerClose asChild>
                     <Link to="/">
                       <Button 
                         variant="ghost" 
                         className="w-full justify-start text-white hover:text-barbershop-gold hover:bg-white/10"
                       >
                         Inicio
                       </Button>
                     </Link>
                   </DrawerClose>
                   <DrawerClose asChild>
                     <Link to="/ubicaciones">
                       <Button 
                         variant="ghost" 
                         className="w-full justify-start text-white hover:text-barbershop-gold hover:bg-white/10"
                       >
                         Ubicaciones
                       </Button>
                     </Link>
                   </DrawerClose>
                   <DrawerClose asChild>
                     <Link to="/servicios">
                       <Button 
                         variant="ghost" 
                         className="w-full justify-start text-white hover:text-barbershop-gold hover:bg-white/10"
                       >
                         Servicios
                       </Button>
                     </Link>
                   </DrawerClose>
                   <DrawerClose asChild>
                     <Link to="/productos">
                       <Button 
                         variant="ghost" 
                         className="w-full justify-start text-white hover:text-barbershop-gold hover:bg-white/10"
                       >
                         Productos
                       </Button>
                     </Link>
                   </DrawerClose>
                   <DrawerClose asChild>
                     <Link to="/bonos">
                       <Button 
                         variant="ghost" 
                         className="w-full justify-start text-white hover:text-barbershop-gold hover:bg-white/10"
                       >
                         Bonos de Ahorro
                       </Button>
                     </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                      <Link to="/blog">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-white hover:text-barbershop-gold hover:bg-white/10"
                        >
                          Blog & Tips
                        </Button>
                      </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                      <Link to="/amigos">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-white hover:text-barbershop-gold hover:bg-white/10"
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          Invita a un Amigo
                        </Button>
                      </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                      <Link to="/equipo">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-white hover:text-barbershop-gold hover:bg-white/10"
                        >
                          Equipo
                        </Button>
                      </Link>
                   </DrawerClose>
                  <Button 
                    onClick={sendCurriculum}
                    variant="outline" 
                    className="w-full justify-start border-white/50 text-white hover:bg-white hover:text-barbershop-navy"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Trabajar con Nosotros
                  </Button>
                   <DrawerClose asChild>
                     <Link to="/contacto">
                       <Button 
                         variant="ghost" 
                         className="w-full justify-start text-white hover:text-barbershop-gold hover:bg-white/10"
                       >
                         Contacto
                       </Button>
                     </Link>
                   </DrawerClose>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button className="bg-white text-barbershop-navy hover:bg-white/90 font-semibold">
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
