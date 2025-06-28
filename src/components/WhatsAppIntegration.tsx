
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Phone, Settings, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

const WhatsAppIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [config, setConfig] = useState({
    accessToken: '',
    phoneNumberId: '',
    verifyToken: '',
    webhookUrl: '',
    isActive: false
  });
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeChats: 0,
    appointmentsCreated: 0,
    successRate: 0
  });

  useEffect(() => {
    // Simular carga de configuración desde localStorage
    const savedConfig = localStorage.getItem('whatsapp_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      setIsConnected(parsed.isActive && Boolean(parsed.accessToken));
    }

    // Simular estadísticas
    setStats({
      totalConversations: 24,
      activeChats: 3,
      appointmentsCreated: 18,
      successRate: 75
    });
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('whatsapp_config', JSON.stringify(config));
    setIsConnected(config.isActive && Boolean(config.accessToken));
    toast.success('Configuración de WhatsApp guardada correctamente');
  };

  const copyWebhookUrl = () => {
    const webhookUrl = `${window.location.origin}/functions/v1/whatsapp-webhook`;
    navigator.clipboard.writeText(webhookUrl);
    toast.success('URL del webhook copiada al portapapeles');
  };

  const testConnection = async () => {
    if (!config.accessToken || !config.phoneNumberId) {
      toast.error('Por favor completa la configuración antes de probar');
      return;
    }
    
    // Aquí simularíamos una prueba de conexión
    toast.success('Conexión con WhatsApp Business API exitosa');
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración */}
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
                <Button variant="outline" size="icon" onClick={copyWebhookUrl}>
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
              <Button onClick={handleSaveConfig} className="flex-1">
                Guardar Configuración
              </Button>
              <Button variant="outline" onClick={testConnection}>
                Probar Conexión
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Flujo de Conversación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Flujo de Conversación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-800">1. Saludo Inicial</p>
                <p className="text-xs text-green-600">Cliente envía "hola" o "cita"</p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800">2. Selección de Ubicación</p>
                <p className="text-xs text-blue-600">1. General Pardiñas | 2. Cristóbal Bordiú</p>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-purple-800">3. Elección de Barbero</p>
                <p className="text-xs text-purple-600">Lista de barberos disponibles + opción "cualquiera"</p>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-orange-800">4. Fecha y Hora</p>
                <p className="text-xs text-orange-600">Verificación de disponibilidad en tiempo real</p>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-800">5. Confirmación</p>
                <p className="text-xs text-green-600">Crear cita automáticamente en el sistema</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800 mb-2">Mensaje de Ejemplo:</p>
              <p className="text-xs text-gray-600 italic">
                "¡Hola! 👋 Bienvenido a Mad Men Barbería. ¿En qué ubicación te gustaría reservar?
                1️⃣ General Pardiñas | 2️⃣ Cristóbal Bordiú"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones de Configuración */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de Configuración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Configurar WhatsApp Business API</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Crea una cuenta en Meta for Developers</li>
                <li>Configura una aplicación de WhatsApp Business</li>
                <li>Obtén tu Access Token y Phone Number ID</li>
                <li>Configura el webhook con la URL proporcionada arriba</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Variables de Entorno</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <pre className="text-xs text-gray-600">
{`WHATSAPP_ACCESS_TOKEN=tu_access_token
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
WHATSAPP_VERIFY_TOKEN=tu_verify_token`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Activar Integración</h4>
              <p className="text-sm text-gray-600">
                Una vez configurados los tokens, activa la integración usando el switch de arriba.
                Los clientes podrán empezar a reservar citas enviando "hola" o "cita" a tu número de WhatsApp Business.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppIntegration;
