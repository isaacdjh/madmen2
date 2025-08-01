
import { useState } from 'react';
import ClientBookingForm from './ClientBookingForm';
import ClientHeroSection from './client/ClientHeroSection';
import LocationsSection from './client/LocationsSection';
import ServicesSection from './client/ServicesSection';
import BonusSection from './client/BonusSection';
import BarbersSection from './client/BarbersSection';
import ProductsSection from './client/ProductsSection';
import TestimonialsSection from './client/TestimonialsSection';
import ContactSection from './client/ContactSection';
import ClientNavigation from './client/ClientNavigation';

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
      <ClientNavigation onBookingClick={() => setShowBookingForm(true)} />
      <ClientHeroSection onBookingClick={() => setShowBookingForm(true)} />
      <TestimonialsSection />
      <ContactSection onBookingClick={() => setShowBookingForm(true)} />
    </div>
  );
};

export default ClientWebsite;
