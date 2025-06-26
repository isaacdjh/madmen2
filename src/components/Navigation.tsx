
import React, { useState } from 'react';
import { Home, Calendar, Clock, Users, Scissors, Gift, CreditCard, TrendingUp, BarChart3, Megaphone, UserCircle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'admin', label: 'Admin Panel', icon: Home },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'booking', label: 'Reservas', icon: Clock },
    { id: 'staff', label: 'Personal', icon: Users },
    { id: 'services', label: 'Servicios', icon: Scissors },
    { id: 'bonus', label: 'Bonos', icon: Gift },
    { id: 'payments', label: 'Cobros', icon: CreditCard },
    { id: 'reports', label: 'Reportes', icon: TrendingUp },
    { id: 'analytics', label: 'Estadísticas', icon: BarChart3 },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'clients', label: 'Clientes', icon: UserCircle },
  ];

  const handleMenuItemClick = (itemId: string) => {
    onViewChange(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-100 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-barbershop-dark">Panel de Administración</span>
          
          {/* Desktop Menu */}
          <ul className="hidden lg:flex space-x-2 xl:space-x-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-barbershop-gold text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`flex flex-col items-center space-y-1 p-3 rounded-md text-xs font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-barbershop-gold text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
