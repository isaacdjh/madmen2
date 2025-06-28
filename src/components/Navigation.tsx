import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  CreditCard, 
  Gift,
  UserCheck,
  Menu,
  LogOut,
  Scissors,
  LayoutDashboard,
  Clock,
  User,
  MessageSquare,
  FileText,
  TrendingUp
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
}

const Navigation = ({ currentView, onViewChange, onLogout }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'admin', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'booking', label: 'Reservas', icon: Clock },
    { id: 'staff', label: 'Personal', icon: Users },
    { id: 'services', label: 'Servicios', icon: Scissors },
    { id: 'clients', label: 'Clientes', icon: User },
    { id: 'bonus', label: 'Bonos', icon: Gift },
    { id: 'payments', label: 'Cobros', icon: CreditCard },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'analytics', label: 'Análisis', icon: BarChart3 },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
  ];

  const handleNavigation = (view: string) => {
    onViewChange(view);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMenuOpen(false);
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-barbershop-dark">Panel Administrativo</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive 
                  ? 'bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90' 
                  : 'text-gray-600 hover:text-barbershop-dark hover:bg-gray-100'
              }`}
              onClick={() => handleNavigation(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {onLogout && (
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r shadow-sm z-50">
        <NavContent />
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-barbershop-dark">Admin Panel</h1>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="lg:ml-64 lg:pt-0 pt-20">
        {/* Content goes here */}
      </div>
    </>
  );
};

export default Navigation;
