
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Gift, 
  Target, 
  Calendar,
  Star,
  DollarSign,
  BarChart3,
  Send,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Promotion {
  id: string;
  name: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  code: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  applicableServices: string[];
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  targetSegment: string;
  sentDate: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  status: 'draft' | 'sent' | 'scheduled';
}

const MarketingDashboard = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      name: 'Descuento Nuevos Clientes',
      description: 'Promoción especial para clientes que nos visitan por primera vez',
      discount: 20,
      type: 'percentage',
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      code: 'NUEVO20',
      usageLimit: 100,
      usageCount: 45,
      isActive: true,
      applicableServices: ['classic-cut', 'cut-beard']
    },
    {
      id: '2',
      name: 'Pack Barbería Completa',
      description: 'Descuento en servicios combinados',
      discount: 10,
      type: 'fixed',
      startDate: '2024-06-01',
      endDate: '2024-07-31',
      code: 'PACK10',
      usageLimit: 50,
      usageCount: 23,
      isActive: true,
      applicableServices: ['cut-beard']
    }
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Newsletter Junio',
      subject: 'Nuevos servicios en Mad Men Barbería',
      content: 'Descubre nuestros nuevos tratamientos especiales...',
      targetSegment: 'Todos los clientes',
      sentDate: '2024-06-01',
      recipients: 1250,
      openRate: 32.5,
      clickRate: 8.7,
      status: 'sent'
    },
    {
      id: '2',
      name: 'Promoción Verano',
      subject: '¡Prepárate para el verano con un 20% de descuento!',
      content: 'Oferta especial en cortes y tratamientos...',
      targetSegment: 'Clientes VIP',
      sentDate: '2024-06-15',
      recipients: 380,
      openRate: 45.2,
      clickRate: 12.1,
      status: 'sent'
    }
  ]);

  const [newPromotion, setNewPromotion] = useState({
    name: '',
    description: '',
    discount: 0,
    type: 'percentage' as 'percentage' | 'fixed',
    startDate: '',
    endDate: '',
    code: '',
    usageLimit: 0
  });

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    targetSegment: 'Todos los clientes'
  });

  const marketingMetrics = {
    totalClients: 1250,
    newClientsThisMonth: 89,
    averageSpend: 42,
    retentionRate: 76.3,
    totalRevenue: 52500,
    campaignsSent: 12,
    avgOpenRate: 38.2,
    avgClickRate: 9.8
  };

  const clientSegments = [
    { name: 'Clientes VIP', count: 150, criteria: 'Más de 10 visitas' },
    { name: 'Clientes Regulares', count: 450, criteria: '3-10 visitas' },
    { name: 'Clientes Nuevos', count: 650, criteria: '1-2 visitas' }
  ];

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico' },
    { id: 'beard-trim', name: 'Arreglo de Barba' },
    { id: 'cut-beard', name: 'Corte + Barba' },
    { id: 'shave', name: 'Afeitado Tradicional' }
  ];

  const addPromotion = () => {
    if (!newPromotion.name || !newPromotion.code) return;
    
    const promotion: Promotion = {
      id: Date.now().toString(),
      ...newPromotion,
      usageCount: 0,
      isActive: true,
      applicableServices: ['classic-cut']
    };
    
    setPromotions([...promotions, promotion]);
    setNewPromotion({
      name: '',
      description: '',
      discount: 0,
      type: 'percentage',
      startDate: '',
      endDate: '',
      code: '',
      usageLimit: 0
    });
  };

  const togglePromotionStatus = (id: string) => {
    setPromotions(promotions.map(promo => 
      promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
    ));
  };

  const addCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject) return;
    
    const campaign: Campaign = {
      id: Date.now().toString(),
      ...newCampaign,
      sentDate: new Date().toISOString().split('T')[0],
      recipients: 0,
      openRate: 0,
      clickRate: 0,
      status: 'draft'
    };
    
    setCampaigns([...campaigns, campaign]);
    setNewCampaign({
      name: '',
      subject: '',
      content: '',
      targetSegment: 'Todos los clientes'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Herramientas de Marketing</h1>
        <p className="text-muted-foreground">Gestiona promociones, campañas y analiza el comportamiento de tus clientes</p>
      </div>

      {/* Marketing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clientes</p>
                <p className="text-2xl font-bold text-barbershop-dark">{marketingMetrics.totalClients}</p>
              </div>
              <Users className="w-8 h-8 text-barbershop-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nuevos este Mes</p>
                <p className="text-2xl font-bold text-green-600">{marketingMetrics.newClientsThisMonth}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gasto Promedio</p>
                <p className="text-2xl font-bold text-barbershop-gold">{marketingMetrics.averageSpend}€</p>
              </div>
              <DollarSign className="w-8 h-8 text-barbershop-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Retención</p>
                <p className="text-2xl font-bold text-blue-600">{marketingMetrics.retentionRate}%</p>
              </div>
              <Star className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="promotions" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="promotions">Promociones</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
          <TabsTrigger value="segments">Segmentación</TabsTrigger>
        </TabsList>

        {/* Promociones */}
        <TabsContent value="promotions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crear Nueva Promoción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-barbershop-gold" />
                  Nueva Promoción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Nombre de la promoción"
                  value={newPromotion.name}
                  onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                />
                <Textarea
                  placeholder="Descripción"
                  value={newPromotion.description}
                  onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Descuento"
                    value={newPromotion.discount}
                    onChange={(e) => setNewPromotion({...newPromotion, discount: parseInt(e.target.value)})}
                  />
                  <select 
                    className="px-3 py-2 border rounded-md"
                    value={newPromotion.type}
                    onChange={(e) => setNewPromotion({...newPromotion, type: e.target.value as 'percentage' | 'fixed'})}
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Cantidad Fija (€)</option>
                  </select>
                </div>
                <Input
                  placeholder="Código promocional"
                  value={newPromotion.code}
                  onChange={(e) => setNewPromotion({...newPromotion, code: e.target.value.toUpperCase()})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    placeholder="Fecha inicio"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})}
                  />
                  <Input
                    type="date"
                    placeholder="Fecha fin"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})}
                  />
                </div>
                <Input
                  type="number"
                  placeholder="Límite de usos"
                  value={newPromotion.usageLimit}
                  onChange={(e) => setNewPromotion({...newPromotion, usageLimit: parseInt(e.target.value)})}
                />
                <Button onClick={addPromotion} className="w-full bg-barbershop-gold text-barbershop-dark">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Promoción
                </Button>
              </CardContent>
            </Card>

            {/* Lista de Promociones */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Promociones Activas</h3>
              {promotions.map((promotion) => (
                <Card key={promotion.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-barbershop-dark">{promotion.name}</h4>
                        <p className="text-sm text-muted-foreground">{promotion.description}</p>
                      </div>
                      <Badge className={promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {promotion.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Código:</span>
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">{promotion.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Descuento:</span>
                        <span className="font-bold text-barbershop-gold">
                          {promotion.discount}{promotion.type === 'percentage' ? '%' : '€'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Usos:</span>
                        <span>{promotion.usageCount}/{promotion.usageLimit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Válida hasta:</span>
                        <span>{promotion.endDate}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => togglePromotionStatus(promotion.id)}
                      >
                        {promotion.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Campañas */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nueva Campaña */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-barbershop-gold" />
                  Nueva Campaña
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Nombre de la campaña"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                />
                <Input
                  placeholder="Asunto del email"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                />
                <Textarea
                  placeholder="Contenido del mensaje"
                  rows={6}
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                />
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={newCampaign.targetSegment}
                  onChange={(e) => setNewCampaign({...newCampaign, targetSegment: e.target.value})}
                >
                  <option value="Todos los clientes">Todos los clientes</option>
                  <option value="Clientes VIP">Clientes VIP</option>
                  <option value="Clientes Regulares">Clientes Regulares</option>
                  <option value="Clientes Nuevos">Clientes Nuevos</option>
                </select>
                <Button onClick={addCampaign} className="w-full bg-barbershop-gold text-barbershop-dark">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Campaña
                </Button>
              </CardContent>
            </Card>

            {/* Campañas Enviadas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Campañas Recientes</h3>
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-barbershop-dark">{campaign.name}</h4>
                        <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                      </div>
                      <Badge className={
                        campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {campaign.status === 'sent' ? 'Enviada' : 
                         campaign.status === 'draft' ? 'Borrador' : 'Programada'}
                      </Badge>
                    </div>
                    
                    {campaign.status === 'sent' && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Destinatarios:</span>
                          <p className="font-bold">{campaign.recipients}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tasa de Apertura:</span>
                          <p className="font-bold text-green-600">{campaign.openRate}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tasa de Clic:</span>
                          <p className="font-bold text-blue-600">{campaign.clickRate}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Enviada:</span>
                          <p className="font-bold">{campaign.sentDate}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      {campaign.status === 'draft' && (
                        <Button size="sm" className="bg-barbershop-gold text-barbershop-dark">
                          <Send className="w-4 h-4 mr-1" />
                          Enviar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Análisis */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-barbershop-gold" />
                  Rendimiento de Campañas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Tasa de Apertura Promedio</span>
                    <span className="font-bold text-green-600">{marketingMetrics.avgOpenRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tasa de Clic Promedio</span>
                    <span className="font-bold text-blue-600">{marketingMetrics.avgClickRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Campañas Enviadas</span>
                    <span className="font-bold">{marketingMetrics.campaignsSent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ROI de Marketing</span>
                    <span className="font-bold text-barbershop-gold">285%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-barbershop-gold" />
                  Métricas de Conversión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Conversión Email → Cita</span>
                    <span className="font-bold text-green-600">15.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conversión Promoción → Venta</span>
                    <span className="font-bold text-blue-600">42.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Clientes que Repiten</span>
                    <span className="font-bold text-barbershop-gold">67.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Satisfacción del Cliente</span>
                    <span className="font-bold text-yellow-600">4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Segmentación */}
        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clientSegments.map((segment, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{segment.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-barbershop-gold">{segment.count}</p>
                    <p className="text-sm text-muted-foreground">clientes</p>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">{segment.criteria}</p>
                  <Button className="w-full mt-4" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Campaña
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingDashboard;
