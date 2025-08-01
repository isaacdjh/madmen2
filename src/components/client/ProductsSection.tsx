
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { getAllProducts, type Product } from '@/lib/supabase-helpers';

// Import product images
import mattePasteImg from '@/assets/stmnt-matte-paste.jpg';
import hardWaxImg from '@/assets/stmnt-hard-wax.jpg';
import texturesprayImg from '@/assets/stmnt-texture-spray.jpg';
import beardOilImg from '@/assets/stmnt-beard-oil.jpg';
import stylingPasteImg from '@/assets/stmnt-styling-paste.jpg';

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getAllProducts();
      // Solo mostrar productos activos
      setProducts(data.filter((product: Product) => product.active));
    } catch (error) {
      console.error('Error al cargar productos:', error);
      // Productos por defecto en caso de error
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'pomada': return 'Pomadas STMNT';
      case 'cera': return 'Ceras STMNT';
      case 'pasta': return 'Pastas STMNT';
      case 'acabado': return 'Productos de Acabado STMNT';
      case 'cuidado': return 'Cuidado Capilar STMNT';
      case 'aceite': return 'Aceites STMNT';
      case 'otros': return 'Otros Productos STMNT';
      default: return 'Productos STMNT';
    }
  };

  const getProductImage = (category: string, name: string) => {
    const lowerName = name.toLowerCase();
    const lowerCategory = category.toLowerCase();
    
    if (lowerName.includes('matte') || lowerName.includes('mate')) {
      return mattePasteImg;
    }
    if (lowerCategory === 'cera' || lowerName.includes('wax') || lowerName.includes('cera')) {
      return hardWaxImg;
    }
    if (lowerName.includes('spray') || lowerName.includes('textura')) {
      return texturesprayImg;
    }
    if (lowerCategory === 'aceite' || lowerName.includes('aceite') || lowerName.includes('oil')) {
      return beardOilImg;
    }
    if (lowerCategory === 'pasta' || lowerName.includes('pasta')) {
      return stylingPasteImg;
    }
    
    // Default fallback based on category
    switch (lowerCategory) {
      case 'pomada': return mattePasteImg;
      case 'cera': return hardWaxImg;
      case 'pasta': return stylingPasteImg;
      case 'aceite': return beardOilImg;
      case 'acabado': return texturesprayImg;
      default: return stylingPasteImg;
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = getCategoryName(product.category);
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  if (isLoading) {
    return (
      <section id="productos" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-barbershop-gold mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando productos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="productos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Productos STMNT</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Productos premium STMNT para el cuidado masculino. Llévate a casa la experiencia Mad Men.
          </p>
        </div>
        
        {Object.keys(groupedProducts).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hay productos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
              <div key={categoryName}>
                <h3 className="text-2xl font-bold text-center mb-8 text-barbershop-dark">
                  {categoryName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
                          <img 
                            src={getProductImage(product.category, product.name)} 
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <CardTitle className="text-center text-lg">{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-muted-foreground mb-4 text-sm">{product.description}</p>
                        <Badge variant="secondary" className="gold-accent font-bold text-lg">
                          €{product.price}
                        </Badge>
                        {product.stock <= 5 && product.stock > 0 && (
                          <p className="text-orange-600 text-xs mt-2">¡Pocas unidades disponibles!</p>
                        )}
                        {product.stock === 0 && (
                          <p className="text-red-600 text-xs mt-2">Agotado</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

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
