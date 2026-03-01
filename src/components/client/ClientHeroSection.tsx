
import { Calendar } from 'lucide-react';
import heroImage from '@/assets/hero-barbershop-bg.jpg';

interface ClientHeroSectionProps {
  onBookingClick: () => void;
}

const ClientHeroSection = ({ onBookingClick }: ClientHeroSectionProps) => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Barbería en Madrid - Mad Men Barbería Tradicional"
    >
      {/* Fullscreen Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Interior de Mad Men Barbería - ambiente premium y elegante"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p
          className="uppercase tracking-[0.4em] text-[11px] md:text-xs mb-10 font-light"
          style={{ color: 'hsl(var(--barbershop-gold))' }}
        >
          Barbería Tradicional en Madrid
        </p>

        <h1
          className="font-serif text-6xl md:text-8xl lg:text-9xl font-normal leading-[0.9] mb-8 tracking-tight"
          style={{ color: 'hsl(0 0% 96%)' }}
        >
          Mad Men
          <br />
          <span className="italic font-light text-[0.75em]">Barbería</span>
        </h1>

        <p
          className="text-sm md:text-base max-w-md mx-auto mb-16 leading-loose font-light tracking-wide"
          style={{ color: 'hsl(0 0% 60%)' }}
        >
          El arte de la barbería clásica perfeccionado
          <br className="hidden md:block" />
          con excelencia moderna.
        </p>

        {/* Minimal CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="https://booksy.com/es-es/instant-experiences/widget/108540"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 uppercase tracking-[0.25em] text-[11px] font-light transition-colors duration-500"
            style={{ color: 'hsl(0 0% 70%)' }}
          >
            <span
              className="w-8 h-px transition-all duration-500 group-hover:w-12"
              style={{ background: 'hsl(var(--barbershop-gold))' }}
            />
            Reservar Salamanca
          </a>
          <a
            href="https://booksy.com/es-es/instant-experiences/widget/160842"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 uppercase tracking-[0.25em] text-[11px] font-light transition-colors duration-500"
            style={{ color: 'hsl(0 0% 70%)' }}
          >
            <span
              className="w-8 h-px transition-all duration-500 group-hover:w-12"
              style={{ background: 'hsl(var(--barbershop-gold))' }}
            />
            Reservar Retiro
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black/50 to-transparent z-[5]" />
    </section>
  );
};

export default ClientHeroSection;
