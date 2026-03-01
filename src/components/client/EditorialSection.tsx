import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

interface EditorialSectionProps {
  onBookingClick?: () => void;
}

const EditorialSection = ({ onBookingClick }: EditorialSectionProps) => {
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
          className="text-sm md:text-base leading-[2] font-light tracking-wide mb-14"
          style={{ color: 'hsl(0 0% 55%)' }}
        >
          Dos sedes en los mejores barrios de Madrid — Salamanca y Retiro —
          diseñadas para quienes valoran la calidad y el cuidado personal
          como un ritual. Disfruta de bebidas de cortesía y café molido
          de la mejor calidad mientras te atendemos.
        </p>

        {onBookingClick && (
          <Button
            onClick={onBookingClick}
            size="lg"
            className="bg-transparent border border-[hsl(var(--barbershop-gold)/0.6)] text-[hsl(var(--barbershop-gold))] hover:bg-[hsl(var(--barbershop-gold)/0.1)] tracking-[0.2em] uppercase text-xs px-10 py-6 rounded-none transition-all duration-300"
          >
            <CalendarDays className="w-4 h-4 mr-3" />
            Reservar Cita
          </Button>
        )}

        <div
          className="w-10 h-px mx-auto mt-16"
          style={{ background: 'hsl(var(--barbershop-gold) / 0.5)' }}
        />
      </div>
    </section>
  );
};

export default EditorialSection;
