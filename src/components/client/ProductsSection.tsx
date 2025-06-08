
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

const ProductsSection = () => {
  const products = [
    {
      category: 'Pomadas STMNT',
      items: [
        { name: 'Classic Pomade', price: '23€', description: 'Pomada clásica para estilos tradicionales' },
        { name: 'Fiber Pomade', price: '23€', description: 'Pomada con fibra para mayor textura' }
      ]
    },
    {
      category: 'Ceras y Pastas STMNT',
      items: [
        { name: 'Cera en Polvo', price: '23€', description: 'Volumen y textura instantánea' },
        { name: 'Matte Paste', price: '23€', description: 'Acabado mate con fijación fuerte' },
        { name: 'Shine Paste', price: '23€', description: 'Brillo natural con control' },
        { name: 'Dry Clay', price: '23€', description: 'Arcilla seca para acabado mate' }
      ]
    },
    {
      category: 'Productos de Acabado STMNT',
      items: [
        { name: 'Laca Hair Spray', price: '19,60€', description: 'Fijación duradera en spray' },
        { name: 'Spray de Peinado', price: '23€', description: 'Para peinar y fijar el cabello' },
        { name: 'Polvo en Spray', price: '23€', description: 'Volumen y textura en spray' }
      ]
    },
    {
      category: 'Cuidado Capilar STMNT',
      items: [
        { name: 'Champú', price: '18,90€', description: 'Limpieza profunda diaria' },
        { name: 'Champú Todo-en-1', price: '18,90€', description: 'Champú y acondicionador' },
        { name: 'Acondicionador', price: '18,90€', description: 'Hidratación y suavidad' },
        { name: 'Champú Hydro', price: '18,90€', description: 'Hidratación intensiva' }
      ]
    },
    {
      category: 'Otros Productos STMNT',
      items: [
        { name: 'Aceite de Barba', price: '23€', description: 'Cuidado y brillo para la barba' },
        { name: 'Champú Sólido', price: '12,50€', description: 'Champú ecológico en barra' },
        { name: 'Spray de Definición', price: '22,80€', description: 'Define y controla el peinado' },
        { name: 'Gel', price: '19,60€', description: 'Fijación fuerte con brillo' },
        { name: 'Crema de Rizos', price: '19,60€', description: 'Define y controla los rizos' },
        { name: 'Serum', price: '18,90€', description: 'Tratamiento intensivo capilar' }
      ]
    }
  ];

  return (
    <section id="productos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Productos STMNT</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Productos premium STMNT para el cuidado masculino. Llévate a casa la experiencia Mad Men.
          </p>
        </div>
        
        <div className="space-y-12">
          {products.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-2xl font-bold text-center mb-8 text-barbershop-dark">
                {category.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((product, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 bg-barbershop-gold/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Package className="w-8 h-8 text-barbershop-gold" />
                      </div>
                      <CardTitle className="text-center text-lg">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground mb-4 text-sm">{product.description}</p>
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
            Todos nuestros productos STMNT están disponibles en ambas ubicaciones. 
            Pregunta a tu barbero por recomendaciones personalizadas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
