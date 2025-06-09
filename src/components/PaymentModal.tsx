
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Plus,
  Minus
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

interface PaymentBreakdown {
  cash: number;
  card: number;
  bonusUsed: boolean;
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
    cash: 0,
    card: 0,
    bonusUsed: false,
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
        cash: appointment.price || 0
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

  const handlePaymentChange = (type: 'cash' | 'card', value: string) => {
    const numValue = parseFloat(value) || 0;
    const servicePrice = appointment?.price || 0;
    
    setPaymentBreakdown(prev => {
      const newBreakdown = { ...prev };
      
      if (type === 'cash') {
        newBreakdown.cash = numValue;
        // Ajustar tarjeta automáticamente
        const remainingAfterBonus = prev.bonusUsed ? 0 : servicePrice;
        newBreakdown.card = Math.max(0, remainingAfterBonus - numValue);
      } else {
        newBreakdown.card = numValue;
        // Ajustar efectivo automáticamente
        const remainingAfterBonus = prev.bonusUsed ? 0 : servicePrice;
        newBreakdown.cash = Math.max(0, remainingAfterBonus - numValue);
      }
      
      return newBreakdown;
    });
  };

  const handleBonusToggle = (bonusId: string | null = null) => {
    setPaymentBreakdown(prev => {
      const newBreakdown = { ...prev };
      
      if (prev.bonusUsed && prev.selectedBonusId === bonusId) {
        // Desactivar bono
        newBreakdown.bonusUsed = false;
        newBreakdown.selectedBonusId = null;
        newBreakdown.cash = appointment?.price || 0;
        newBreakdown.card = 0;
      } else {
        // Activar bono
        newBreakdown.bonusUsed = true;
        newBreakdown.selectedBonusId = bonusId;
        newBreakdown.cash = 0;
        newBreakdown.card = 0;
      }
      
      return newBreakdown;
    });
  };

  const validatePayment = () => {
    const servicePrice = appointment?.price || 0;
    const totalPaid = paymentBreakdown.cash + paymentBreakdown.card;
    
    if (paymentBreakdown.bonusUsed) {
      if (!paymentBreakdown.selectedBonusId) {
        toast.error('Selecciona un bono para usar');
        return false;
      }
      // Con bono, no se necesita pago adicional
      return true;
    }
    
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
      if (paymentBreakdown.bonusUsed && paymentBreakdown.selectedBonusId) {
        const serviceInfo = getServiceInfo(appointment.service);
        await redeemBonusService({
          client_bonus_id: paymentBreakdown.selectedBonusId,
          appointment_id: appointment.id,
          redeemed_by_barber: barberName,
          service_name: serviceInfo.name
        });
      }
      
      // 2. Registrar pagos en efectivo/tarjeta si los hay
      if (paymentBreakdown.cash > 0) {
        await createPayment({
          client_id: appointment.client_id!,
          appointment_id: appointment.id,
          amount: paymentBreakdown.cash,
          payment_method: 'efectivo',
          payment_status: 'completado'
        });
      }
      
      if (paymentBreakdown.card > 0) {
        await createPayment({
          client_id: appointment.client_id!,
          appointment_id: appointment.id,
          amount: paymentBreakdown.card,
          payment_method: 'tarjeta',
          payment_status: 'completado'
        });
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

            {/* Bonos disponibles */}
            {availableBonuses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="w-5 h-5 text-barbershop-gold" />
                    Bonos Disponibles ({availableBonuses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availableBonuses.map((bonus) => (
                      <div 
                        key={bonus.id} 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          paymentBreakdown.selectedBonusId === bonus.id 
                            ? 'border-barbershop-gold bg-barbershop-gold/10' 
                            : 'border-gray-200 hover:border-barbershop-gold/50'
                        }`}
                        onClick={() => handleBonusToggle(bonus.id)}
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
                          <div className="flex items-center gap-2">
                            {paymentBreakdown.selectedBonusId === bonus.id && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            <Badge className="bg-green-100 text-green-800">
                              Disponible
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sistema de pago */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Método de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!paymentBreakdown.bonusUsed && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cash-amount" className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Efectivo (€)
                        </Label>
                        <Input
                          id="cash-amount"
                          type="number"
                          step="0.01"
                          min="0"
                          value={paymentBreakdown.cash}
                          onChange={(e) => handlePaymentChange('cash', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-amount" className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Tarjeta (€)
                        </Label>
                        <Input
                          id="card-amount"
                          type="number"
                          step="0.01"
                          min="0"
                          value={paymentBreakdown.card}
                          onChange={(e) => handlePaymentChange('card', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <Separator />
                  </>
                )}
                
                {/* Resumen del pago */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Precio del servicio:</span>
                    <span>€{servicePrice}</span>
                  </div>
                  
                  {paymentBreakdown.bonusUsed ? (
                    <div className="flex justify-between text-sm font-medium text-green-600">
                      <span>Pagado con bono:</span>
                      <span>€{servicePrice}</span>
                    </div>
                  ) : (
                    <>
                      {paymentBreakdown.cash > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Efectivo:</span>
                          <span>€{paymentBreakdown.cash}</span>
                        </div>
                      )}
                      {paymentBreakdown.card > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Tarjeta:</span>
                          <span>€{paymentBreakdown.card}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total a pagar:</span>
                    <span className="text-barbershop-gold">
                      €{paymentBreakdown.bonusUsed ? 0 : (paymentBreakdown.cash + paymentBreakdown.card)}
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
