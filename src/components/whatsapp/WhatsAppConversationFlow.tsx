
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const WhatsAppConversationFlow = () => {
  return (
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
  );
};

export default WhatsAppConversationFlow;
