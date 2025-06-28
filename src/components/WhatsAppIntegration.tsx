
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useWhatsAppConfig } from '@/hooks/useWhatsAppConfig';
import WhatsAppStats from '@/components/whatsapp/WhatsAppStats';
import WhatsAppConfigForm from '@/components/whatsapp/WhatsAppConfigForm';
import WhatsAppConversationFlow from '@/components/whatsapp/WhatsAppConversationFlow';
import WhatsAppSetupInstructions from '@/components/whatsapp/WhatsAppSetupInstructions';

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <WhatsAppConfigForm
          config={config}
          setConfig={setConfig}
          onSaveConfig={handleSaveConfig}
          onCopyWebhookUrl={copyWebhookUrl}
          onTestConnection={testConnection}
        />

        {/* Conversation Flow */}
        <WhatsAppConversationFlow />
      </div>

      {/* Setup Instructions */}
      <WhatsAppSetupInstructions />
    </div>
  );
};

export default WhatsAppIntegration;
