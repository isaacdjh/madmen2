import locationSalamanca from '@/assets/location-salamanca-new.jpg';
import locationRetiro from '@/assets/location-retiro-new.png';

const locations = [
  {
    neighborhood: 'Salamanca',
    address: 'General Pardiñas 101',
    phone: '+34 910 597 766',
    hours: 'Lun–Vie 11–21h · Sáb 10–21h',
    image: locationSalamanca,
    imagePosition: 'center -30px',
    bookingUrl: 'https://booksy.com/es-es/instant-experiences/widget/108540',
  },
  {
    neighborhood: 'Retiro',
    address: 'Alcalde Sainz de Baranda 53',
    phone: '+34 912 231 715',
    hours: 'Lun–Vie 11–21h · Sáb 10–21h',
    image: locationRetiro,
    imagePosition: 'center 40%',
    bookingUrl: 'https://booksy.com/es-es/instant-experiences/widget/160842',
  },
];

const LocationsSection = () => {
  return (
    <section id="ubicaciones" className="bg-barbershop-dark">
      {/* Thin separator */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px" style={{ background: 'hsl(0 0% 18%)' }} />
      </div>

      <div className="py-44 md:py-64">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-24 md:mb-32">
            <p
              className="uppercase tracking-[0.35em] text-[11px] mb-10 font-light"
              style={{ color: 'hsl(var(--barbershop-gold))' }}
            >
              Encuéntranos
            </p>
            <h2
              className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight"
              style={{ color: 'hsl(0 0% 93%)' }}
            >
              Dos sedes,
              <br />
              <span className="italic font-light">una misma excelencia</span>
            </h2>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12">
            {locations.map((loc, i) => (
              <div key={i}>
                {/* Image */}
                <div className="aspect-[3/2] overflow-hidden mb-10">
                  <img
                    src={loc.image}
                    alt={`Mad Men Barbería ${loc.neighborhood}`}
                    className="w-full h-full object-contain transition-transform duration-700 hover:scale-[1.03]"
                    style={{ objectPosition: loc.imagePosition }}
                  />
                </div>

                {/* Info */}
                <p
                  className="uppercase tracking-[0.3em] text-[11px] mb-3 font-light"
                  style={{ color: 'hsl(var(--barbershop-gold))' }}
                >
                  Barrio de {loc.neighborhood}
                </p>

                <h3
                  className="font-serif text-xl md:text-2xl font-normal tracking-tight mb-5"
                  style={{ color: 'hsl(0 0% 88%)' }}
                >
                  {loc.address}
                </h3>

                <div className="space-y-1.5 mb-8">
                  <p className="text-xs font-light tracking-wide" style={{ color: 'hsl(0 0% 45%)' }}>
                    {loc.hours} · Dom cerrado
                  </p>
                  <a
                    href={`tel:${loc.phone}`}
                    className="text-xs font-light tracking-wide block hover:text-barbershop-gold transition-colors duration-300"
                    style={{ color: 'hsl(0 0% 45%)' }}
                  >
                    {loc.phone}
                  </a>
                </div>

                <a
                  href={loc.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 uppercase tracking-[0.25em] text-[11px] font-light transition-colors duration-500"
                  style={{ color: 'hsl(0 0% 60%)' }}
                >
                  <span
                    className="w-6 h-px transition-all duration-500 group-hover:w-10"
                    style={{ background: 'hsl(var(--barbershop-gold))' }}
                  />
                  Reservar cita
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
