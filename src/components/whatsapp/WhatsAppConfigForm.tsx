
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Copy } from 'lucide-react';

interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  verifyToken: string;
  webhookUrl: string;
  isActive: boolean;
}

interface WhatsAppConfigFormProps {
  config: WhatsAppConfig;
  setConfig: (config: WhatsAppConfig) => void;
  onSaveConfig: () => void;
  onCopyWebhookUrl: () => void;
  onTestConnection: () => void;
}

const WhatsAppConfigForm = ({ 
  config, 
  setConfig, 
  onSaveConfig, 
  onCopyWebhookUrl, 
  onTestConnection 
}: WhatsAppConfigFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuración de API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="accessToken">Access Token de WhatsApp</Label>
          <Input
            id="accessToken"
            type="password"
            placeholder="Tu token de acceso de WhatsApp Business API"
            value={config.accessToken}
            onChange={(e) => setConfig({...config, accessToken: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="phoneNumberId">Phone Number ID</Label>
          <Input
            id="phoneNumberId"
            placeholder="ID del número de teléfono de WhatsApp"
            value={config.phoneNumberId}
            onChange={(e) => setConfig({...config, phoneNumberId: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="verifyToken">Verify Token</Label>
          <Input
            id="verifyToken"
            placeholder="Token de verificación para el webhook"
            value={config.verifyToken}
            onChange={(e) => setConfig({...config, verifyToken: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="webhookUrl">URL del Webhook</Label>
          <div className="flex gap-2">
            <Input
              id="webhookUrl"
              value={`${window.location.origin}/functions/v1/whatsapp-webhook`}
              readOnly
              className="bg-gray-50"
            />
            <Button variant="outline" size="icon" onClick={onCopyWebhookUrl}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Usa esta URL como webhook en tu configuración de WhatsApp Business API
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isActive">Activar Integración</Label>
          <Switch
            id="isActive"
            checked={config.isActive}
            onCheckedChange={(checked) => setConfig({...config, isActive: checked})}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={onSaveConfig} className="flex-1">
            Guardar Configuración
          </Button>
          <Button variant="outline" onClick={onTestConnection}>
            Probar Conexión
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppConfigForm;
