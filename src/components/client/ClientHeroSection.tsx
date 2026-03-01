
import { Button } from '@/components/ui/button';
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
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Eyebrow */}
        <p
          className="uppercase tracking-[0.35em] text-xs md:text-sm mb-8"
          style={{ color: 'hsl(var(--barbershop-gold))' }}
        >
          Barbería Tradicional en Madrid
        </p>

        {/* SEO H1 - visible */}
        <h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
          style={{ color: 'hsl(0 0% 98%)' }}
        >
          Mad Men
          <br />
          <span className="font-light italic">Barbería</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ color: 'hsl(0 0% 75%)' }}
        >
          El arte de la barbería clásica perfeccionado con excelencia moderna.
          Una experiencia única en Salamanca y Retiro.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold px-10 py-6 text-base tracking-wide"
            onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/108540', '_blank')}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Reservar en Salamanca
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-barbershop-gold/40 text-white hover:bg-barbershop-gold/10 hover:border-barbershop-gold px-10 py-6 text-base tracking-wide"
            onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/160842', '_blank')}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Reservar en Retiro
          </Button>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/40 to-transparent z-[5]" />
    </section>
  );
};

export default ClientHeroSection;