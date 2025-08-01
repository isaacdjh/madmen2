import BarbersSection from '@/components/client/BarbersSection';
import ClientNavigation from '@/components/client/ClientNavigation';

const Equipo = () => {
  const handleBookingClick = () => {
    console.log('Booking clicked from equipo page');
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientNavigation onBookingClick={handleBookingClick} />
      <div className="pt-16">
        <BarbersSection />
      </div>
    </div>
  );
};

export default Equipo;