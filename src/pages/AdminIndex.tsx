import { useState } from 'react';
import Navigation from '@/components/Navigation';
import AdminPanel from '@/components/AdminPanel';
import BookingPortal from '@/components/BookingPortal';
import CalendarView from '@/components/CalendarView';
import StaffManagement from '@/components/StaffManagement';
import ServicesManager from '@/components/ServicesManager';
import MarketingDashboard from '@/components/MarketingDashboard';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import PaymentSystem from '@/components/PaymentSystem';

const AdminIndex = () => {
  const [currentView, setCurrentView] = useState('admin');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'admin':
        return <AdminPanel />;
      case 'calendar':
        return <CalendarView />;
      case 'booking':
        return <BookingPortal />;
      case 'staff':
        return <StaffManagement />;
      case 'services':
        return <ServicesManager />;
      case 'marketing':
        return <MarketingDashboard />;
      case 'payments':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Sistema de Cobros</h1>
              <p className="text-muted-foreground">Panel completo de gestión de pagos y facturación</p>
            </div>
            <PaymentSystem />
          </div>
        );
      case 'analytics':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Estadísticas y Análisis</h1>
              <p className="text-muted-foreground">Dashboard completo con métricas avanzadas del negocio</p>
            </div>
            <AdvancedAnalytics />
          </div>
        );
      case 'clients':
        return (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-4">Gestión de Clientes</h2>
            <p className="text-muted-foreground">Base de datos de clientes y historial - En desarrollo</p>
          </div>
        );
      default:
        return <AdminPanel />;
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

export default AdminIndex;
