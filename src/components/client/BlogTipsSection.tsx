import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scissors, Clock, Sparkles, Heart, Calendar, Star } from 'lucide-react';

const BlogTipsSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: '¿Cada Cuánto Cortarse el Pelo? La Guía Definitiva',
      excerpt: 'Descubre la frecuencia ideal para mantener tu corte perfecto según tu tipo de cabello y estilo de vida.',
      content: `
        <h3>Frecuencia Recomendada por Tipo de Corte</h3>
        <ul>
          <li><strong>Corte Clásico/Tradicional:</strong> Cada 4-6 semanas</li>
          <li><strong>Fade/Degradado:</strong> Cada 2-3 semanas</li>
          <li><strong>Cabello Largo:</strong> Cada 6-8 semanas</li>
          <li><strong>Barba:</strong> Cada 2-3 semanas para mantener forma</li>
        </ul>
        
        <h3>Factores que Influyen</h3>
        <p>• <strong>Velocidad de crecimiento:</strong> Varía entre 1-1.5 cm por mes</p>
        <p>• <strong>Tipo de cabello:</strong> Rizado crece más lento visualmente</p>
        <p>• <strong>Estilo profesional:</strong> Requiere mayor frecuencia</p>
        <p>• <strong>Temporada:</strong> En verano crece más rápido</p>
      `,
      category: 'Cuidado Capilar',
      readTime: '5 min',
      icon: Scissors,
      featured: true
    },
    {
      id: 2,
      title: 'Higiene y Cuidado Personal Masculino',
      excerpt: 'Rutinas esenciales para mantener una imagen impecable todos los días.',
      content: `
        <h3>Rutina Diaria de Cuidado</h3>
        <ul>
          <li><strong>Mañana:</strong> Lavado facial, hidratación, peinado</li>
          <li><strong>Noche:</strong> Limpieza profunda, cuidado de barba</li>
        </ul>
        
        <h3>Frecuencia de Cuidados</h3>
        <p>• <strong>Lavado de cabello:</strong> 2-3 veces por semana</p>
        <p>• <strong>Exfoliación facial:</strong> 1-2 veces por semana</p>
        <p>• <strong>Recorte de barba:</strong> Cada 2-3 días</p>
        <p>• <strong>Hidratación:</strong> Diariamente</p>
        
        <h3>Productos Esenciales</h3>
        <p>Un buen champú, acondicionador, crema hidratante y aceite para barba son la base de cualquier rutina masculina exitosa.</p>
      `,
      category: 'Higiene',
      readTime: '4 min',
      icon: Sparkles,
      featured: false
    },
    {
      id: 3,
      title: 'Cómo Lucir Estupendo Siempre',
      excerpt: 'Secretos profesionales para mantener un estilo impecable entre visitas a la barbería.',
      content: `
        <h3>Consejos de Estilo</h3>
        <ul>
          <li><strong>Invierte en productos de calidad:</strong> Menos es más</li>
          <li><strong>Conoce tu tipo de rostro:</strong> Elige el corte adecuado</li>
          <li><strong>Mantén las líneas definidas:</strong> Especialmente en patillas y nuca</li>
        </ul>
        
        <h3>Mantenimiento Entre Cortes</h3>
        <p>• <strong>Retoca bordes:</strong> Con maquinilla personal cada semana</p>
        <p>• <strong>Usa productos de peinado:</strong> Según tu tipo de cabello</p>
        <p>• <strong>Cuida la barba:</strong> Aceites y bálsamos mantienen la forma</p>
        
        <h3>El Secreto de Mad Men</h3>
        <p>La clave está en la consistencia. Un buen corte base, productos adecuados y mantenimiento regular te harán lucir impecable todos los días.</p>
      `,
      category: 'Estilo',
      readTime: '6 min',
      icon: Star,
      featured: false
    }
  ];

  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Blog & Tips
          </Badge>
          <h2 className="text-4xl font-bold text-primary mb-4">
            Consejos de Cuidado Masculino
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Guías profesionales para mantener tu estilo entre visitas y lucir impecable siempre
          </p>
        </div>

        {selectedPost ? (
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => setSelectedPost(null)}
              className="mb-6"
            >
              ← Volver a todos los artículos
            </Button>
            
            {(() => {
              const post = blogPosts.find(p => p.id === selectedPost);
              if (!post) return null;
              
              const IconComponent = post.icon;
              return (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                      <div>
                        <Badge variant="secondary">{post.category}</Badge>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime} de lectura</span>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-3xl">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    
                    <div className="mt-8 p-6 bg-primary/5 rounded-lg border-l-4 border-primary">
                      <h4 className="font-bold text-primary mb-2">💡 Consejo de Mad Men Barbería</h4>
                      <p className="text-sm">
                        ¿Tienes dudas sobre tu rutina de cuidado? Nuestros barberos expertos están aquí para ayudarte. 
                        ¡Reserva una consulta y recibe consejos personalizados!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const IconComponent = post.icon;
              return (
                <Card 
                  key={post.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    post.featured ? 'ring-2 ring-primary/20 shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedPost(post.id)}
                >
                  {post.featured && (
                    <Badge 
                      variant="default" 
                      className="absolute -top-2 left-4 bg-primary text-primary-foreground"
                    >
                      Destacado
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent className="w-6 h-6 text-primary" />
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Leer más →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center mt-16">
          <Card className="inline-block p-6 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-4">
              <Heart className="w-8 h-8 text-primary" />
              <div className="text-left">
                <h3 className="font-bold text-primary">¿Necesitas consejos personalizados?</h3>
                <p className="text-sm text-muted-foreground">
                  Nuestros expertos barberos te ayudan con una consulta personalizada
                </p>
              </div>
              <Button variant="default">
                Consulta Gratis
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BlogTipsSection;