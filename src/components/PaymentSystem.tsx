
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  CreditCard, 
  Receipt, 
  TrendingUp, 
  Calendar,
  User,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface Payment {
  id: string;
  appointmentId: string;
  customerName: string;
  customerEmail: string;
  service: string;
  barber: string;
  amount: number;
  method: 'efectivo' | 'tarjeta' | 'transferencia' | 'bizum';
  status: 'pendiente' | 'pagado' | 'vencido' | 'cancelado';
  date: string;
  dueDate: string;
  invoiceNumber: string;
  notes?: string;
}

interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'borrador' | 'enviada' | 'pagada' | 'vencida';
  issueDate: string;
  dueDate: string;
  paymentMethod?: string;
  notes?: string;
}

interface InvoiceItem {
  service: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

const PaymentSystem = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState('payments');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Datos de ejemplo para servicios y precios
  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: 25 },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: 15 },
    { id: 'cut-beard', name: 'Corte + Barba', price: 35 },
    { id: 'shave', name: 'Afeitado Tradicional', price: 20 },
    { id: 'treatments', name: 'Tratamientos Especiales', price: 30 }
  ];

  const barbers = [
    'Luis Bracho', 'Jesús Hernández', 'Luis Alfredo', 'Dionys Bracho',
    'Isaac Hernández', 'Carlos López', 'Luis Urbiñez', 'Randy Valdespino'
  ];

  // Datos de ejemplo para gráficos
  const revenueData = [
    { month: 'Ene', revenue: 3200, payments: 128 },
    { month: 'Feb', revenue: 2800, payments: 112 },
    { month: 'Mar', revenue: 3600, payments: 144 },
    { month: 'Abr', revenue: 4200, payments: 168 },
    { month: 'May', revenue: 4800, payments: 192 },
    { month: 'Jun', revenue: 5400, payments: 216 }
  ];

  const paymentMethodData = [
    { method: 'Efectivo', amount: 2400, percentage: 45, color: '#D4AF37' },
    { method: 'Tarjeta', amount: 1800, percentage: 34, color: '#8B4513' },
    { method: 'Transferencia', amount: 800, percentage: 15, color: '#CD853F' },
    { method: 'Bizum', amount: 320, percentage: 6, color: '#A0522D' }
  ];

  useEffect(() => {
    // Generar datos de ejemplo
    generateSampleData();
  }, []);

  const generateSampleData = () => {
    const samplePayments: Payment[] = [];
    const sampleInvoices: Invoice[] = [];

    // Generar pagos de ejemplo
    for (let i = 1; i <= 25; i++) {
      const service = services[Math.floor(Math.random() * services.length)];
      const barber = barbers[Math.floor(Math.random() * barbers.length)];
      const methods = ['efectivo', 'tarjeta', 'transferencia', 'bizum'] as const;
      const statuses = ['pendiente', 'pagado', 'vencido', 'cancelado'] as const;
      
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      const payment: Payment = {
        id: `pay-${i}`,
        appointmentId: `apt-${i}`,
        customerName: `Cliente ${i}`,
        customerEmail: `cliente${i}@email.com`,
        service: service.name,
        barber,
        amount: service.price,
        method: methods[Math.floor(Math.random() * methods.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        date: date.toISOString().split('T')[0],
        dueDate: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        invoiceNumber: `INV-2024-${String(i).padStart(3, '0')}`,
        notes: i % 5 === 0 ? 'Pago con descuento aplicado' : undefined
      };
      
      samplePayments.push(payment);
    }

    setPayments(samplePayments);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pagado': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'vencido': return 'bg-red-100 text-red-800';
      case 'cancelado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'efectivo': return <DollarSign className="w-4 h-4" />;
      case 'tarjeta': return <CreditCard className="w-4 h-4" />;
      case 'transferencia': return <Receipt className="w-4 h-4" />;
      case 'bizum': return <FileText className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const updatePaymentStatus = (paymentId: string, newStatus: Payment['status']) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: newStatus }
        : payment
    ));
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Métricas calculadas
  const totalRevenue = payments.reduce((sum, payment) => 
    payment.status === 'pagado' ? sum + payment.amount : sum, 0
  );
  
  const pendingAmount = payments.reduce((sum, payment) => 
    payment.status === 'pendiente' ? sum + payment.amount : sum, 0
  );
  
  const overdueAmount = payments.reduce((sum, payment) => 
    payment.status === 'vencido' ? sum + payment.amount : sum, 0
  );

  const PaymentCard = ({ payment }: { payment: Payment }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPayment(payment)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-barbershop-dark">{payment.customerName}</h3>
            <p className="text-sm text-muted-foreground">{payment.invoiceNumber}</p>
          </div>
          <Badge className={getStatusColor(payment.status)}>
            {payment.status}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Servicio:</span>
            <span>{payment.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Barbero:</span>
            <span>{payment.barber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Método:</span>
            <div className="flex items-center">
              {getMethodIcon(payment.method)}
              <span className="ml-1 capitalize">{payment.method}</span>
            </div>
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-bold text-barbershop-gold text-lg">€{payment.amount}</span>
          </div>
        </div>

        {payment.status === 'pendiente' && (
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                updatePaymentStatus(payment.id, 'pagado');
              }}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Marcar Pagado
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold text-barbershop-dark">€{totalRevenue}</p>
                <p className="text-xs text-green-600 mt-1">+12.5% vs mes anterior</p>
              </div>
              <DollarSign className="w-8 h-8 text-barbershop-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pagos Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">€{pendingAmount}</p>
                <p className="text-xs text-muted-foreground mt-1">{payments.filter(p => p.status === 'pendiente').length} facturas</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pagos Vencidos</p>
                <p className="text-2xl font-bold text-red-600">€{overdueAmount}</p>
                <p className="text-xs text-muted-foreground mt-1">{payments.filter(p => p.status === 'vencido').length} facturas</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Cobro</p>
                <p className="text-2xl font-bold text-green-600">87.3%</p>
                <p className="text-xs text-green-600 mt-1">+3.2% vs mes anterior</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por cliente, servicio o factura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="pagado">Pagados</SelectItem>
                <SelectItem value="vencido">Vencidos</SelectItem>
                <SelectItem value="cancelado">Cancelados</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Factura
            </Button>
          </div>

          {/* Lista de pagos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Pagos ({filteredPayments.length})
              </h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredPayments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))}
              </div>
            </div>

            {/* Detalles del pago seleccionado */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Detalles del Pago</h3>
              {selectedPayment ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedPayment.invoiceNumber}</span>
                      <Badge className={getStatusColor(selectedPayment.status)}>
                        {selectedPayment.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Información del Cliente</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nombre:</span>
                          <span>{selectedPayment.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{selectedPayment.customerEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Detalles del Servicio</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Servicio:</span>
                          <span>{selectedPayment.service}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Barbero:</span>
                          <span>{selectedPayment.barber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fecha:</span>
                          <span>{selectedPayment.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vencimiento:</span>
                          <span>{selectedPayment.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Información de Pago</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Método:</span>
                          <div className="flex items-center">
                            {getMethodIcon(selectedPayment.method)}
                            <span className="ml-1 capitalize">{selectedPayment.method}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t pt-2">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-bold text-barbershop-gold text-xl">€{selectedPayment.amount}</span>
                        </div>
                      </div>
                    </div>

                    {selectedPayment.notes && (
                      <div>
                        <h4 className="font-semibold mb-2">Notas</h4>
                        <p className="text-sm text-muted-foreground">{selectedPayment.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                      {selectedPayment.status === 'pendiente' && (
                        <Button 
                          onClick={() => updatePaymentStatus(selectedPayment.id, 'pagado')}
                          className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Marcar Pagado
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Selecciona un pago para ver los detalles
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolución de ingresos */}
            <Card>
              <CardHeader>
                <CardTitle>Evolución de Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#D4AF37" 
                        strokeWidth={3}
                        name="Ingresos (€)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Métodos de pago */}
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="60%">
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded shadow">
                                <p className="font-semibold">{data.method}</p>
                                <p>Monto: €{data.amount}</p>
                                <p>Porcentaje: {data.percentage}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {paymentMethodData.map((method, index) => (
                      <div key={method.method} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded mr-2" 
                            style={{ backgroundColor: method.color }}
                          />
                          <span>{method.method}</span>
                        </div>
                        <span className="font-semibold">€{method.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Gestión de Facturas</h3>
              <p>Sistema de facturación automática y manual - En desarrollo</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Pagos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tax-rate">Tasa de IVA (%)</Label>
                <Input id="tax-rate" type="number" defaultValue="21" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="payment-terms">Términos de Pago (días)</Label>
                <Input id="payment-terms" type="number" defaultValue="7" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="currency">Moneda</Label>
                <Select defaultValue="eur">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eur">Euro (€)</SelectItem>
                    <SelectItem value="usd">Dólar ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90">
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentSystem;
