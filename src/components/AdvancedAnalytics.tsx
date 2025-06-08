
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar,
  Clock,
  Star,
  Scissors,
  Target,
  Award
} from 'lucide-react';

// Datos de ejemplo para los gráficos
const revenueData = [
  { month: 'Ene', revenue: 4200, appointments: 142, avgTicket: 29.6 },
  { month: 'Feb', revenue: 3800, appointments: 128, avgTicket: 29.7 },
  { month: 'Mar', revenue: 4600, appointments: 156, avgTicket: 29.5 },
  { month: 'Abr', revenue: 5200, appointments: 175, avgTicket: 29.7 },
  { month: 'May', revenue: 5800, appointments: 195, avgTicket: 29.7 },
  { month: 'Jun', revenue: 6400, appointments: 215, avgTicket: 29.8 }
];

const serviceData = [
  { service: 'Corte Clásico', bookings: 145, revenue: 2900, percentage: 35 },
  { service: 'Corte + Barba', bookings: 98, revenue: 3920, percentage: 28 },
  { service: 'Arreglo Barba', bookings: 76, revenue: 1520, percentage: 22 },
  { service: 'Afeitado', bookings: 52, revenue: 1560, percentage: 15 }
];

const hourlyData = [
  { hour: '9:00', appointments: 12 },
  { hour: '10:00', appointments: 18 },
  { hour: '11:00', appointments: 25 },
  { hour: '12:00', appointments: 22 },
  { hour: '13:00', appointments: 8 },
  { hour: '14:00', appointments: 15 },
  { hour: '15:00', appointments: 28 },
  { hour: '16:00', appointments: 32 },
  { hour: '17:00', appointments: 35 },
  { hour: '18:00', appointments: 28 },
  { hour: '19:00', appointments: 18 },
  { hour: '20:00', appointments: 12 }
];

const weeklyData = [
  { day: 'Lun', appointments: 28, revenue: 840 },
  { day: 'Mar', appointments: 35, revenue: 1050 },
  { day: 'Mié', appointments: 42, revenue: 1260 },
  { day: 'Jue', attendance: 38, revenue: 1140 },
  { day: 'Vie', appointments: 45, revenue: 1350 },
  { day: 'Sáb', appointments: 52, revenue: 1560 },
  { day: 'Dom', appointments: 15, revenue: 450 }
];

const barberPerformance = [
  { name: 'Carlos', appointments: 156, revenue: 4680, rating: 4.8, efficiency: 92 },
  { name: 'Miguel', appointments: 142, revenue: 4260, rating: 4.7, efficiency: 89 },
  { name: 'Antonio', appointments: 138, revenue: 4140, rating: 4.9, efficiency: 95 },
  { name: 'David', appointments: 125, revenue: 3750, rating: 4.6, efficiency: 87 }
];

const COLORS = ['#D4AF37', '#8B4513', '#CD853F', '#A0522D'];

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "#D4AF37",
  },
  appointments: {
    label: "Citas",
    color: "#8B4513",
  },
};

const AdvancedAnalytics = () => {
  const currentMonth = {
    revenue: 6400,
    appointments: 215,
    avgTicket: 29.8,
    satisfaction: 4.7,
    retention: 76.3,
    newClients: 42
  };

  const previousMonth = {
    revenue: 5800,
    appointments: 195,
    avgTicket: 29.7,
    satisfaction: 4.6,
    retention: 74.1,
    newClients: 38
  };

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = '', 
    isPositive = true 
  }: {
    title: string;
    value: number;
    change: string;
    icon: any;
    format?: string;
    isPositive?: boolean;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-barbershop-dark">
              {format === '€' && '€'}{value}{format === '%' && '%'}
            </p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {change}% vs mes anterior
              </span>
            </div>
          </div>
          <Icon className="w-8 h-8 text-barbershop-gold" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Ingresos Mensuales"
          value={currentMonth.revenue}
          change={calculateGrowth(currentMonth.revenue, previousMonth.revenue)}
          icon={DollarSign}
          format="€"
        />
        <MetricCard
          title="Citas Completadas"
          value={currentMonth.appointments}
          change={calculateGrowth(currentMonth.appointments, previousMonth.appointments)}
          icon={Calendar}
        />
        <MetricCard
          title="Ticket Promedio"
          value={currentMonth.avgTicket}
          change={calculateGrowth(currentMonth.avgTicket, previousMonth.avgTicket)}
          icon={Target}
          format="€"
        />
        <MetricCard
          title="Satisfacción"
          value={currentMonth.satisfaction}
          change={calculateGrowth(currentMonth.satisfaction, previousMonth.satisfaction)}
          icon={Star}
        />
        <MetricCard
          title="Retención"
          value={currentMonth.retention}
          change={calculateGrowth(currentMonth.retention, previousMonth.retention)}
          icon={Users}
          format="%"
        />
        <MetricCard
          title="Clientes Nuevos"
          value={currentMonth.newClients}
          change={calculateGrowth(currentMonth.newClients, previousMonth.newClients)}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolución de Ingresos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-barbershop-gold" />
              Evolución de Ingresos y Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--color-revenue)" 
                    strokeWidth={3}
                    name="Ingresos (€)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="var(--color-appointments)" 
                    strokeWidth={3}
                    name="Citas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribución por Servicios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scissors className="w-5 h-5 mr-2 text-barbershop-gold" />
              Distribución por Servicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="60%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="percentage"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow">
                            <p className="font-semibold">{data.service}</p>
                            <p>Reservas: {data.bookings}</p>
                            <p>Ingresos: €{data.revenue}</p>
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
                {serviceData.map((service, index) => (
                  <div key={service.service} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded mr-2" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span>{service.service}</span>
                    </div>
                    <span className="font-semibold">€{service.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horarios más Ocupados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-barbershop-gold" />
              Horarios más Ocupados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="appointments" 
                    fill="var(--color-revenue)" 
                    name="Citas"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Rendimiento Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-barbershop-gold" />
              Rendimiento Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--color-revenue)" 
                    fill="var(--color-revenue)"
                    fillOpacity={0.3}
                    name="Ingresos (€)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rendimiento de Barberos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-barbershop-gold" />
            Rendimiento de Barberos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Barbero</th>
                  <th className="text-left p-4">Citas</th>
                  <th className="text-left p-4">Ingresos</th>
                  <th className="text-left p-4">Valoración</th>
                  <th className="text-left p-4">Eficiencia</th>
                  <th className="text-left p-4">Promedio/Cita</th>
                </tr>
              </thead>
              <tbody>
                {barberPerformance.map((barber) => (
                  <tr key={barber.name} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-semibold">{barber.name}</td>
                    <td className="p-4">{barber.appointments}</td>
                    <td className="p-4 font-semibold text-barbershop-gold">€{barber.revenue}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {barber.rating}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-barbershop-gold h-2 rounded-full" 
                            style={{ width: `${barber.efficiency}%` }}
                          />
                        </div>
                        {barber.efficiency}%
                      </div>
                    </td>
                    <td className="p-4">€{(barber.revenue / barber.appointments).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
