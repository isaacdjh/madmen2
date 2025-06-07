
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BarChart3, CreditCard, Settings, Menu, X, Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Calendar },
    { id: 'booking', label: 'Reservas', icon: Calendar },
    { id: 'admin', label: 'Administración', icon: Users },
    { id: 'payments', label: 'Cobros', icon: CreditCard },
    { id: 'analytics', label: 'Estadísticas', icon: BarChart3 },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'marketing', label: 'Marketing', icon: Settings },
  ];

  return (
    <>
      <nav className="bg-barbershop-dark text-white shadow-2xl relative z-50 border-b-2 border-barbershop-gold">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-barbershop-gold rounded-full flex items-center justify-center shadow-lg">
                <Scissors className="w-6 h-6 text-barbershop-dark" />
              </div>
              <div>
                <span className="font-bold text-2xl text-barbershop-gold">Mad Men</span>
                <p className="text-xs text-white/70">Barbería Tradicional</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "secondary" : "ghost"}
                    onClick={() => onViewChange(item.id)}
                    className={cn(
                      "text-white hover:bg-barbershop-gold/20 hover:text-barbershop-gold transition-all duration-300 font-medium px-4 py-2 rounded-lg",
                      currentView === item.id && "bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 shadow-lg"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-barbershop-gold/20 hover:text-barbershop-gold"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-barbershop-navy border-t border-barbershop-gold/30">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "secondary" : "ghost"}
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full justify-start text-white hover:bg-barbershop-gold/20 hover:text-barbershop-gold transition-all duration-300 py-3",
                      currentView === item.id && "bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
