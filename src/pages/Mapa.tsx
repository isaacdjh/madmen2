import InteractiveMap from '@/components/client/InteractiveMap';
import ClientNavigation from '@/components/client/ClientNavigation';

const MapaPage = () => {
  const handleBookingClick = () => {
    console.log('Booking clicked from mapa page');
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientNavigation onBookingClick={handleBookingClick} />
      <div className="pt-16">
        <InteractiveMap />
      </div>
    </div>
  );
};

export default MapaPage;