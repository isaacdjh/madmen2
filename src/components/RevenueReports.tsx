
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Euro, Calendar, CreditCard, Banknote, Gift, User } from 'lucide-react';
import { 
  getAllAppointments, 
  getAllBonusPackages,
  getClientBonuses,
  getAllClients,
  type Appointment,
  type BonusPackage,
  type ClientBonus,
  type Client,
  type Payment
} from '@/lib/supabase-helpers';
import { supabase } from '@/integrations/supabase/client';
import MonthlyRevenueView from './MonthlyRevenueView';

interface RevenueReportsProps {
  barberId?: string;
  barberName?: string;
}

interface DailyReport {
  date: string;
  cash: number;
  card: number;
  bonusRedeemed: number;
  bonusSold: number;
  totalServices: number;
  servicesCount: number;
  bonusCount: number;
  redeemedCount: number;
}

const RevenueReports = ({ barberId, barberName }: RevenueReportsProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bonusPackages, setBonusPackages] = useState<BonusPackage[]>([]);
  const [clientBonuses, setClientBonuses] = useState<ClientBonus[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [paymentsData, appointmentsData, packagesData, bonusesData, clientsData] = await Promise.all([
        getPayments(),
        getAllAppointments(),
        getAllBonusPackages(),
        getClientBonuses(),
        getAllClients()
      ]);

      setPayments(paymentsData);
      setAppointments(appointmentsData);
      setBonusPackages(packagesData);
      setClientBonuses(bonusesData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPayments = async (): Promise<Payment[]> => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }

    return data || [];
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente no encontrado';
  };

  const getReportsData = () => {
    const today = new Date();
    const reports: DailyReport[] = [];
    
    let daysToShow = 7;
    if (selectedPeriod === 'day') daysToShow = 7;
    else if (selectedPeriod === 'week') daysToShow = 28;
    else if (selectedPeriod === 'month') daysToShow = 365;

    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Filtrar datos por barbero si se especifica
      let dayAppointments = appointments.filter(apt => 
        apt.appointment_date === dateStr && apt.status === 'completada'
      );
      let dayPayments = payments.filter(payment => 
        payment.created_at.split('T')[0] === dateStr
      );
      let dayBonuses = clientBonuses.filter(bonus => 
        bonus.purchase_date.split('T')[0] === dateStr
      );

      if (barberId) {
        dayAppointments = dayAppointments.filter(apt => apt.barber === barberId);
        // Para pagos, necesitamos filtrar por las citas del barbero
        const barberAppointmentIds = dayAppointments.map(apt => apt.id);
        dayPayments = dayPayments.filter(payment => 
          payment.appointment_id && barberAppointmentIds.includes(payment.appointment_id)
        );
        dayBonuses = dayBonuses.filter(bonus => bonus.sold_by_barber === barberName);
      }

      const cash = dayPayments
        .filter(p => p.payment_method === 'efectivo')
        .reduce((sum, p) => sum + Number(p.amount), 0);
      
      const card = dayPayments
        .filter(p => p.payment_method === 'tarjeta')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      const bonusRedeemed = dayPayments
        .filter(p => p.payment_method === 'bono')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      const bonusSold = dayBonuses.reduce((sum, bonus) => {
        const pkg = bonusPackages.find(p => p.id === bonus.bonus_package_id);
        return sum + (pkg?.price || 0);
      }, 0);

      const totalServices = cash + card;
      
      reports.push({
        date: dateStr,
        cash,
        card,
        bonusRedeemed,
        bonusSold,
        totalServices,
        servicesCount: dayAppointments.length,
        bonusCount: dayBonuses.length,
        redeemedCount: dayPayments.filter(p => p.payment_method === 'bono').length
      });
    }

    return reports.reverse();
  };

  const getTotals = () => {
    const reports = getReportsData();
    return reports.reduce((totals, report) => ({
      cash: totals.cash + report.cash,
      card: totals.card + report.card,
      bonusRedeemed: totals.bonusRedeemed + report.bonusRedeemed,
      bonusSold: totals.bonusSold + report.bonusSold,
      totalServices: totals.totalServices + report.totalServices,
      servicesCount: totals.servicesCount + report.servicesCount,
      bonusCount: totals.bonusCount + report.bonusCount,
      redeemedCount: totals.redeemedCount + report.redeemedCount
    }), {
      cash: 0,
      card: 0,
      bonusRedeemed: 0,
      bonusSold: 0,
      totalServices: 0,
      servicesCount: 0,
      bonusCount: 0,
      redeemedCount: 0
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Cargando reportes...</div>
      </div>
    );
  }

  const reportsData = getReportsData();
  const totals = getTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-barbershop-dark mb-2">
          {barberId ? `Reportes de ${barberName}` : 'Reportes Generales'}
        </h2>
        <p className="text-gray-600">Ingresos detallados por servicios y bonos</p>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">Vista Diaria</TabsTrigger>
          <TabsTrigger value="monthly">Vista Mensual</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          {/* Period Selector */}
          <div className="flex gap-2">
            <Button 
              variant={selectedPeriod === 'day' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('day')}
            >
              Últimos 7 días
            </Button>
            <Button 
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('week')}
            >
              Últimas 4 semanas
            </Button>
            <Button 
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('month')}
            >
              Último año
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Efectivo</p>
                    <p className="text-2xl font-bold text-green-600">{totals.cash.toFixed(2)}€</p>
                  </div>
                  <Banknote className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tarjeta</p>
                    <p className="text-2xl font-bold text-blue-600">{totals.card.toFixed(2)}€</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Bonos Vendidos</p>
                    <p className="text-2xl font-bold text-purple-600">{totals.bonusSold.toFixed(2)}€</p>
                  </div>
                  <Gift className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Ingresos</p>
                    <p className="text-2xl font-bold text-barbershop-gold">
                      {(totals.totalServices + totals.bonusSold).toFixed(2)}€
                    </p>
                  </div>
                  <Euro className="w-8 h-8 text-barbershop-gold" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Report Table */}
          <Card>
            <CardHeader>
              <CardTitle>Desglose Detallado</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Efectivo</TableHead>
                    <TableHead>Tarjeta</TableHead>
                    <TableHead>Bonos Canjeados</TableHead>
                    <TableHead>Bonos Vendidos</TableHead>
                    <TableHead>Total Servicios</TableHead>
                    <TableHead>Servicios</TableHead>
                    <TableHead>Bonos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsData.map((report) => (
                    <TableRow key={report.date}>
                      <TableCell>
                        {new Date(report.date).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">
                        {report.cash.toFixed(2)}€
                      </TableCell>
                      <TableCell className="text-blue-600 font-medium">
                        {report.card.toFixed(2)}€
                      </TableCell>
                      <TableCell className="text-orange-600 font-medium">
                        {report.redeemedCount} ({report.bonusRedeemed.toFixed(2)}€)
                      </TableCell>
                      <TableCell className="text-purple-600 font-medium">
                        {report.bonusSold.toFixed(2)}€
                      </TableCell>
                      <TableCell className="font-bold">
                        {report.totalServices.toFixed(2)}€
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.servicesCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-50">
                          {report.bonusCount}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-barbershop-dark">{totals.servicesCount}</p>
                  <p className="text-sm text-muted-foreground">Servicios Completados</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{totals.bonusCount}</p>
                  <p className="text-sm text-muted-foreground">Bonos Vendidos</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{totals.redeemedCount}</p>
                  <p className="text-sm text-muted-foreground">Servicios con Bono</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyRevenueView barberId={barberId} barberName={barberName} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueReports;
