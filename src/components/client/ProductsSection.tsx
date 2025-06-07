
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bottle2, Coffee, Gift } from 'lucide-react';

const ProductsSection = () => {
  const products = [
    {
      category: 'Productos para el Cabello',
      items: [
        { name: 'Pomada Tradicional', price: '$85', description: 'Fijación fuerte, acabado natural' },
        { name: 'Cera Mate', price: '$90', description: 'Control total, acabado mate' },
        { name: 'Aceite para Barba', price: '$75', description: 'Hidratación y brillo natural' }
      ]
    },
    {
      category: 'Productos para Afeitado',
      items: [
        { name: 'Crema de Afeitar', price: '$65', description: 'Protección y suavidad' },
        { name: 'Bálsamo Post-Afeitado', price: '$70', description: 'Calma e hidrata la piel' },
        { name: 'Jabón de Afeitar', price: '$55', description: 'Espuma rica y cremosa' }
      ]
    }
  ];

  return (
    <section id="productos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Productos de Calidad</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Productos premium para el cuidado masculino. Llévate a casa la experiencia Mad Men.
          </p>
        </div>

        {/* Bebida de Cortesía */}
        <div className="bg-barbershop-gold/10 border border-barbershop-gold/20 rounded-lg p-8 mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Coffee className="w-12 h-12 text-barbershop-gold mr-4" />
            <Gift className="w-12 h-12 text-barbershop-gold" />
          </div>
          <h3 className="text-2xl font-bold text-barbershop-dark mb-2">Bebida de Cortesía</h3>
          <p className="text-muted-foreground">
            Con cada servicio, disfruta de una bebida de cortesía: café premium, agua, refrescos o cerveza. 
            Porque en Mad Men, tu comodidad es nuestra prioridad.
          </p>
        </div>
        
        <div className="space-y-12">
          {products.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-2xl font-bold text-center mb-8 text-barbershop-dark">
                {category.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.items.map((product, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 bg-barbershop-gold/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Bottle2 className="w-8 h-8 text-barbershop-gold" />
                      </div>
                      <CardTitle className="text-center">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground mb-4">{product.description}</p>
                      <Badge variant="secondary" className="gold-accent font-bold text-lg">
                        {product.price}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Todos nuestros productos están disponibles en ambas ubicaciones. 
            Pregunta a tu barbero por recomendaciones personalizadas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
