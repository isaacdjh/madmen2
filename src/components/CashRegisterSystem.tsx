import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  getDenominations,
  getCashRegisterState,
  calculateOptimalChange,
  updateCashRegisterState,
  createCashRegisterEntry,
  processSaleTransaction,
  getDailyReport,
  type Denomination,
  type CashRegisterState,
  type ChangeCalculation
} from '@/lib/cashRegisterHelpers';
import { Calculator, Euro, TrendingUp, FileText } from 'lucide-react';
import CashInventoryManager from './CashInventoryManager';

const CashRegisterSystem: React.FC = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState('cristobal-bordiu');
  const [denominations, setDenominations] = useState<Denomination[]>([]);
  const [cashState, setCashState] = useState<CashRegisterState[]>([]);
  const [saleAmount, setSaleAmount] = useState('');
  const [paymentReceived, setPaymentReceived] = useState('');
  const [suggestedChange, setSuggestedChange] = useState<ChangeCalculation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [location]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [denominationsData, cashStateData] = await Promise.all([
        getDenominations(),
        getCashRegisterState(location)
      ]);
      
      setDenominations(denominationsData);
      setCashState(cashStateData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar datos de caja",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = () => {
    const sale = parseFloat(saleAmount);
    const received = parseFloat(paymentReceived);
    
    if (isNaN(sale) || isNaN(received) || received < sale) {
      toast({
        title: "Error",
        description: "Verifique los montos ingresados",
        variant: "destructive"
      });
      return;
    }

    const changeAmount = received - sale;
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

  const processSale = async () => {
    try {
      setLoading(true);
      const sale = parseFloat(saleAmount);
      const received = parseFloat(paymentReceived);
      
      if (isNaN(sale) || isNaN(received)) {
        throw new Error("Montos inválidos");
      }

      // Procesar la venta
      await processSaleTransaction(
        '', // appointmentId - se puede hacer opcional
        sale,
        received,
        suggestedChange,
        location
      );

      toast({
        title: "Éxito",
        description: "Venta procesada correctamente",
      });

      // Recargar estado de caja
      await loadInitialData();
      
      // Limpiar formulario
      setSaleAmount('');
      setPaymentReceived('');
      setSuggestedChange([]);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al procesar la venta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCashQuantity = async (denominationId: string, newQuantity: number) => {
    try {
      await updateCashRegisterState(denominationId, newQuantity, location);
      await loadInitialData();
      
      toast({
        title: "Éxito",
        description: "Cantidad actualizada",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar cantidad",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTotalCashValue = () => {
    return cashState.reduce(
      (total, item) => total + (item.denomination.value * item.quantity),
      0
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sistema de Caja</h1>
        <select 
          value={location} 
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="cristobal-bordiu">Cristóbal Bordíu 29</option>
          <option value="general-pardinas">General Pardiñas 101</option>
        </select>
      </div>

      <Tabs defaultValue="pos" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pos" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Punto de Venta
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Euro className="w-4 h-4" />
            Inventario
          </TabsTrigger>
          <TabsTrigger value="cash" className="flex items-center gap-2">
            <Euro className="w-4 h-4" />
            Estado de Caja
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reportes
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Movimientos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Venta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="saleAmount">Monto de Venta</Label>
                  <Input
                    id="saleAmount"
                    type="number"
                    step="0.01"
                    value={saleAmount}
                    onChange={(e) => setSaleAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="paymentReceived">Pago Recibido</Label>
                  <Input
                    id="paymentReceived"
                    type="number"
                    step="0.01"
                    value={paymentReceived}
                    onChange={(e) => setPaymentReceived(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <Button onClick={calculateChange} className="w-full">
                Calcular Cambio
              </Button>

              {suggestedChange.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cambio Sugerido</CardTitle>
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
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center font-bold">
                          <span>Total Cambio:</span>
                          <span>
                            {formatCurrency(
                              suggestedChange.reduce(
                                (sum, item) => sum + (item.denomination.value * item.quantity),
                                0
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={processSale} 
                      disabled={loading}
                      className="w-full mt-4"
                    >
                      {loading ? 'Procesando...' : 'Confirmar Venta'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <CashInventoryManager />
        </TabsContent>

        <TabsContent value="cash" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado Actual de Caja</CardTitle>
              <p className="text-lg font-semibold text-primary">
                Total en Caja: {formatCurrency(getTotalCashValue())}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cashState.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">
                        {formatCurrency(item.denomination.value)}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({item.denomination.type === 'bill' ? 'Billete' : 'Moneda'})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.quantity} uds</span>
                      <span className="text-sm text-muted-foreground">
                        ({formatCurrency(item.quantity * item.denomination.value)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reportes Diarios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidad de reportes en desarrollo...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos de Caja</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Historial de movimientos en desarrollo...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CashRegisterSystem;