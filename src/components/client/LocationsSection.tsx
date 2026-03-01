import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import locationSalamanca from '@/assets/location-salamanca-new.jpg';
import locationRetiro from '@/assets/location-retiro-new.png';

const locations = [
  {
    neighborhood: 'Salamanca',
    address: 'General Pardiñas 101',
    phone: '+34 910 597 766',
    hours: 'Lun–Vie 11:00–21:00 · Sáb 10:00–21:00',
    image: locationSalamanca,
    imagePosition: 'center -30px',
    bookingUrl: 'https://booksy.com/es-es/instant-experiences/widget/108540',
  },
  {
    neighborhood: 'Retiro',
    address: 'Alcalde Sainz de Baranda 53',
    phone: '+34 912 231 715',
    hours: 'Lun–Vie 11:00–21:00 · Sáb 10:00–21:00',
    image: locationRetiro,
    imagePosition: 'center center',
    bookingUrl: 'https://booksy.com/es-es/instant-experiences/widget/160842',
  },
];

const LocationsSection = () => {
  return (
    <section id="ubicaciones" className="bg-barbershop-dark py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <p
            className="uppercase tracking-[0.3em] text-xs mb-8"
            style={{ color: 'hsl(var(--barbershop-gold))' }}
          >
            Encuéntranos
          </p>
          <h2
            className="font-serif text-3xl md:text-5xl font-bold leading-tight"
            style={{ color: 'hsl(0 0% 95%)' }}
          >
            Dos sedes,
            <br />
            <span className="font-light italic">una misma excelencia</span>
          </h2>
        </div>

        {/* Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: 'hsl(0 0% 20%)' }}>
          {locations.map((loc, i) => (
            <div key={i} className="bg-barbershop-dark">
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={loc.image}
                  alt={`Mad Men Barbería ${loc.neighborhood}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  style={{ objectPosition: loc.imagePosition }}
                />
              </div>

              {/* Info */}
              <div className="p-10 md:p-14">
                <p
                  className="uppercase tracking-[0.25em] text-xs mb-4"
                  style={{ color: 'hsl(var(--barbershop-gold))' }}
                >
                  Barrio de {loc.neighborhood}
                </p>

                <h3
                  className="font-serif text-2xl md:text-3xl font-bold mb-6"
                  style={{ color: 'hsl(0 0% 92%)' }}
                >
                  {loc.address}
                </h3>

                <div className="space-y-2 mb-8">
                  <p className="text-sm" style={{ color: 'hsl(0 0% 55%)' }}>
                    {loc.hours}
                  </p>
                  <p className="text-sm" style={{ color: 'hsl(0 0% 55%)' }}>
                    Domingos cerrado
                  </p>
                  <a
                    href={`tel:${loc.phone}`}
                    className="text-sm block transition-colors duration-300"
                    style={{ color: 'hsl(0 0% 55%)' }}
                  >
                    {loc.phone}
                  </a>
                </div>

                <Button
                  size="lg"
                  className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90 font-semibold px-8 py-5 text-sm tracking-wide"
                  onClick={() => window.open(loc.bookingUrl, '_blank')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Reservar cita
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
