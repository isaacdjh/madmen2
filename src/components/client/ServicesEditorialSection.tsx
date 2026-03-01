const services = [
  {
    name: 'Corte Masculino',
    description:
      'Técnica depurada y atención al detalle para un corte que define tu estilo personal.',
  },
  {
    name: 'Fade Profesional',
    description:
      'Degradados impecables ejecutados con precisión milimétrica. El sello de un barbero experto.',
  },
  {
    name: 'Arreglo de Barba',
    description:
      'Perfilado, recorte y cuidado profesional para una barba definida con carácter.',
  },
  {
    name: 'Ritual Clásico',
    description:
      'La experiencia completa: corte, barba, toalla caliente y acabado premium. Un lujo atemporal.',
  },
];

const ServicesEditorialSection = () => {
  return (
    <section className="bg-barbershop-dark py-28 md:py-40">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <p
            className="uppercase tracking-[0.3em] text-xs mb-8"
            style={{ color: 'hsl(var(--barbershop-gold))' }}
          >
            Nuestros servicios
          </p>
          <h2
            className="font-serif text-3xl md:text-5xl font-bold leading-tight"
            style={{ color: 'hsl(0 0% 95%)' }}
          >
            Lo que hacemos
            <br />
            <span className="font-light italic">mejor</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: 'hsl(0 0% 20%)' }}>
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-barbershop-dark p-10 md:p-16 group transition-colors duration-500 hover:bg-barbershop-navy"
            >
              <span
                className="font-serif text-sm tracking-widest mb-6 block"
                style={{ color: 'hsl(var(--barbershop-gold) / 0.6)' }}
              >
                0{index + 1}
              </span>
              <h3
                className="font-serif text-2xl md:text-3xl font-bold mb-5 transition-colors duration-500"
                style={{ color: 'hsl(0 0% 92%)' }}
              >
                {service.name}
              </h3>
              <p
                className="text-sm md:text-base leading-relaxed max-w-sm"
                style={{ color: 'hsl(0 0% 55%)' }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesEditorialSection;
