import ProductsSection from '@/components/client/ProductsSection';
import ClientNavigation from '@/components/client/ClientNavigation';

const Productos = () => {
  const handleBookingClick = () => {
    console.log('Booking clicked from productos page');
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientNavigation onBookingClick={handleBookingClick} />
      <div className="pt-16">
        <ProductsSection />
      </div>
    </div>
  );
};

export default Productos;