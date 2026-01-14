import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Euro, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MonthlyRevenueViewProps {
  barberId?: string;
  barberName?: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  servicesCount: number;
}

const MonthlyRevenueView = ({ barberId, barberName }: MonthlyRevenueViewProps) => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMonthlyData();
  }, [barberId]);

  const loadMonthlyData = async () => {
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .eq('status', 'completada');

      if (barberName) {
        query = query.eq('barber', barberName);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group by month
      const grouped = (data || []).reduce((acc: Record<string, MonthlyData>, apt) => {
        const month = apt.appointment_date.substring(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = { month, revenue: 0, servicesCount: 0 };
        }
        acc[month].revenue += apt.price || 0;
        acc[month].servicesCount += 1;
        return acc;
      }, {});

      setMonthlyData(Object.values(grouped).sort((a, b) => b.month.localeCompare(a.month)));
    } catch (error) {
      console.error('Error loading monthly data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando datos mensuales...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Ingresos Mensuales {barberName ? `- ${barberName}` : ''}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {monthlyData.map((data) => (
          <Card key={data.month}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(data.month + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600 flex items-center gap-1">
                  <Euro className="w-5 h-5" />
                  {data.revenue.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">{data.servicesCount} servicios</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {monthlyData.length === 0 && (
        <p className="text-center text-gray-500">No hay datos mensuales disponibles</p>
      )}
    </div>
  );
};

export default MonthlyRevenueView;
