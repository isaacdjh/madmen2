
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Euro, Calendar, TrendingUp, Users, Gift, CreditCard, Banknote } from 'lucide-react';
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

interface MonthlyRevenueViewProps {
  barberId?: string;
  barberName?: string;
}

interface MonthlyData {
  month: string;
  year: number;
  cash: number;
  card: number;
  bonusRedeemed: number;
  bonusSold: number;
  totalRevenue: number;
  servicesCount: number;
  bonusCount: number;
  redeemedCount: number;
  clientsServed: number;
}

const MonthlyRevenueView = ({ barberId, barberName }: MonthlyRevenueViewProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bonusPackages, setBonusPackages] = useState<BonusPackage[]>([]);
  const [clientBonuses, setClientBonuses] = useState<ClientBonus[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadAllData();
  }, []);

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

  const getMonthlyData = (): MonthlyData[] => {
    const monthsData: MonthlyData[] = [];
    
    for (let month = 0; month < 12; month++) {
      const monthStr = `${selectedYear}-${(month + 1).toString().padStart(2, '0')}`;
      
      // Filtrar datos del mes
      let monthAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointment_date);
        return aptDate.getFullYear() === selectedYear && 
               aptDate.getMonth() === month && 
               apt.status === 'completada';
      });

      let monthPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate.getFullYear() === selectedYear && paymentDate.getMonth() === month;
      });

      let monthBonuses = clientBonuses.filter(bonus => {
        const bonusDate = new Date(bonus.purchase_date);
        return bonusDate.getFullYear() === selectedYear && bonusDate.getMonth() === month;
      });

      // Filtrar por barbero si se especifica
      if (barberId) {
        monthAppointments = monthAppointments.filter(apt => apt.barber === barberId);
        const barberAppointmentIds = monthAppointments.map(apt => apt.id);
        monthPayments = monthPayments.filter(payment => 
          payment.appointment_id && barberAppointmentIds.includes(payment.appointment_id)
        );
        monthBonuses = monthBonuses.filter(bonus => bonus.sold_by_barber === barberName);
      }

      const cash = monthPayments
        .filter(p => p.payment_method === 'efectivo')
        .reduce((sum, p) => sum + Number(p.amount), 0);
      
      const card = monthPayments
        .filter(p => p.payment_method === 'tarjeta')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      const bonusRedeemed = monthPayments
        .filter(p => p.payment_method === 'bono')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      const bonusSold = monthBonuses.reduce((sum, bonus) => {
        const pkg = bonusPackages.find(p => p.id === bonus.bonus_package_id);
        return sum + (pkg?.price || 0);
      }, 0);

      // Clientes únicos servidos
      const uniqueClients = new Set(monthAppointments.map(apt => apt.client_id).filter(Boolean));

      monthsData.push({
        month: new Date(selectedYear, month, 1).toLocaleDateString('es-ES', { month: 'long' }),
        year: selectedYear,
        cash,
        card,
        bonusRedeemed,
        bonusSold,
        totalRevenue: cash + card + bonusSold,
        servicesCount: monthAppointments.length,
        bonusCount: monthBonuses.length,
        redeemedCount: monthPayments.filter(p => p.payment_method === 'bono').length,
        clientsServed: uniqueClients.size
      });
    }

    return monthsData;
  };

  const getCurrentMonthData = () => {
    const currentMonth = new Date().getMonth();
    const monthlyData = getMonthlyData();
    return monthlyData[currentMonth];
  };

  const getYearTotal = () => {
    const monthlyData = getMonthlyData();
    return monthlyData.reduce((total, month) => ({
      cash: total.cash + month.cash,
      card: total.card + month.card,
      bonusRedeemed: total.bonusRedeemed + month.bonusRedeemed,
      bonusSold: total.bonusSold + month.bonusSold,
      totalRevenue: total.totalRevenue + month.totalRevenue,
      servicesCount: total.servicesCount + month.servicesCount,
      bonusCount: total.bonusCount + month.bonusCount,
      redeemedCount: total.redeemedCount + month.redeemedCount,
      clientsServed: total.clientsServed + month.clientsServed
    }), {
      cash: 0, card: 0, bonusRedeemed: 0, bonusSold: 0, totalRevenue: 0,
      servicesCount: 0, bonusCount: 0, redeemedCount: 0, clientsServed: 0
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Cargando datos mensuales...</div>
      </div>
    );
  }

  const monthlyData = getMonthlyData();
  const currentMonth = getCurrentMonthData();
  const yearTotal = getYearTotal();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-barbershop-dark">
            Vista Mensual {barberId ? `- ${barberName}` : '- General'}
          </h2>
          <p className="text-gray-600">Facturación por meses del año {selectedYear}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedYear === new Date().getFullYear() - 1 ? 'default' : 'outline'}
            onClick={() => setSelectedYear(new Date().getFullYear() - 1)}
          >
            {new Date().getFullYear() - 1}
          </Button>
          <Button 
            variant={selectedYear === new Date().getFullYear() ? 'default' : 'outline'}
            onClick={() => setSelectedYear(new Date().getFullYear())}
          >
            {new Date().getFullYear()}
          </Button>
        </div>
      </div>

      {/* Current Month Highlight */}
      <Card className="border-barbershop-gold border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Mes Actual - {currentMonth.month} {currentMonth.year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-barbershop-gold">
                {currentMonth.totalRevenue.toFixed(2)}€
              </p>
              <p className="text-sm text-muted-foreground">Total Mes</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">
                {(currentMonth.cash + currentMonth.card).toFixed(2)}€
              </p>
              <p className="text-sm text-muted-foreground">Servicios</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-600">
                {currentMonth.bonusSold.toFixed(2)}€
              </p>
              <p className="text-sm text-muted-foreground">Bonos Vendidos</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">
                {currentMonth.clientsServed}
              </p>
              <p className="text-sm text-muted-foreground">Clientes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Year Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Año</p>
                <p className="text-2xl font-bold text-barbershop-gold">
                  {yearTotal.totalRevenue.toFixed(2)}€
                </p>
              </div>
              <Euro className="w-8 h-8 text-barbershop-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efectivo</p>
                <p className="text-xl font-bold text-green-600">
                  {yearTotal.cash.toFixed(2)}€
                </p>
              </div>
              <Banknote className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tarjeta</p>
                <p className="text-xl font-bold text-blue-600">
                  {yearTotal.card.toFixed(2)}€
                </p>
              </div>
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Servicios</p>
                <p className="text-xl font-bold text-barbershop-dark">
                  {yearTotal.servicesCount}
                </p>
              </div>
              <Users className="w-6 h-6 text-barbershop-dark" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bonos</p>
                <p className="text-xl font-bold text-purple-600">
                  {yearTotal.bonusCount}
                </p>
              </div>
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {monthlyData.map((month, index) => (
          <Card key={index} className={`${month.totalRevenue > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg capitalize">
                {month.month}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total:</span>
                <span className="font-bold text-barbershop-gold">
                  {month.totalRevenue.toFixed(2)}€
                </span>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Efectivo:</span>
                  <span>{month.cash.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Tarjeta:</span>
                  <span>{month.card.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600">Bonos:</span>
                  <span>{month.bonusSold.toFixed(2)}€</span>
                </div>
              </div>

              <div className="pt-2 border-t space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Servicios:</span>
                  <Badge variant="outline">{month.servicesCount}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bonos vendidos:</span>
                  <Badge variant="outline" className="bg-purple-50">
                    {month.bonusCount}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Clientes:</span>
                  <Badge variant="outline" className="bg-blue-50">
                    {month.clientsServed}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MonthlyRevenueView;
