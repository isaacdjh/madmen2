
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BarChart3, CreditCard, Settings, Menu, X } from 'lucide-react';
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
      <nav className="barbershop-gradient text-white shadow-lg relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-barbershop-dark font-bold text-sm">MB</span>
              </div>
              <span className="font-bold text-xl">Mad Men Barbería</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "secondary" : "ghost"}
                    onClick={() => onViewChange(item.id)}
                    className={cn(
                      "text-white hover:bg-white/10",
                      currentView === item.id && "bg-accent text-barbershop-dark hover:bg-accent/90"
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
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-barbershop-navy border-t border-white/10">
            <div className="px-4 py-2 space-y-1">
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
                      "w-full justify-start text-white hover:bg-white/10",
                      currentView === item.id && "bg-accent text-barbershop-dark hover:bg-accent/90"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
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
