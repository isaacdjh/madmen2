import ServicesSection from '@/components/client/ServicesSection';
import ClientNavigation from '@/components/client/ClientNavigation';

const Servicios = () => {
  const handleBookingClick = () => {
    console.log('Booking clicked from servicios page');
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientNavigation onBookingClick={handleBookingClick} />
      <div className="pt-16">
        <ServicesSection />
      </div>
    </div>
  );
};

export default Servicios;