import ContactSection from '@/components/client/ContactSection';
import ClientNavigation from '@/components/client/ClientNavigation';

const Contacto = () => {
  const handleBookingClick = () => {
    console.log('Booking clicked from contacto page');
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientNavigation onBookingClick={handleBookingClick} />
      <div className="pt-16">
        <ContactSection onBookingClick={handleBookingClick} />
      </div>
    </div>
  );
};

export default Contacto;