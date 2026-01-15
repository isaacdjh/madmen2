
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import testimonialCarlos from '@/assets/testimonial-carlos.jpg';
import testimonialMiguel from '@/assets/testimonial-miguel.jpg';
import testimonialDavid from '@/assets/testimonial-david.jpg';
import testimonialAntonio from '@/assets/testimonial-antonio.jpg';
import testimonialRoberto from '@/assets/testimonial-roberto.jpg';

const TestimonialsSection = () => {
  const testimonials = [
    { 
      name: 'Carlos M.', 
      rating: 5, 
      text: 'Te ofrecen refrescos, café además de un servicio perfecto. El trato es excepcional y el resultado siempre impecable.',
      image: testimonialCarlos
    },
    { 
      name: 'Miguel R.', 
      rating: 5, 
      text: 'La mejor barbería tradicional de Madrid. Ambiente auténtico y profesionales de primera. Siempre salgo como nuevo.',
      image: testimonialMiguel
    },
    { 
      name: 'David L.', 
      rating: 5, 
      text: 'Llevo años viniendo y nunca me decepciona. El corte clásico que buscaba y un afeitado con navaja espectacular.',
      image: testimonialDavid
    },
    { 
      name: 'Antonio G.', 
      rating: 5, 
      text: 'Profesionalidad y calidad en cada visita. El ambiente tradicional y la atención personalizada son únicos.',
      image: testimonialAntonio
    },
    { 
      name: 'Roberto F.', 
      rating: 5, 
      text: 'Barbería de toda la vida con técnicas modernas. Los mejores en Cristóbal Bordiú, sin duda recomendable 100%.',
      image: testimonialRoberto
    },
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-xl text-muted-foreground">Testimonios reales de clientes satisfechos</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={testimonial.image} 
                  alt={`Cliente ${testimonial.name}`}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <p className="font-semibold">- {testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
