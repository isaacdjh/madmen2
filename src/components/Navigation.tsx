
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  CreditCard, 
  Gift,
  UserCheck,
  LogOut,
  Scissors,
  LayoutDashboard,
  Clock,
  User,
  MessageSquare,
  FileText,
  TrendingUp
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

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

function AppSidebar({ currentView, onViewChange, onLogout }: Omit<NavigationProps, 'children'>) {
  const { open } = useSidebar();

  const handleNavigation = (view: string) => {
    onViewChange(view);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <LayoutDashboard className="h-6 w-6 text-barbershop-gold" />
          {open && (
            <h2 className="text-lg font-semibold text-barbershop-dark">
              Mad Men Admin
            </h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.id)}
                      isActive={isActive}
                      className={
                        isActive 
                          ? 'bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90' 
                          : 'text-gray-600 hover:text-barbershop-dark hover:bg-gray-100'
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {onLogout && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

const Navigation = ({ currentView, onViewChange, onLogout, children }: NavigationProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          currentView={currentView} 
          onViewChange={onViewChange}
          onLogout={onLogout}
        />
        
        <main className="flex-1 flex flex-col">
          {/* Header with hamburger trigger */}
          <header className="flex items-center gap-2 border-b bg-white px-4 py-3 shadow-sm">
            <SidebarTrigger className="lg:hidden" />
            <h1 className="text-lg font-semibold text-barbershop-dark lg:hidden">
              Panel Administrativo
            </h1>
          </header>
          
          {/* Main content */}
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Navigation;
