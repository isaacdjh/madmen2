
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import AdminPanel from '@/components/AdminPanel';
import BookingPortal from '@/components/BookingPortal';
import CalendarView from '@/components/CalendarView';
import StaffManagement from '@/components/StaffManagement';
import ServicesManager from '@/components/ServicesManager';
import MarketingDashboard from '@/components/MarketingDashboard';

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
            <h2 className="text-3xl font-bold mb-4">Sistema de Cobros</h2>
            <p className="text-muted-foreground">Panel de gestión de pagos y facturación - En desarrollo</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-4">Estadísticas y Análisis</h2>
            <p className="text-muted-foreground">Dashboard con métricas de negocio - En desarrollo</p>
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
