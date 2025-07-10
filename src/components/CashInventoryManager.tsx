import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  getDenominations,
  getCashRegisterState,
  updateCashRegisterState,
  createCashRegisterEntry,
  type Denomination,
  type CashRegisterState
} from '@/lib/cashRegisterHelpers';
import { Wallet, Plus, Minus, RotateCcw } from 'lucide-react';

const CashInventoryManager: React.FC = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState('cristobal-bordiu');
  const [denominations, setDenominations] = useState<Denomination[]>([]);
  const [cashState, setCashState] = useState<CashRegisterState[]>([]);
  const [adjustments, setAdjustments] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  useEffect(() => {
    loadCashData();
  }, [location]);

  const loadCashData = async () => {
    try {
      setLoading(true);
      const [denominationsData, cashStateData] = await Promise.all([
        getDenominations(),
        getCashRegisterState(location)
      ]);
      
      setDenominations(denominationsData);
      setCashState(cashStateData);
      setAdjustments({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar datos de inventario",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentQuantity = (denomId: string): number => {
    const current = cashState.find(state => state.denomination_id === denomId);
    return current ? current.quantity : 0;
  };

  const getAdjustedQuantity = (denomId: string): number => {
    const current = getCurrentQuantity(denomId);
    const adjustment = adjustments[denomId] || 0;
    return current + adjustment;
  };

  const handleAdjustment = (denomId: string, change: number) => {
    setAdjustments(prev => ({
      ...prev,
      [denomId]: (prev[denomId] || 0) + change
    }));
  };

  const setDirectQuantity = (denomId: string, quantity: number) => {
    const current = getCurrentQuantity(denomId);
    const adjustment = quantity - current;
    setAdjustments(prev => ({
      ...prev,
      [denomId]: adjustment
    }));
  };

  const applyAdjustments = async () => {
    try {
      setLoading(true);
      
      // Crear entradas en el registro de caja para cada ajuste
      for (const [denomId, adjustment] of Object.entries(adjustments)) {
        if (adjustment !== 0) {
          const denomination = denominations.find(d => d.id === denomId);
          if (denomination) {
            const amount = Math.abs(adjustment * denomination.value);
            const entryType = 'adjustment';
            const description = adjustment > 0 
              ? `Ingreso manual de efectivo - ${Math.abs(adjustment)} x ${denomination.value}€`
              : `Retiro manual de efectivo - ${Math.abs(adjustment)} x ${denomination.value}€`;

            // Crear entrada en el registro
            await createCashRegisterEntry({
              entry_type: entryType,
              amount: amount,
              description: description,
              location: location
            });

            // Actualizar estado de caja
            await updateCashRegisterState(denomId, adjustment, location);
          }
        }
      }

      toast({
        title: "Éxito",
        description: "Inventario de efectivo actualizado correctamente",
        variant: "default"
      });

      // Recargar datos
      await loadCashData();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el inventario",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAdjustments = () => {
    setAdjustments({});
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const calculateTotalValue = (includeAdjustments = false): number => {
    return denominations.reduce((total, denom) => {
      const quantity = includeAdjustments ? getAdjustedQuantity(denom.id) : getCurrentQuantity(denom.id);
      return total + (quantity * denom.value);
    }, 0);
  };

  const hasAdjustments = Object.values(adjustments).some(adj => adj !== 0);

  // Separar billetes y monedas
  const bills = denominations.filter(d => d.type === 'bill').sort((a, b) => b.value - a.value);
  const coins = denominations.filter(d => d.type === 'coin').sort((a, b) => b.value - a.value);

  const renderDenominationSection = (denoms: Denomination[], title: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid gap-4">
        {denoms.map(denomination => {
          const currentQty = getCurrentQuantity(denomination.id);
          const adjustedQty = getAdjustedQuantity(denomination.id);
          const adjustment = adjustments[denomination.id] || 0;
          
          return (
            <div key={denomination.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-lg font-bold min-w-[80px]">
                  {formatCurrency(denomination.value)}
                </div>
                <div className="text-sm text-muted-foreground">
                  En caja: {currentQty}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdjustment(denomination.id, -1)}
                    disabled={loading}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <Input
                    type="number"
                    value={adjustedQty}
                    onChange={(e) => setDirectQuantity(denomination.id, parseInt(e.target.value) || 0)}
                    className="w-20 text-center"
                    min="0"
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdjustment(denomination.id, 1)}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {adjustment !== 0 && (
                  <div className={`text-sm font-semibold ${adjustment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {adjustment > 0 ? '+' : ''}{adjustment}
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground min-w-[80px] text-right">
                  {formatCurrency(adjustedQty * denomination.value)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Gestión de Inventario de Efectivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de ubicación */}
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resumen del total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {formatCurrency(calculateTotalValue(false))}
                </div>
                <p className="text-sm text-muted-foreground">Total actual en caja</p>
              </CardContent>
            </Card>
            
            {hasAdjustments && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(calculateTotalValue(true))}
                  </div>
                  <p className="text-sm text-muted-foreground">Total después de ajustes</p>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          {/* Billetes */}
          {renderDenominationSection(bills, "💴 Billetes")}

          <Separator />

          {/* Monedas */}
          {renderDenominationSection(coins, "🪙 Monedas")}

          {/* Botones de acción */}
          <div className="flex gap-4 pt-6">
            <Button
              onClick={applyAdjustments}
              disabled={!hasAdjustments || loading}
              className="flex-1"
            >
              Aplicar Cambios
            </Button>
            
            <Button
              variant="outline"
              onClick={resetAdjustments}
              disabled={!hasAdjustments || loading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashInventoryManager;