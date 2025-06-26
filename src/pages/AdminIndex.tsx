
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
import BonusManager from '@/components/BonusManager';
import RevenueReports from '@/components/RevenueReports';
import ClientManagement from '@/components/ClientManagement';

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
      case 'bonus':
        return <BonusManager />;
      case 'clients':
        return <ClientManagement />;
      case 'payments':
        return (
          <div className="container mx-auto px-4 py-4 md:py-8">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-barbershop-dark mb-2">Sistema de Cobros</h1>
              <p className="text-sm md:text-base text-muted-foreground">Panel completo de gestión de pagos y facturación</p>
            </div>
            <PaymentSystem />
          </div>
        );
      case 'analytics':
        return (
          <div className="container mx-auto px-4 py-4 md:py-8">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-barbershop-dark mb-2">Estadísticas y Análisis</h1>
              <p className="text-sm md:text-base text-muted-foreground">Dashboard completo con métricas avanzadas del negocio</p>
            </div>
            <AdvancedAnalytics />
          </div>
        );
      case 'reports':
        return (
          <div className="container mx-auto px-4 py-4 md:py-8">
            <RevenueReports />
          </div>
        );
      default:
        return <AdminPanel />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <div className="w-full">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default AdminIndex;
