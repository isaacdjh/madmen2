
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    { name: 'Juan Carlos', rating: 5, text: 'Excelente servicio, siempre salgo satisfecho. Carlos es un artista.' },
    { name: 'Roberto Silva', rating: 5, text: 'La mejor barbería de la ciudad. Ambiente tradicional y profesional.' },
    { name: 'Diego Morales', rating: 5, text: 'Miguel hace el mejor afeitado con navaja que he experimentado.' },
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
            <Card key={index}>
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
