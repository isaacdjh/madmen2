
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Phone, CheckCircle, Settings } from 'lucide-react';

interface WhatsAppStatsProps {
  stats: {
    totalConversations: number;
    activeChats: number;
    appointmentsCreated: number;
    successRate: number;
  };
}

const WhatsAppStats = ({ stats }: WhatsAppStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Conversaciones</p>
              <p className="text-2xl font-bold">{stats.totalConversations}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Chats Activos</p>
              <p className="text-2xl font-bold">{stats.activeChats}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Citas Creadas</p>
              <p className="text-2xl font-bold">{stats.appointmentsCreated}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Tasa de Éxito</p>
              <p className="text-2xl font-bold">{stats.successRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppStats;
