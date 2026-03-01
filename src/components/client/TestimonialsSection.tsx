const reviews = [
  {
    text: 'Te ofrecen refrescos, café además de un servicio perfecto. El trato es excepcional y el resultado siempre impecable.',
    name: 'Carlos M.',
  },
  {
    text: 'La mejor barbería tradicional de Madrid. Ambiente auténtico y profesionales de primera. Siempre salgo como nuevo.',
    name: 'Miguel R.',
  },
  {
    text: 'Llevo años viniendo y nunca me decepciona. El corte clásico que buscaba y un afeitado con navaja espectacular.',
    name: 'David L.',
  },
  {
    text: 'Profesionalidad y calidad en cada visita. El ambiente tradicional y la atención personalizada son únicos en Madrid.',
    name: 'Antonio G.',
  },
];

const TestimonialsSection = () => {
  return (
    <section
      className="py-44 md:py-64"
      style={{ background: '#1C1C1C' }}
    >
      <div className="max-w-2xl mx-auto px-6">
        {/* Separator */}
        <div
          className="w-10 h-px mx-auto mb-14"
          style={{ background: 'hsl(155 28% 17% / 0.5)' }}
        />

        {/* Label */}
        <p
          className="uppercase tracking-[0.35em] text-[11px] text-center mb-12 font-light"
          style={{ color: 'hsl(155 28% 17%)' }}
        >
          Reseñas reales
        </p>

        {/* Title */}
        <h2
          className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.1] text-center mb-24 md:mb-32 tracking-tight"
          style={{ color: '#F2F2F2' }}
        >
          Lo que dicen
          <br />
          <span className="italic font-light">nuestros clientes</span>
        </h2>

        {/* Reviews */}
        <div className="space-y-0">
          {reviews.map((review, index) => (
            <div key={index}>
              <div className="py-14 md:py-20 text-center">
                <p
                  className="font-serif text-lg md:text-xl italic font-light leading-relaxed tracking-wide mb-8"
                  style={{ color: '#F2F2F2' }}
                >
                  "{review.text}"
                </p>
                <p
                  className="text-xs uppercase tracking-[0.3em] font-light"
                  style={{ color: 'hsl(0 0% 45%)' }}
                >
                  — {review.name}
                </p>
              </div>
              {index < reviews.length - 1 && (
                <div
                  className="w-12 h-px mx-auto"
                  style={{ background: '#1E3D2F' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-24 md:mt-32">
          <p
            className="text-xs uppercase tracking-[0.3em] font-light mb-8"
            style={{ color: 'hsl(0 0% 45%)' }}
          >
            Más de 200 reseñas de 5 estrellas
          </p>
          <a
            href="https://www.google.com/search?q=MAD+MEN+Barber%C3%ADa+tradicional%E2%80%94Barrio+de+Salamanca&stick=H4sIAAAAAAAA_-NgU1I2qEgxMTKytDBPTTY0MTI1MrUyqDA0tDROSzRMM0lNtEyyNFzEauzr6KLg6-qn4JRYlJRadHhtokJJUWJKZnJmfl5izqOGKUDxosx8hZRUheDEnMTcxLzkRAC6FmK1XQAAAA&hl=es&mat=Ce-HllYFws1WElcBTVDHnvvi9opM4r55v2wNwWpFgmQk2IKkbclO-6rxGaAFYM1bEzggXF7guxN5hUUqYJxk40A4K88FjMTO2zvy3JgcKoW7muXldfi9LkDe6UoUL9H391U&authuser=0#mpd=~6254868785670817775/customers/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm tracking-[0.2em] uppercase font-light border-b pb-1 transition-colors duration-300"
            style={{
              color: '#F2F2F2',
              borderColor: '#1E3D2F',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#1E3D2F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#F2F2F2';
            }}
          >
            Ver todas en Google
          </a>
        </div>

        {/* Bottom separator */}
        <div
          className="w-10 h-px mx-auto mt-20"
          style={{ background: 'hsl(155 28% 17% / 0.5)' }}
        />
      </div>
    </section>
  );
};

export default TestimonialsSection;
