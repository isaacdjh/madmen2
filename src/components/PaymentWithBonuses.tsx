
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Gift, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { getClientActiveBonuses, redeemBonusService, createPayment } from '@/lib/supabase-helpers';
import type { ClientBonus } from '@/lib/supabase-helpers';

interface PaymentWithBonusesProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  clientId: string | null;
  serviceName: string;
  servicePrice: number;
  barber: string;
  onPaymentComplete: () => void;
}

const PaymentWithBonuses = ({
  isOpen,
  onClose,
  appointmentId,
  clientId,
  serviceName,
  servicePrice,
  barber,
  onPaymentComplete
}: PaymentWithBonusesProps) => {
  const [activeBonuses, setActiveBonuses] = useState<ClientBonus[]>([]);
  const [selectedBonus, setSelectedBonus] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');
  const [useBonus, setUseBonus] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && clientId) {
      loadClientBonuses();
    }
  }, [isOpen, clientId]);

  const loadClientBonuses = async () => {
    if (!clientId) return;
    
    try {
      const bonuses = await getClientActiveBonuses(clientId);
      setActiveBonuses(bonuses);
      
      // Si hay bonos disponibles, sugerir usarlos
      if (bonuses.length > 0) {
        setUseBonus(true);
        setSelectedBonus(bonuses[0].id);
      }
    } catch (error) {
      console.error('Error loading client bonuses:', error);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      if (useBonus && selectedBonus && clientId) {
        // Canjear servicio con bono
        await redeemBonusService({
          client_bonus_id: selectedBonus,
          appointment_id: appointmentId,
          service_name: serviceName,
          redeemed_by_barber: barber
        });
      } else if (clientId) {
        // Pago normal
        await createPayment({
          client_id: clientId,
          appointment_id: appointmentId,
          amount: servicePrice,
          payment_method: paymentMethod,
          payment_status: 'completado'
        });
      }

      onPaymentComplete();
      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'efectivo':
        return <Banknote className="w-4 h-4" />;
      case 'tarjeta':
        return <CreditCard className="w-4 h-4" />;
      case 'transferencia':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Procesar Pago</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Details */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{serviceName}</div>
                  <div className="text-sm text-muted-foreground">Barbero: {barber}</div>
                </div>
                <div className="text-lg font-bold text-barbershop-gold">
                  €{servicePrice.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bonus Options */}
          {clientId && activeBonuses.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Gift className="w-4 h-4 mr-2 text-green-600" />
                  Bonos Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="use-bonus"
                    checked={useBonus}
                    onChange={(e) => setUseBonus(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="use-bonus">Usar bono para este servicio</Label>
                </div>

                {useBonus && (
                  <Select value={selectedBonus} onValueChange={setSelectedBonus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar bono" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeBonuses.map((bonus) => (
                        <SelectItem key={bonus.id} value={bonus.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>Bono - {bonus.services_remaining} servicios restantes</span>
                            <Badge className="ml-2 bg-green-100 text-green-800">
                              Activo
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          {!useBonus && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as 'efectivo' | 'tarjeta' | 'transferencia')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="efectivo" id="efectivo" />
                    <Label htmlFor="efectivo" className="flex items-center">
                      <Banknote className="w-4 h-4 mr-2" />
                      Efectivo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tarjeta" id="tarjeta" />
                    <Label htmlFor="tarjeta" className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Tarjeta
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transferencia" id="transferencia" />
                    <Label htmlFor="transferencia" className="flex items-center">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Transferencia
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Payment Summary */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total a Pagar:</span>
                <span className={useBonus ? 'text-green-600' : 'text-barbershop-gold'}>
                  {useBonus ? 'GRATIS (Bono)' : `€${servicePrice.toFixed(2)}`}
                </span>
              </div>
              {useBonus && (
                <div className="text-sm text-muted-foreground mt-1">
                  Se descontará 1 servicio del bono seleccionado
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing || (useBonus && !selectedBonus)}
              className="flex-1"
            >
              {isProcessing ? 'Procesando...' : useBonus ? 'Canjear Bono' : 'Procesar Pago'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentWithBonuses;
