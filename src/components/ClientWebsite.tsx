
import { useState, lazy, Suspense } from 'react';
import ClientNavigation from './client/ClientNavigation';
import ClientHeroSection from './client/ClientHeroSection';

// Lazy load componentes que no son críticos para el primer render
const ClientBookingForm = lazy(() => import('./ClientBookingForm'));
const TestimonialsSection = lazy(() => import('./client/TestimonialsSection'));
const OffersSection = lazy(() => import('./client/OffersSection'));
const ContactSection = lazy(() => import('./client/ContactSection'));
const PublicMap = lazy(() => import('./client/PublicMap'));
const LocationsSection = lazy(() => import('./client/LocationsSection'));

// Skeleton loader para secciones
const SectionSkeleton = () => (
  <div className="py-16 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-muted rounded" />
        ))}
      </div>
    </div>
  </div>
);

interface ClientWebsiteProps {
  onBookingClick: () => void;
}

const ClientWebsite = ({ onBookingClick }: ClientWebsiteProps) => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  if (showBookingForm) {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
        <ClientBookingForm onBack={() => setShowBookingForm(false)} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen">
      <ClientNavigation onBookingClick={() => setShowBookingForm(true)} />
      <ClientHeroSection onBookingClick={() => setShowBookingForm(true)} />
      
      <Suspense fallback={<SectionSkeleton />}>
        <OffersSection onViewBonuses={() => window.open('/bonos', '_blank')} />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <LocationsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <PublicMap />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <ContactSection onBookingClick={() => setShowBookingForm(true)} />
      </Suspense>
    </div>
  );
};

export default ClientWebsite;
