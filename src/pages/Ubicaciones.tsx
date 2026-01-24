import { Helmet } from 'react-helmet-async';
import ClientNavigation from '@/components/client/ClientNavigation';
import LocationsSection from '@/components/client/LocationsSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Ubicaciones = () => {
  return (
    <>
      <Helmet>
        <title>Ubicaciones | Mad Men Barbería Tradicional Madrid</title>
        <meta name="description" content="Encuentra nuestras barberías en Salamanca y Retiro. Dos ubicaciones estratégicas en Madrid con los mejores barberos profesionales." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <ClientNavigation onBookingClick={() => window.open('https://madmenbarberia.com/reserva', '_blank')} />
        
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <Link to="/">
              <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
          
          <LocationsSection />
        </div>
      </div>
    </>
  );
};

export default Ubicaciones;
