import fadeProfesionalImg from '@/assets/fade-profesional.jpg';
import corteMasculinoImg from '@/assets/corte-masculino.jpg';

const services = [
  {
    name: 'Corte Masculino',
    description:
      'Técnica depurada y atención al detalle para un corte que define tu estilo.',
    image: corteMasculinoImg,
  },
  {
    name: 'Fade Profesional',
    description:
      'Degradados impecables ejecutados con precisión milimétrica.',
    image: fadeProfesionalImg,
  },
  {
    name: 'Arreglo de Barba',
    description:
      'Perfilado, recorte y cuidado profesional para una barba con carácter.',
  },
  {
    name: 'Ritual Clásico',
    description:
      'Corte, barba, toalla caliente y acabado premium. Un lujo atemporal.',
  },
];

const ServicesEditorialSection = () => {
  return (
    <section className="bg-barbershop-dark">
      {/* Thin separator */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px" style={{ background: 'hsl(0 0% 18%)' }} />
      </div>

      <div className="py-44 md:py-64">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-24 md:mb-32">
            <p
              className="uppercase tracking-[0.35em] text-[11px] mb-10 font-light"
              style={{ color: 'hsl(var(--barbershop-gold))' }}
            >
              Nuestros servicios
            </p>
            <h2
              className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight"
              style={{ color: 'hsl(0 0% 93%)' }}
            >
              Lo que hacemos
              <br />
              <span className="italic font-light">mejor</span>
            </h2>
          </div>

          {/* Services List — vertical, editorial */}
          <div className="space-y-0">
            {services.map((service, index) => (
              <div key={index}>
                {service.image ? (
                  <div
                    className="relative border-t overflow-hidden"
                    style={{ borderColor: 'hsl(0 0% 18%)' }}
                  >
                    {/* Background image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-15"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, hsl(0 0% 7% / 0.85), hsl(0 0% 7% / 0.5))' }} />
                    {/* Content */}
                    <div className="relative py-28 md:py-40 px-2">
                      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 md:gap-12">
                        <div className="flex items-baseline gap-6">
                          <span
                            className="font-serif text-xs tracking-widest font-light"
                            style={{ color: 'hsl(var(--barbershop-gold) / 0.4)' }}
                          >
                            0{index + 1}
                          </span>
                          <h3
                            className="font-serif text-2xl md:text-3xl font-normal tracking-tight"
                            style={{ color: 'hsl(0 0% 93%)' }}
                          >
                            {service.name}
                          </h3>
                        </div>
                        <p
                          className="text-sm font-light leading-relaxed max-w-xs md:text-right tracking-wide"
                          style={{ color: 'hsl(0 0% 60%)' }}
                        >
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="group py-14 md:py-20 border-t transition-colors duration-500"
                    style={{ borderColor: 'hsl(0 0% 18%)' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 md:gap-12">
                      <div className="flex items-baseline gap-6">
                        <span
                          className="font-serif text-xs tracking-widest font-light"
                          style={{ color: 'hsl(var(--barbershop-gold) / 0.4)' }}
                        >
                          0{index + 1}
                        </span>
                        <h3
                          className="font-serif text-2xl md:text-3xl font-normal tracking-tight transition-colors duration-500 group-hover:text-barbershop-gold"
                          style={{ color: 'hsl(0 0% 88%)' }}
                        >
                          {service.name}
                        </h3>
                      </div>
                      <p
                        className="text-sm font-light leading-relaxed max-w-xs md:text-right tracking-wide"
                        style={{ color: 'hsl(0 0% 45%)' }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Bottom border */}
            <div className="h-px" style={{ background: 'hsl(0 0% 18%)' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesEditorialSection;
