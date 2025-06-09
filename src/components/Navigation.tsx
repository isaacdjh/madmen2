import React from 'react';
import { Home, Calendar, Clock, Users, Scissors, Gift, CreditCard, TrendingUp, BarChart3, Megaphone, UserCircle } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
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

  return (
    <nav className="bg-gray-100 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold text-barbershop-dark">Panel de Administración</span>
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === item.id
                    ? 'bg-barbershop-gold text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
