import beardDetailImg from '@/assets/barbershop-beard-detail.jpg';
import shaveDetailNew from '@/assets/barbershop-shave-detail-new.jpg';

const CinematicGallery = () => {
  return (
    <section className="bg-barbershop-dark">
      {/* Top separator */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px" style={{ background: 'hsl(0 0% 18%)' }} />
      </div>

      <div className="py-32 md:py-48">
        {/* Label */}
        <p
          className="uppercase tracking-[0.35em] text-[11px] mb-20 md:mb-28 font-light text-center"
          style={{ color: 'hsl(var(--barbershop-gold))' }}>

          El arte del detalle
        </p>

        {/* Asymmetric two-image layout */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
            {/* Large image — left */}
            <div className="md:col-span-7">
              <div className="relative overflow-hidden">
                <img
                  src={beardDetailImg}
                  alt="Detalle de arreglo de barba con cepillo y navaja — Mad Men Barbería"
                  className="w-full h-[500px] md:h-[700px] object-cover" />

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                    'linear-gradient(to top, hsl(0 0% 7% / 0.4) 0%, transparent 40%)'
                  }} />

              </div>
              <p
                className="mt-6 uppercase tracking-[0.3em] text-[10px] font-light"
                style={{ color: 'hsl(0 0% 40%)' }}>

                Precisión en cada trazo
              </p>
            </div>

            {/* Smaller image — right, offset up */}
            <div className="md:col-span-5 md:pb-16">
              <div className="relative overflow-hidden">
                <img
                  src={shaveDetailNew}
                  alt="Corte masculino en Mad Men Barbería"
                  className="w-full h-[500px] md:h-[700px] object-cover" />

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                    'linear-gradient(to top, hsl(0 0% 7% / 0.4) 0%, transparent 40%)'
                  }} />

              </div>
              <p
                className="mt-6 uppercase tracking-[0.3em] text-[10px] font-light"
                style={{ color: 'hsl(0 0% 40%)' }}>


              </p>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default CinematicGallery;