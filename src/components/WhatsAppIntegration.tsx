
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useWhatsAppConfig } from '@/hooks/useWhatsAppConfig';
import WhatsAppStats from '@/components/whatsapp/WhatsAppStats';
import WhatsAppConversationFlow from '@/components/whatsapp/WhatsAppConversationFlow';
import WhatsAppSetupInstructions from '@/components/whatsapp/WhatsAppSetupInstructions';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WhatsAppIntegration = () => {
  const {
    isConnected,
    config,
    setConfig,
    stats,
    handleSaveConfig,
    copyWebhookUrl,
    testConnection
  } = useWhatsAppConfig();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integración WhatsApp</h2>
          <p className="text-gray-600">Configura las reservas automáticas por WhatsApp</p>
        </div>
        <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-2">
          {isConnected ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Conectado
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              Desconectado
            </>
          )}
        </Badge>
      </div>

      {/* Stats Cards */}
      <WhatsAppStats stats={stats} />

      <Alert>
        <AlertDescription>
          🔒 <strong>Configuración segura implementada:</strong> Las credenciales de WhatsApp ahora se manejan de forma segura en el backend. 
          Configure las siguientes variables en Supabase Secrets: WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation Flow */}
        <WhatsAppConversationFlow />
      </div>

      {/* Setup Instructions */}
      <WhatsAppSetupInstructions />
    </div>
  );
};

export default WhatsAppIntegration;
