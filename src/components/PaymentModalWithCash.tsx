import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Banknote,
  Calculator,
  Euro
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
import {
  getCashRegisterState,
  calculateOptimalChange,
  processSaleTransaction,
  type CashRegisterState,
  type ChangeCalculation
} from '@/lib/cashRegisterHelpers';

interface PaymentModalWithCashProps {
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

const PaymentModalWithCash: React.FC<PaymentModalWithCashProps> = ({ 
  appointment, 
  isOpen, 
  onClose, 
  onPaymentComplete, 
  barberName 
}) => {
  const { toast } = useToast();
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

  // Estados para el sistema de caja
  const [cashState, setCashState] = useState<CashRegisterState[]>([]);
  const [paymentReceived, setPaymentReceived] = useState('');
  const [suggestedChange, setSuggestedChange] = useState<ChangeCalculation[]>([]);
  const [showCashRegister, setShowCashRegister] = useState(false);

  // Referencias para los inputs
  const cashInputRef = useRef<HTMLInputElement>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: 45 },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: 25 },
    { id: 'cut-beard', name: 'Corte + Barba', price: 65 },
    { id: 'shave', name: 'Afeitado Tradicional', price: 35 },
    { id: 'treatments', name: 'Tratamientos Especiales', price: 40 },
    // Mapeos adicionales para nombres de servicios
    { id: 'Corte Clásico', name: 'Corte Clásico', price: 45 },
    { id: 'Arreglo de Barba', name: 'Arreglo de Barba', price: 25 },
    { id: 'Corte + Barba', name: 'Corte + Barba', price: 65 },
    { id: 'Afeitado Tradicional', name: 'Afeitado Tradicional', price: 35 },
    { id: 'Tratamientos Especiales', name: 'Tratamientos Especiales', price: 40 }
  ];

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  useEffect(() => {
    if (appointment?.client_id && isOpen) {
      loadClientData();
      loadCashRegisterData();
    }
  }, [appointment, isOpen]);

  useEffect(() => {
    if (appointment) {
      // Obtener precio del servicio, ya sea del appointment o del mapeo de servicios
      const serviceInfo = getServiceInfo(appointment.service);
      const servicePrice = appointment.price || serviceInfo.price;
      
      setPaymentBreakdown(prev => {
        const newBreakdown = {
          ...prev,
          total: servicePrice,
          cashAmount: prev.method === 'cash' ? servicePrice : prev.method === 'mixed' ? servicePrice : 0,
          cardAmount: prev.method === 'card' ? servicePrice : 0
        };
        
        // Activar automáticamente el sistema de caja si el método es efectivo
        if (prev.method === 'cash' || prev.method === 'mixed') {
          setShowCashRegister(true);
        }
        
        return newBreakdown;
      });
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
      toast({
        title: "Error",
        description: "Error al cargar los datos del cliente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCashRegisterData = async () => {
    if (!appointment?.location) return;
    
    try {
      const cashData = await getCashRegisterState(appointment.location);
      setCashState(cashData);
    } catch (error) {
      console.error('Error al cargar estado de caja:', error);
    }
  };

  const getServiceInfo = (serviceId: string) => {
    return services.find(s => s.id === serviceId) || { name: serviceId, price: 0 };
  };

  const getLocationName = (locationId: string) => {
    return locations.find(l => l.id === locationId)?.name || locationId;
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    const serviceInfo = getServiceInfo(appointment?.service || '');
    const servicePrice = appointment?.price || serviceInfo.price;
    
    setPaymentBreakdown(prev => ({
      ...prev,
      method,
      cashAmount: method === 'cash' ? servicePrice : method === 'mixed' ? servicePrice : 0,
      cardAmount: method === 'card' ? servicePrice : 0,
      selectedBonusId: method === 'bonus' ? (availableBonuses[0]?.id || null) : null
    }));

    // Mostrar sistema de caja automáticamente si el pago incluye efectivo
    setShowCashRegister(method === 'cash' || method === 'mixed');
    
    // Limpiar cálculos de cambio
    setSuggestedChange([]);
    setPaymentReceived('');
  };

  const calculateChange = () => {
    if (!showCashRegister) return;
    
    const received = parseFloat(paymentReceived);
    const cashAmount = paymentBreakdown.cashAmount;
    
    if (isNaN(received) || received < cashAmount) {
      toast({
        title: "Error",
        description: "El monto recibido debe ser mayor o igual al monto en efectivo",
        variant: "destructive"
      });
      return;
    }

    const changeAmount = received - cashAmount;
    if (changeAmount === 0) {
      setSuggestedChange([]);
      return;
    }

    const optimalChange = calculateOptimalChange(changeAmount, cashState);
    
    // Verificar si se puede dar el cambio exacto
    const totalChange = optimalChange.reduce(
      (sum, item) => sum + (item.denomination.value * item.quantity), 
      0
    );
    
    if (Math.abs(totalChange - changeAmount) > 0.01) {
      toast({
        title: "Advertencia",
        description: "No hay suficiente cambio en caja para dar el monto exacto",
        variant: "destructive"
      });
    }

    setSuggestedChange(optimalChange);
  };

  const handleMixedPaymentChange = (type: 'cash' | 'card', value: string) => {
    const numValue = parseFloat(value) || 0;
    const serviceInfo = getServiceInfo(appointment?.service || '');
    const servicePrice = appointment?.price || serviceInfo.price;
    
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

    // Limpiar cálculos de cambio si cambia el monto en efectivo
    if (type === 'cash') {
      setSuggestedChange([]);
      setPaymentReceived('');
    }
  };

  const validatePayment = () => {
    const serviceInfo = getServiceInfo(appointment?.service || '');
    const servicePrice = appointment?.price || serviceInfo.price;
    
    if (paymentBreakdown.method === 'bonus') {
      if (!paymentBreakdown.selectedBonusId) {
        toast({
          title: "Error",
          description: "Selecciona un bono para usar",
          variant: "destructive"
        });
        return false;
      }
      return true;
    }
    
    const totalPaid = paymentBreakdown.cashAmount + paymentBreakdown.cardAmount;
    
    if (totalPaid < servicePrice) {
      toast({
        title: "Error", 
        description: `Faltan €${(servicePrice - totalPaid).toFixed(2)} por cobrar`,
        variant: "destructive"
      });
      return false;
    }
    
    if (totalPaid > servicePrice) {
      toast({
        title: "Error",
        description: `Se está cobrando €${(totalPaid - servicePrice).toFixed(2)} de más`,
        variant: "destructive"
      });
      return false;
    }

    // Para pagos en efectivo, es OBLIGATORIO usar el sistema de caja
    if (paymentBreakdown.cashAmount > 0) {
      const received = parseFloat(paymentReceived);
      if (isNaN(received) || received < paymentBreakdown.cashAmount) {
        toast({
          title: "Error",
          description: "Para pagos en efectivo debe ingresar el monto recibido y calcular el cambio en el Sistema de Caja",
          variant: "destructive"
        });
        return false;
      }
      
      // Verificar que se haya calculado el cambio
      if (suggestedChange.length === 0 && received > paymentBreakdown.cashAmount) {
        toast({
          title: "Error", 
          description: "Debe calcular el cambio exacto con billetes y monedas",
          variant: "destructive"
        });
        return false;
      }
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
        // 2. Procesar venta con sistema de caja si hay efectivo
        if (paymentBreakdown.cashAmount > 0) {
          const received = parseFloat(paymentReceived);
          await processSaleTransaction(
            appointment.id,
            paymentBreakdown.cashAmount,
            received,
            suggestedChange,
            appointment.location,
            barberName
          );
        }

        // 3. Registrar pagos
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
      
      // 4. Marcar cita como completada
      await updateAppointmentStatus(appointment.id, 'completada');
      
      toast({
        title: "Éxito",
        description: "Pago procesado correctamente",
      });
      onPaymentComplete();
      onClose();
      
    } catch (error) {
      console.error('Error al procesar pago:', error);
      toast({
        title: "Error",
        description: "Error al procesar el pago",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const availableBonuses = clientData.bonuses.filter(
    bonus => bonus.status === 'activo' && bonus.services_remaining > 0
  );

  if (!appointment) return null;

  const serviceInfo = getServiceInfo(appointment.service);
  const servicePrice = appointment.price || serviceInfo.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Procesar Pago del Servicio
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando datos del cliente...</p>
          </div>
        ) : (
          <Tabs defaultValue="payment" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payment">Pago</TabsTrigger>
              <TabsTrigger value="cash-register" disabled={!showCashRegister}>
                <Calculator className="w-4 h-4 mr-2" />
                Sistema de Caja {showCashRegister && <span className="text-red-500">*</span>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="payment" className="space-y-6">
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
                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <span className="font-semibold">{serviceInfo.name}</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(servicePrice)}</span>
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
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Banknote className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Efectivo completo</span>
                        <span className="text-sm text-red-500">(Requiere Sistema de Caja)</span>
                        <span className="text-muted-foreground">- {formatCurrency(servicePrice)}</span>
                      </Label>
                    </div>

                    {/* Tarjeta */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Tarjeta completa</span>
                        <span className="text-muted-foreground">- {formatCurrency(servicePrice)}</span>
                      </Label>
                    </div>

                    {/* Pago mixto */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
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
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                        <RadioGroupItem value="bonus" id="bonus" />
                        <Label htmlFor="bonus" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Gift className="w-5 h-5 text-primary" />
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
                    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                      <h4 className="font-medium">Distribución del pago</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="mixed-cash" className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-green-600" />
                            Efectivo (€)
                          </Label>
                          <Input
                            ref={cashInputRef}
                            id="mixed-cash"
                            type="number"
                            step="0.01"
                            min="0"
                            max={servicePrice}
                            value={paymentBreakdown.cashAmount}
                            onChange={(e) => handleMixedPaymentChange('cash', e.target.value)}
                            className="mt-1 text-lg font-medium"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="mixed-card" className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            Tarjeta (€)
                          </Label>
                          <Input
                            ref={cardInputRef}
                            id="mixed-card"
                            type="number"
                            step="0.01"
                            min="0"
                            max={servicePrice}
                            value={paymentBreakdown.cardAmount}
                            onChange={(e) => handleMixedPaymentChange('card', e.target.value)}
                            className="mt-1 text-lg font-medium"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selección de bono */}
                  {paymentBreakdown.method === 'bonus' && availableBonuses.length > 0 && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                      <h4 className="font-medium">Seleccionar Bono</h4>
                      <div className="space-y-2">
                        {availableBonuses.map((bonus) => (
                          <div 
                            key={bonus.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              paymentBreakdown.selectedBonusId === bonus.id 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setPaymentBreakdown(prev => ({ ...prev, selectedBonusId: bonus.id }))}
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cash-register" className="space-y-6">
              {showCashRegister && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Euro className="w-5 h-5" />
                      Cálculo de Cambio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Monto a cobrar en efectivo</Label>
                        <Input
                          value={formatCurrency(paymentBreakdown.cashAmount)}
                          disabled
                          className="text-lg font-bold"
                        />
                      </div>
                      <div>
                        <Label htmlFor="received">Dinero recibido del cliente</Label>
                        <Input
                          id="received"
                          type="number"
                          step="0.01"
                          value={paymentReceived}
                          onChange={(e) => setPaymentReceived(e.target.value)}
                          placeholder="0.00"
                          className="text-lg font-medium"
                        />
                      </div>
                    </div>
                    
                    <Button onClick={calculateChange} className="w-full">
                      <Calculator className="w-4 h-4 mr-2" />
                      Calcular Cambio
                    </Button>

                    {suggestedChange.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Cambio a entregar</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {suggestedChange.map((item, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span>
                                  {formatCurrency(item.denomination.value)} 
                                  ({item.denomination.type === 'bill' ? 'Billete' : 'Moneda'})
                                </span>
                                <span className="font-semibold">
                                  {item.quantity} unidades
                                </span>
                              </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between items-center font-bold text-lg">
                              <span>Total Cambio:</span>
                              <span className="text-primary">
                                {formatCurrency(
                                  suggestedChange.reduce(
                                    (sum, item) => sum + (item.denomination.value * item.quantity),
                                    0
                                  )
                                )}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

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
            className="flex-1"
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
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModalWithCash;