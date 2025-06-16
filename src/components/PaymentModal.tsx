
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  CreditCard, 
  Gift, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  CheckCircle,
  Banknote
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getClientCompleteData,
  updateAppointmentStatus,
  redeemBonusService,
  createPayment,
  type Appointment,
  type Client,
  type ClientBonus,
  type Payment
} from '@/lib/supabase-helpers';

interface PaymentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  barberName: string;
}

type PaymentMethod = 'cash' | 'card' | 'bonus' | 'mixed';

interface PaymentBreakdown {
  method: PaymentMethod;
  cashAmount: number;
  cardAmount: number;
  selectedBonusId: string | null;
  total: number;
}

const PaymentModal = ({ appointment, isOpen, onClose, onPaymentComplete, barberName }: PaymentModalProps) => {
  const [clientData, setClientData] = useState<{
    client: Client | null;
    appointments: Appointment[];
    bonuses: ClientBonus[];
    payments: Payment[];
  }>({ client: null, appointments: [], bonuses: [], payments: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [paymentBreakdown, setPaymentBreakdown] = useState<PaymentBreakdown>({
    method: 'cash',
    cashAmount: 0,
    cardAmount: 0,
    selectedBonusId: null,
    total: 0
  });

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: 45 },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: 25 },
    { id: 'cut-beard', name: 'Corte + Barba', price: 65 },
    { id: 'shave', name: 'Afeitado Tradicional', price: 35 },
    { id: 'treatments', name: 'Tratamientos Especiales', price: 40 }
  ];

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  useEffect(() => {
    if (appointment?.client_id && isOpen) {
      loadClientData();
    }
  }, [appointment, isOpen]);

  useEffect(() => {
    if (appointment?.price) {
      setPaymentBreakdown(prev => ({
        ...prev,
        total: appointment.price || 0,
        cashAmount: prev.method === 'cash' ? appointment.price || 0 : 0,
        cardAmount: prev.method === 'card' ? appointment.price || 0 : 0
      }));
    }
  }, [appointment]);

  const loadClientData = async () => {
    if (!appointment?.client_id) return;
    
    setIsLoading(true);
    try {
      const data = await getClientCompleteData(appointment.client_id);
      setClientData(data);
    } catch (error) {
      console.error('Error al cargar datos del cliente:', error);
      toast.error('Error al cargar los datos del cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceInfo = (serviceId: string) => {
    return services.find(s => s.id === serviceId) || { name: serviceId, price: 0 };
  };

  const getLocationName = (locationId: string) => {
    return locations.find(l => l.id === locationId)?.name || locationId;
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    const servicePrice = appointment?.price || 0;
    
    setPaymentBreakdown(prev => ({
      ...prev,
      method,
      cashAmount: method === 'cash' ? servicePrice : 0,
      cardAmount: method === 'card' ? servicePrice : 0,
      selectedBonusId: method === 'bonus' ? (availableBonuses[0]?.id || null) : null
    }));
  };

  const handleMixedPaymentChange = (type: 'cash' | 'card', value: string) => {
    const numValue = parseFloat(value) || 0;
    const servicePrice = appointment?.price || 0;
    
    setPaymentBreakdown(prev => {
      const newBreakdown = { ...prev };
      
      if (type === 'cash') {
        newBreakdown.cashAmount = numValue;
        newBreakdown.cardAmount = Math.max(0, servicePrice - numValue);
      } else {
        newBreakdown.cardAmount = numValue;
        newBreakdown.cashAmount = Math.max(0, servicePrice - numValue);
      }
      
      return newBreakdown;
    });
  };

  const handleBonusSelection = (bonusId: string) => {
    setPaymentBreakdown(prev => ({
      ...prev,
      selectedBonusId: bonusId
    }));
  };

  const validatePayment = () => {
    const servicePrice = appointment?.price || 0;
    
    if (paymentBreakdown.method === 'bonus') {
      if (!paymentBreakdown.selectedBonusId) {
        toast.error('Selecciona un bono para usar');
        return false;
      }
      return true;
    }
    
    const totalPaid = paymentBreakdown.cashAmount + paymentBreakdown.cardAmount;
    
    if (totalPaid < servicePrice) {
      toast.error(`Faltan €${(servicePrice - totalPaid).toFixed(2)} por cobrar`);
      return false;
    }
    
    if (totalPaid > servicePrice) {
      toast.error(`Se está cobrando €${(totalPaid - servicePrice).toFixed(2)} de más`);
      return false;
    }
    
    return true;
  };

  const processPayment = async () => {
    if (!appointment || !validatePayment()) return;
    
    setIsProcessing(true);
    try {
      // 1. Si se usa bono, canjearlo
      if (paymentBreakdown.method === 'bonus' && paymentBreakdown.selectedBonusId) {
        const serviceInfo = getServiceInfo(appointment.service);
        await redeemBonusService({
          client_bonus_id: paymentBreakdown.selectedBonusId,
          appointment_id: appointment.id,
          redeemed_by_barber: barberName,
          service_name: serviceInfo.name
        });
      } else {
        // 2. Registrar pagos en efectivo/tarjeta
        if (paymentBreakdown.cashAmount > 0) {
          await createPayment({
            client_id: appointment.client_id!,
            appointment_id: appointment.id,
            amount: paymentBreakdown.cashAmount,
            payment_method: 'efectivo',
            payment_status: 'completado'
          });
        }
        
        if (paymentBreakdown.cardAmount > 0) {
          await createPayment({
            client_id: appointment.client_id!,
            appointment_id: appointment.id,
            amount: paymentBreakdown.cardAmount,
            payment_method: 'tarjeta',
            payment_status: 'completado'
          });
        }
      }
      
      // 3. Marcar cita como completada
      await updateAppointmentStatus(appointment.id, 'completada');
      
      toast.success('Pago procesado correctamente');
      onPaymentComplete();
      onClose();
      
    } catch (error) {
      console.error('Error al procesar pago:', error);
      toast.error('Error al procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const availableBonuses = clientData.bonuses.filter(
    bonus => bonus.status === 'activo' && bonus.services_remaining > 0
  );

  if (!appointment) return null;

  const serviceInfo = getServiceInfo(appointment.service);
  const servicePrice = appointment.price || serviceInfo.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-barbershop-gold" />
            Procesar Pago del Servicio
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-barbershop-gold mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando datos del cliente...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Información del servicio */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalles del Servicio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{appointment.appointment_date} - {appointment.appointment_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{getLocationName(appointment.location)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-barbershop-gold/10 rounded-lg">
                  <span className="font-semibold">{serviceInfo.name}</span>
                  <span className="text-2xl font-bold text-barbershop-gold">€{servicePrice}</span>
                </div>
              </CardContent>
            </Card>

            {/* Información del cliente */}
            {clientData.client && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Datos del Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{clientData.client.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{clientData.client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{clientData.client.email}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Método de pago */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Método de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup 
                  value={paymentBreakdown.method} 
                  onValueChange={(value) => handlePaymentMethodChange(value as PaymentMethod)}
                  className="space-y-4"
                >
                  {/* Efectivo */}
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Banknote className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Efectivo completo</span>
                      <span className="text-muted-foreground">- €{servicePrice}</span>
                    </Label>
                  </div>

                  {/* Tarjeta */}
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Tarjeta completa</span>
                      <span className="text-muted-foreground">- €{servicePrice}</span>
                    </Label>
                  </div>

                  {/* Pago mixto */}
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <Label htmlFor="mixed" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="flex items-center gap-1">
                        <Banknote className="w-4 h-4 text-green-600" />
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Pago mixto (Efectivo + Tarjeta)</span>
                    </Label>
                  </div>

                  {/* Bono */}
                  {availableBonuses.length > 0 && (
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="bonus" id="bonus" />
                      <Label htmlFor="bonus" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Gift className="w-5 h-5 text-barbershop-gold" />
                        <span className="font-medium">Usar Bono</span>
                        <Badge className="bg-green-100 text-green-800">
                          {availableBonuses.length} disponible{availableBonuses.length > 1 ? 's' : ''}
                        </Badge>
                      </Label>
                    </div>
                  )}
                </RadioGroup>

                {/* Detalles del pago mixto */}
                {paymentBreakdown.method === 'mixed' && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h4 className="font-medium">Distribución del pago</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mixed-cash" className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-green-600" />
                          Efectivo (€)
                        </Label>
                        <Input
                          id="mixed-cash"
                          type="number"
                          step="0.01"
                          min="0"
                          max={servicePrice}
                          value={paymentBreakdown.cashAmount}
                          onChange={(e) => handleMixedPaymentChange('cash', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mixed-card" className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          Tarjeta (€)
                        </Label>
                        <Input
                          id="mixed-card"
                          type="number"
                          step="0.01"
                          min="0"
                          max={servicePrice}
                          value={paymentBreakdown.cardAmount}
                          onChange={(e) => handleMixedPaymentChange('card', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Selección de bono */}
                {paymentBreakdown.method === 'bonus' && availableBonuses.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h4 className="font-medium">Seleccionar Bono</h4>
                    <div className="space-y-2">
                      {availableBonuses.map((bonus) => (
                        <div 
                          key={bonus.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            paymentBreakdown.selectedBonusId === bonus.id 
                              ? 'border-barbershop-gold bg-barbershop-gold/10' 
                              : 'border-gray-200 hover:border-barbershop-gold/50'
                          }`}
                          onClick={() => handleBonusSelection(bonus.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Bono de Servicios</div>
                              <div className="text-sm text-muted-foreground">
                                {bonus.services_remaining} servicios restantes
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Vendido por: {bonus.sold_by_barber}
                              </div>
                            </div>
                            {paymentBreakdown.selectedBonusId === bonus.id && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />
                
                {/* Resumen del pago */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Precio del servicio:</span>
                    <span>€{servicePrice}</span>
                  </div>
                  
                  {paymentBreakdown.method === 'bonus' ? (
                    <div className="flex justify-between text-sm font-medium text-green-600">
                      <span>Pagado con bono:</span>
                      <span>€{servicePrice}</span>
                    </div>
                  ) : (
                    <>
                      {paymentBreakdown.cashAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Efectivo:</span>
                          <span>€{paymentBreakdown.cashAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {paymentBreakdown.cardAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Tarjeta:</span>
                          <span>€{paymentBreakdown.cardAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total a pagar:</span>
                    <span className="text-barbershop-gold">
                      €{paymentBreakdown.method === 'bonus' ? '0.00' : (paymentBreakdown.cashAmount + paymentBreakdown.cardAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={processPayment}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar Pago
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
