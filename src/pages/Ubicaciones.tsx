import LocationsSection from '@/components/client/LocationsSection';
import ClientNavigation from '@/components/client/ClientNavigation';

const Ubicaciones = () => {
  const handleBookingClick = () => {
    console.log('Booking clicked from ubicaciones page');
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientNavigation onBookingClick={handleBookingClick} />
      <div className="pt-16">
        <LocationsSection />
      </div>
    </div>
  );
};

export default Ubicaciones;