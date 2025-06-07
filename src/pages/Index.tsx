
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import BookingPortal from '@/components/BookingPortal';
import AdminPanel from '@/components/AdminPanel';
import ClientWebsite from '@/components/ClientWebsite';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');

  const handleBookingClick = () => {
    setCurrentView('booking');
  };

  const handleLearnMoreClick = () => {
    setCurrentView('website');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HeroSection 
            onBookingClick={handleBookingClick}
            onLearnMoreClick={handleLearnMoreClick}
          />
        );
      case 'booking':
        return <BookingPortal />;
      case 'admin':
        return <AdminPanel />;
      case 'website':
        return <ClientWebsite onBookingClick={handleBookingClick} />;
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
        return (
          <HeroSection 
            onBookingClick={handleBookingClick}
            onLearnMoreClick={handleLearnMoreClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
