const EditorialSection = () => {
  return (
    <section className="bg-barbershop-dark py-28 md:py-40">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Decorative line */}
        <div
          className="w-12 h-px mx-auto mb-10"
          style={{ background: 'hsl(var(--barbershop-gold))' }}
        />

        <p
          className="uppercase tracking-[0.3em] text-xs mb-10"
          style={{ color: 'hsl(var(--barbershop-gold))' }}
        >
          Nuestra filosofía
        </p>

        <h2
          className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-10"
          style={{ color: 'hsl(0 0% 95%)' }}
        >
          Tradición, precisión
          <br />
          <span className="font-light italic">y excelencia</span>
        </h2>

        <p
          className="text-base md:text-lg leading-relaxed mb-8"
          style={{ color: 'hsl(0 0% 65%)' }}
        >
          En Mad Men cada detalle importa. Fusionamos las técnicas clásicas de
          barbería con un servicio moderno y personalizado, creando una
          experiencia que va más allá del corte. Aquí, el tiempo se detiene para
          que cada cliente reciba la atención que merece.
        </p>

        <p
          className="text-base md:text-lg leading-relaxed"
          style={{ color: 'hsl(0 0% 65%)' }}
        >
          Dos sedes en los mejores barrios de Madrid — Salamanca y Retiro —
          diseñadas para quienes valoran la calidad, el estilo y el cuidado
          personal como un ritual.
        </p>

        {/* Decorative line */}
        <div
          className="w-12 h-px mx-auto mt-14"
          style={{ background: 'hsl(var(--barbershop-gold))' }}
        />
      </div>
    </section>
  );
};

export default EditorialSection;
