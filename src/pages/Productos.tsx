
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Sparkles, Droplets, Wind } from 'lucide-react';
import ClientNavigation from '@/components/client/ClientNavigation';

// Imágenes de productos STMNT
import stmntMattePaste from '@/assets/stmnt-matte-paste.jpg';
import stmntHardWax from '@/assets/stmnt-hard-wax.jpg';
import stmntStylingPaste from '@/assets/stmnt-styling-paste.jpg';
import stmntTextureSpray from '@/assets/stmnt-texture-spray.jpg';
import stmntBeardOil from '@/assets/stmnt-beard-oil.jpg';

interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  featured?: boolean;
}

const products: Product[] = [
  // Pomadas
  { name: 'Classic Pomade', description: 'Pomada clásica para estilos tradicionales con brillo natural', price: 23, category: 'Pomadas' },
  { name: 'Fiber Pomade', description: 'Pomada con fibra para mayor textura y control', price: 23, category: 'Pomadas' },
  
  // Ceras y Pastas
  { name: 'Matte Paste', description: 'Acabado mate con fijación fuerte para estilos modernos', price: 23, category: 'Ceras y Pastas', image: stmntMattePaste, featured: true },
  { name: 'Shine Paste', description: 'Brillo natural con control flexible', price: 23, category: 'Ceras y Pastas', image: stmntStylingPaste },
  { name: 'Dry Clay', description: 'Arcilla seca para acabado mate y textura natural', price: 23, category: 'Ceras y Pastas' },
  { name: 'Cera en Polvo', description: 'Volumen y textura instantánea sin residuos', price: 23, category: 'Ceras y Pastas', image: stmntHardWax, featured: true },
  
  // Productos de Acabado
  { name: 'Laca Hair Spray', description: 'Fijación duradera en spray para todo el día', price: 19.60, category: 'Acabado' },
  { name: 'Spray de Peinado', description: 'Para peinar y fijar el cabello con facilidad', price: 23, category: 'Acabado' },
  { name: 'Polvo en Spray', description: 'Volumen y textura en spray ligero', price: 23, category: 'Acabado', image: stmntTextureSpray, featured: true },
  { name: 'Spray de Definición', description: 'Define y controla el peinado con precisión', price: 22.80, category: 'Acabado' },
  
  // Cuidado Capilar
  { name: 'Champú', description: 'Limpieza profunda diaria para todo tipo de cabello', price: 18.90, category: 'Cuidado Capilar' },
  { name: 'Champú Todo-en-1', description: 'Champú y acondicionador en un solo producto', price: 18.90, category: 'Cuidado Capilar' },
  { name: 'Acondicionador', description: 'Hidratación y suavidad para un cabello sano', price: 18.90, category: 'Cuidado Capilar' },
  { name: 'Champú Hydro', description: 'Hidratación intensiva para cabello seco', price: 18.90, category: 'Cuidado Capilar' },
  { name: 'Serum', description: 'Tratamiento intensivo para nutrición capilar', price: 18.90, category: 'Cuidado Capilar' },
  
  // Barba y Otros
  { name: 'Aceite de Barba', description: 'Cuidado y brillo para una barba impecable', price: 23, category: 'Barba', image: stmntBeardOil, featured: true },
  { name: 'Champú Sólido', description: 'Champú ecológico en barra, ideal para viajes', price: 12.50, category: 'Otros' },
  { name: 'Gel', description: 'Fijación fuerte con brillo para estilos clásicos', price: 19.60, category: 'Otros' },
  { name: 'Crema de Rizos', description: 'Define y controla los rizos naturales', price: 19.60, category: 'Otros' },
];

const categories = ['Pomadas', 'Ceras y Pastas', 'Acabado', 'Cuidado Capilar', 'Barba', 'Otros'];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Pomadas':
    case 'Ceras y Pastas':
      return <Sparkles className="w-5 h-5" />;
    case 'Acabado':
      return <Wind className="w-5 h-5" />;
    case 'Cuidado Capilar':
    case 'Barba':
      return <Droplets className="w-5 h-5" />;
    default:
      return <ShoppingBag className="w-5 h-5" />;
  }
};

const Productos = () => {
  const featuredProducts = products.filter(p => p.featured);

  return (
    <>
      <Helmet>
        <title>Productos STMNT - Mad Men Barbería Madrid</title>
        <meta name="description" content="Descubre la línea de productos profesionales STMNT disponibles en Mad Men Barbería. Pomadas, ceras, sprays y productos de cuidado capilar premium." />
      </Helmet>
      
      <ClientNavigation onBookingClick={() => {}} />
      
      <div className="min-h-screen bg-barbershop-dark pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-barbershop-gold/20 text-barbershop-gold border-barbershop-gold/30 mb-4">
              Productos Profesionales
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Línea <span className="text-barbershop-gold">STMNT</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Productos de barbería profesional para mantener tu estilo en casa. 
              Disponibles en nuestras barberías de Salamanca y Retiro.
            </p>
          </div>

          {/* Featured Products */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-barbershop-gold" />
              Productos Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <Card key={index} className="bg-barbershop-navy/50 border-barbershop-gold/20 overflow-hidden group hover:border-barbershop-gold/50 transition-all duration-300">
                  {product.image && (
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <Badge className="bg-barbershop-gold/20 text-barbershop-gold border-barbershop-gold/30 text-xs mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="text-white font-semibold mb-1">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{product.description}</p>
                    <p className="text-barbershop-gold font-bold text-lg">{product.price.toFixed(2)}€</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Products by Category */}
          {categories.map((category) => {
            const categoryProducts = products.filter(p => p.category === category);
            if (categoryProducts.length === 0) return null;
            
            return (
              <div key={category} className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryProducts.map((product, index) => (
                    <Card key={index} className="bg-barbershop-navy/30 border-white/10 hover:border-barbershop-gold/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-medium">{product.name}</h3>
                          <span className="text-barbershop-gold font-semibold">{product.price.toFixed(2)}€</span>
                        </div>
                        <p className="text-gray-400 text-sm">{product.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {/* CTA */}
          <div className="text-center mt-12 p-8 bg-barbershop-navy/50 rounded-2xl border border-barbershop-gold/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Interesado en algún producto?
            </h3>
            <p className="text-gray-400 mb-6">
              Visítanos en cualquiera de nuestras barberías para conocer toda la gama STMNT 
              y recibir asesoramiento personalizado de nuestros barberos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/108540', '_blank')}
                className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
              >
                Reservar en Salamanca
              </Button>
              <Button 
                onClick={() => window.open('https://booksy.com/es-es/instant-experiences/widget/160842', '_blank')}
                className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
              >
                Reservar en Retiro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Productos;
