import { Helmet } from 'react-helmet-async';
import ClientNavigation from '@/components/client/ClientNavigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Blog = () => {
  const articles = [
    {
      title: 'Cómo mantener tu barba perfecta entre visitas',
      excerpt: 'Consejos profesionales para el cuidado diario de tu barba. Productos recomendados y técnicas de recorte en casa.',
      category: 'Cuidado de Barba',
      readTime: '5 min',
      date: '15 Ene 2025',
      image: null,
    },
    {
      title: 'Los cortes clásicos que nunca pasan de moda',
      excerpt: 'Descubre los estilos atemporales que siguen siendo tendencia: el slick back, el pompadour y el fade clásico.',
      category: 'Tendencias',
      readTime: '4 min',
      date: '10 Ene 2025',
      image: null,
    },
    {
      title: 'Guía completa del afeitado tradicional',
      excerpt: 'Todo lo que necesitas saber sobre el afeitado con navaja: preparación, técnica y cuidados posteriores.',
      category: 'Afeitado',
      readTime: '7 min',
      date: '5 Ene 2025',
      image: null,
    },
    {
      title: 'Productos esenciales para el caballero moderno',
      excerpt: 'Los imprescindibles que todo hombre debería tener: desde ceras hasta aceites para barba.',
      category: 'Productos',
      readTime: '6 min',
      date: '28 Dic 2024',
      image: null,
    },
    {
      title: 'Cómo elegir el corte perfecto para tu tipo de rostro',
      excerpt: 'Aprende a identificar tu forma de cara y descubre qué estilos te favorecen más.',
      category: 'Consejos',
      readTime: '5 min',
      date: '20 Dic 2024',
      image: null,
    },
    {
      title: 'Historia de la barbería: de la antigüedad a Mad Men',
      excerpt: 'Un recorrido por la evolución de la barbería y cómo se ha convertido en un espacio de cultura masculina.',
      category: 'Historia',
      readTime: '8 min',
      date: '15 Dic 2024',
      image: null,
    },
  ];

  const tips = [
    {
      title: 'Lava tu barba 2-3 veces por semana',
      description: 'Usar un champú específico para barba evita la resequedad y mantiene los folículos sanos.',
    },
    {
      title: 'Aplica aceite después de la ducha',
      description: 'El aceite de barba hidrata tanto el vello como la piel, previniendo la picazón.',
    },
    {
      title: 'Peina tu barba a diario',
      description: 'Cepillar la barba distribuye los aceites naturales y la mantiene ordenada.',
    },
    {
      title: 'Visita a tu barbero cada 3-4 semanas',
      description: 'Mantener la forma y eliminar puntas dañadas es clave para una barba impecable.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Blog & Tips | Mad Men Barbería Tradicional Madrid</title>
        <meta name="description" content="Consejos de barbería, tendencias de cortes y cuidado masculino. Aprende a mantener tu look perfecto con los expertos de Mad Men." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <ClientNavigation onBookingClick={() => window.open('https://madmenbarberia.com/reserva', '_blank')} />
        
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <Link to="/">
              <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
            
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-primary mb-6">Blog & Tips</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Consejos de expertos, tendencias y todo lo que necesitas saber para lucir impecable.
              </p>
            </div>

            {/* Quick Tips Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-primary text-center mb-8">Tips Rápidos</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {tips.map((tip, index) => (
                  <Card key={index} className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Articles Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-primary text-center mb-8">Artículos</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {articles.map((article, index) => (
                  <Card key={index} className="hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {article.date}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* CTA */}
            <div className="text-center bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-primary mb-4">¿Quieres más consejos personalizados?</h3>
              <p className="text-muted-foreground mb-6">
                Visítanos en cualquiera de nuestras sedes y nuestros barberos te asesorarán sobre el mejor look para ti.
              </p>
              <a href="https://madmenbarberia.com/reserva" target="_blank" rel="noopener noreferrer">
                <Button size="lg">Reservar Cita</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
