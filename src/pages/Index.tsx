
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import BookingPortal from '@/components/BookingPortal';
import AdminPanel from '@/components/AdminPanel';
import ClientWebsite from '@/components/ClientWebsite';

const Index = () => {
  const [currentView, setCurrentView] = useState('client');

  const handleBookingClick = () => {
    // Los clientes siempre se quedan en la vista de cliente
    setCurrentView('client');
  };

  const handleLearnMoreClick = () => {
    setCurrentView('client');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'client':
        return <ClientWebsite onBookingClick={handleBookingClick} />;
      case 'booking':
        return <BookingPortal />;
      case 'admin':
        return <AdminPanel />;
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
      case 'marketing':
        return (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-4">Herramientas de Marketing</h2>
            <p className="text-muted-foreground">Campañas y promociones - En desarrollo</p>
          </div>
        );
      default:
        return <ClientWebsite onBookingClick={handleBookingClick} />;
    }
  };

  return (
    <div className="min-h-screen w-full">
      {currentView !== 'client' && (
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
      )}
      {renderCurrentView()}
    </div>
  );
};

export default Index;
