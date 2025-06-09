
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BarChart3, CreditCard, Settings, Menu, X, CalendarDays, Home, Scissors, UserCog, Package, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const navigate = useNavigate();

  const directNavItems = [
    { id: 'calendar', label: 'Calendario', icon: CalendarDays },
    { id: 'booking', label: 'Reservas', icon: Calendar },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'bonus', label: 'Bonos', icon: Gift },
  ];

  const dropdownItems = [
    { id: 'home', label: 'Inicio', icon: Home, isClientView: true },
    { id: 'barber-portal', label: 'Portal Barberos', icon: Scissors, isBarberPortal: true },
    { id: 'admin', label: 'Administración', icon: Users },
    { id: 'staff', label: 'Empleados', icon: UserCog },
    { id: 'services', label: 'Servicios', icon: Package },
    { id: 'payments', label: 'Cobros', icon: CreditCard },
    { id: 'analytics', label: 'Estadísticas', icon: BarChart3 },
    { id: 'marketing', label: 'Marketing', icon: Settings },
  ];

  const handleNavClick = (item: any) => {
    if (item.isClientView) {
      navigate('/');
    } else if (item.isBarberPortal) {
      navigate('/barber');
    } else {
      onViewChange(item.id);
    }
  };

  const getCurrentViewLabel = () => {
    const allItems = [...directNavItems, ...dropdownItems];
    const currentItem = allItems.find(item => {
      if (item.isClientView || item.isBarberPortal) return false;
      return currentView === item.id;
    });
    return currentItem?.label || 'Panel Administrativo';
  };

  return (
    <nav className="bg-barbershop-dark text-white shadow-2xl relative z-50 border-b-2 border-barbershop-gold">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/0d116fe9-b6a4-4cca-8d46-59672d4df74d.png" 
                alt="Mad Men Logo" 
                className="h-20 w-auto object-contain"
              />
              <img 
                src="/lovable-uploads/5d557fb8-205e-4120-b27d-62c08ba09e6f.png" 
                alt="Mad Men Text" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <div className="border-l border-barbershop-gold/30 pl-6 ml-6">
              <span className="text-lg font-semibold text-barbershop-gold">{getCurrentViewLabel()}</span>
              <p className="text-sm text-white/80">Sistema de Gestión</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Botones de navegación directa */}
            <div className="hidden lg:flex items-center space-x-2">
              {directNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      "text-white hover:bg-barbershop-gold/20 hover:text-barbershop-gold transition-colors",
                      isActive && "bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {/* Menú Hamburguesa */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-barbershop-gold/20 hover:text-barbershop-gold"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 bg-white border border-gray-200 shadow-lg z-50"
              >
                <DropdownMenuLabel className="text-barbershop-dark font-semibold">
                  Navegación
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Navegación rápida móvil */}
                <div className="lg:hidden">
                  <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wide">
                    Navegación Rápida
                  </DropdownMenuLabel>
                  {directNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => handleNavClick(item)}
                        className={cn(
                          "cursor-pointer hover:bg-barbershop-gold/10 focus:bg-barbershop-gold/10",
                          isActive && "bg-barbershop-gold/20"
                        )}
                      >
                        <Icon className={cn(
                          "w-4 h-4 mr-3",
                          isActive ? "text-barbershop-gold" : "text-gray-600"
                        )} />
                        <span className={cn(
                          isActive ? "text-barbershop-gold font-medium" : "text-barbershop-dark"
                        )}>
                          {item.label}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                </div>
                
                {/* Navegación Principal */}
                <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wide">
                  Principal
                </DropdownMenuLabel>
                {dropdownItems.filter(item => item.isClientView || item.isBarberPortal).map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className="cursor-pointer hover:bg-barbershop-gold/10 focus:bg-barbershop-gold/10"
                    >
                      <Icon className="w-4 h-4 mr-3 text-barbershop-gold" />
                      <span className="text-barbershop-dark">{item.label}</span>
                    </DropdownMenuItem>
                  );
                })}
                
                <DropdownMenuSeparator />
                
                {/* Gestión */}
                <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wide">
                  Gestión
                </DropdownMenuLabel>
                {dropdownItems.filter(item => 
                  ['admin'].includes(item.id)
                ).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        "cursor-pointer hover:bg-barbershop-gold/10 focus:bg-barbershop-gold/10",
                        isActive && "bg-barbershop-gold/20"
                      )}
                    >
                      <Icon className={cn(
                        "w-4 h-4 mr-3",
                        isActive ? "text-barbershop-gold" : "text-gray-600"
                      )} />
                      <span className={cn(
                        isActive ? "text-barbershop-gold font-medium" : "text-barbershop-dark"
                      )}>
                        {item.label}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
                
                <DropdownMenuSeparator />
                
                {/* Servicios y Ventas */}
                <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wide">
                  Servicios y Ventas
                </DropdownMenuLabel>
                {dropdownItems.filter(item => 
                  ['staff', 'services', 'payments'].includes(item.id)
                ).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        "cursor-pointer hover:bg-barbershop-gold/10 focus:bg-barbershop-gold/10",
                        isActive && "bg-barbershop-gold/20"
                      )}
                    >
                      <Icon className={cn(
                        "w-4 h-4 mr-3",
                        isActive ? "text-barbershop-gold" : "text-gray-600"
                      )} />
                      <span className={cn(
                        isActive ? "text-barbershop-gold font-medium" : "text-barbershop-dark"
                      )}>
                        {item.label}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
                
                <DropdownMenuSeparator />
                
                {/* Análisis */}
                <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wide">
                  Análisis
                </DropdownMenuLabel>
                {dropdownItems.filter(item => 
                  ['analytics', 'marketing'].includes(item.id)
                ).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        "cursor-pointer hover:bg-barbershop-gold/10 focus:bg-barbershop-gold/10",
                        isActive && "bg-barbershop-gold/20"
                      )}
                    >
                      <Icon className={cn(
                        "w-4 h-4 mr-3",
                        isActive ? "text-barbershop-gold" : "text-gray-600"
                      )} />
                      <span className={cn(
                        isActive ? "text-barbershop-gold font-medium" : "text-barbershop-dark"
                      )}>
                        {item.label}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
