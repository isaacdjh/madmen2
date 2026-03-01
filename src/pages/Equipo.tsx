import { Helmet } from 'react-helmet-async';
import ClientNavigation from '@/components/client/ClientNavigation';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Equipo = () => {
  const barbers = [
    {
      name: 'Isaac Hernández',
      location: 'Salamanca',
      specialty: 'Cortes Clásicos',
      experience: '8 años',
      image: '/lovable-uploads/isaac-barber.jpg',
    },
    {
      name: 'Carlos López',
      location: 'Salamanca',
      specialty: 'Degradados',
      experience: '6 años',
      image: '/lovable-uploads/carlos-barber.jpg',
    },
    {
      name: 'Luis Urbiñez',
      location: 'Salamanca',
      specialty: 'Afeitado Tradicional',
      experience: '10 años',
      image: '/lovable-uploads/luis-barber.jpg',
    },
    {
      name: 'Randy Valdespino',
      location: 'Salamanca',
      specialty: 'Cortes Modernos',
      experience: '5 años',
      image: '/lovable-uploads/randy-barber.jpg',
    },
    {
      name: 'Jorge',
      location: 'Retiro',
      specialty: 'Barbería Integral',
      experience: '7 años',
      image: '/lovable-uploads/jorge-barber.jpg',
    },
    {
      name: 'Rudy',
      location: 'Retiro',
      specialty: 'Tratamientos de Barba',
      experience: '6 años',
      image: '/lovable-uploads/rudy-barber.jpg',
    },
  ];

  const salamanca = barbers.filter(b => b.location === 'Salamanca');
  const retiro = barbers.filter(b => b.location === 'Retiro');

  return (
    <>
      <Helmet>
        <title>Nuestro Equipo | Mad Men Barbería Tradicional Madrid</title>
        <meta name="description" content="Conoce a nuestros barberos profesionales. Expertos con años de experiencia en cortes clásicos, degradados y afeitado tradicional." />
      </Helmet>
      
      <div className="min-h-screen" style={{ background: '#1C1C1C' }}>
        <ClientNavigation onBookingClick={() => window.open('https://madmenbarberia.com/reserva', '_blank')} />
        
        <div className="pt-24 pb-32">
          {/* Back link */}
          <div className="max-w-6xl mx-auto px-6 mb-20">
            <Link
              to="/"
              className="inline-flex items-center gap-2 uppercase tracking-[0.25em] text-[11px] font-light transition-colors"
              style={{ color: 'hsl(0 0% 45%)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'hsl(0 0% 70%)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'hsl(0 0% 45%)')}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver
            </Link>
          </div>

          {/* Header */}
          <div className="max-w-6xl mx-auto px-6 mb-28">
            <p
              className="uppercase tracking-[0.35em] text-[11px] font-light mb-6"
              style={{ color: 'hsl(var(--barbershop-gold))' }}
            >
              Nuestro equipo
            </p>
            <h1
              className="text-4xl md:text-5xl font-light tracking-tight leading-tight max-w-xl"
              style={{ color: 'hsl(0 0% 90%)' }}
            >
              Profesionales con estilo propio
            </h1>
          </div>

          {/* Salamanca */}
          <div className="max-w-6xl mx-auto px-6 mb-32">
            <p
              className="uppercase tracking-[0.3em] text-[10px] font-light mb-12"
              style={{ color: 'hsl(0 0% 40%)' }}
            >
              Mad Men Salamanca
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {salamanca.map((barber, i) => (
                <BarberCard key={i} barber={barber} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="max-w-6xl mx-auto px-6">
            <div className="h-px mb-32" style={{ background: 'hsl(0 0% 18%)' }} />
          </div>

          {/* Retiro */}
          <div className="max-w-6xl mx-auto px-6 mb-32">
            <p
              className="uppercase tracking-[0.3em] text-[10px] font-light mb-12"
              style={{ color: 'hsl(0 0% 40%)' }}
            >
              Mad Men Retiro
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-2xl lg:max-w-none">
              {retiro.map((barber, i) => (
                <BarberCard key={i} barber={barber} />
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="max-w-6xl mx-auto px-6">
            <div className="h-px mb-20" style={{ background: 'hsl(0 0% 18%)' }} />
            <div className="text-center">
              <p
                className="text-sm font-light mb-6"
                style={{ color: 'hsl(0 0% 40%)' }}
              >
                ¿Quieres formar parte de nuestro equipo?
              </p>
              <a
                href="mailto:madmenmadrid@outlook.es?subject=Solicitud de empleo - Mad Men Barbería"
                className="inline-block uppercase tracking-[0.25em] text-[11px] font-light pb-1 border-b transition-colors"
                style={{
                  color: 'hsl(0 0% 55%)',
                  borderColor: 'hsl(0 0% 25%)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'hsl(var(--barbershop-gold))';
                  e.currentTarget.style.borderColor = 'hsl(var(--barbershop-gold))';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'hsl(0 0% 55%)';
                  e.currentTarget.style.borderColor = 'hsl(0 0% 25%)';
                }}
              >
                Trabaja con Nosotros
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const BarberCard = ({ barber }: { barber: { name: string; specialty: string; experience: string; image: string | null } }) => {
  return (
    <div className="group">
      {/* Photo */}
      <div className="relative overflow-hidden mb-5 aspect-[3/4]" style={{ background: '#222' }}>
        {barber.image ? (
          <img
            src={barber.image}
            alt={barber.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-light" style={{ color: 'hsl(0 0% 30%)' }}>
              {barber.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, hsl(0 0% 7% / 0.5) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Info */}
      <h3
        className="text-sm font-normal tracking-wide mb-1"
        style={{ color: 'hsl(0 0% 85%)' }}
      >
        {barber.name}
      </h3>
      <p
        className="text-[11px] uppercase tracking-[0.2em] font-light"
        style={{ color: 'hsl(0 0% 40%)' }}
      >
        {barber.specialty} · {barber.experience}
      </p>
    </div>
  );
};

export default Equipo;
