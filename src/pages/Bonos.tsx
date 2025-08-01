import BonusSection from '@/components/client/BonusSection';
import ClientNavigation from '@/components/client/ClientNavigation';

const Bonos = () => {
  const handleBookingClick = () => {
    console.log('Booking clicked from bonos page');
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientNavigation onBookingClick={handleBookingClick} />
      <div className="pt-16">
        <BonusSection />
      </div>
    </div>
  );
};

export default Bonos;