
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WhatsAppSetupInstructions = () => {
  return (
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
  );
};

export default WhatsAppSetupInstructions;
