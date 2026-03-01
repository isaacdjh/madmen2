const EditorialSection = () => {
  return (
    <section className="bg-barbershop-dark py-44 md:py-64">
      <div className="max-w-xl mx-auto px-6 text-center">
        <div
          className="w-10 h-px mx-auto mb-14"
          style={{ background: 'hsl(var(--barbershop-gold) / 0.5)' }}
        />

        <p
          className="uppercase tracking-[0.35em] text-[11px] mb-12 font-light"
          style={{ color: 'hsl(var(--barbershop-gold))' }}
        >
          Nuestra filosofía
        </p>

        <h2
          className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.1] mb-14 tracking-tight"
          style={{ color: 'hsl(0 0% 93%)' }}
        >
          Tradición, precisión
          <br />
          <span className="italic font-light">y excelencia</span>
        </h2>

        <p
          className="text-sm md:text-base leading-[2] font-light mb-10 tracking-wide"
          style={{ color: 'hsl(0 0% 55%)' }}
        >
          En Mad Men cada detalle importa. Fusionamos las técnicas clásicas de
          barbería con un servicio moderno y personalizado, creando una
          experiencia que va más allá del corte.
        </p>

        <p
          className="text-sm md:text-base leading-[2] font-light tracking-wide"
          style={{ color: 'hsl(0 0% 55%)' }}
        >
          Dos sedes en los mejores barrios de Madrid — Salamanca y Retiro —
          diseñadas para quienes valoran la calidad y el cuidado personal
          como un ritual. Disfruta de bebidas de cortesía y café molido
          de la mejor calidad mientras te atendemos.
        </p>

        {/* Booking CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16">
          <a
            href="https://booksy.com/es-es/instant-experiences/widget/108540"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 uppercase tracking-[0.25em] text-[11px] font-light transition-colors duration-500"
            style={{ color: 'hsl(0 0% 60%)' }}
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
            style={{ color: 'hsl(0 0% 60%)' }}
          >
            <span
              className="w-8 h-px transition-all duration-500 group-hover:w-12"
              style={{ background: 'hsl(var(--barbershop-gold))' }}
            />
            Reservar Retiro
          </a>
        </div>

        <div
          className="w-10 h-px mx-auto mt-16"
          style={{ background: 'hsl(var(--barbershop-gold) / 0.5)' }}
        />
      </div>
    </section>
  );
};

export default EditorialSection;
