
import ClientWebsite from '@/components/ClientWebsite';

const Index = () => {
  const handleBookingClick = () => {
    // Los clientes se quedan en la vista de cliente
    console.log('Booking clicked from client website');
  };

  return (
    <div className="min-h-screen w-full">
      <ClientWebsite onBookingClick={handleBookingClick} />
    </div>
  );
};

export default Index;
