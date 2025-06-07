
import { useState } from 'react';
import ClientBookingForm from './ClientBookingForm';
import ClientHeroSection from './client/ClientHeroSection';
import LocationsSection from './client/LocationsSection';
import ServicesSection from './client/ServicesSection';
import BarbersSection from './client/BarbersSection';
import TestimonialsSection from './client/TestimonialsSection';
import ContactSection from './client/ContactSection';

interface ClientWebsiteProps {
  onBookingClick: () => void;
}

const ClientWebsite = ({ onBookingClick }: ClientWebsiteProps) => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  if (showBookingForm) {
    return <ClientBookingForm onBack={() => setShowBookingForm(false)} />;
  }

  return (
    <div className="min-h-screen">
      <ClientHeroSection onBookingClick={() => setShowBookingForm(true)} />
      <LocationsSection />
      <ServicesSection />
      <BarbersSection />
      <TestimonialsSection />
      <ContactSection onBookingClick={() => setShowBookingForm(true)} />
    </div>
  );
};

export default ClientWebsite;
