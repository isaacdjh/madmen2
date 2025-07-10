import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Banknote, Gift, Clock, User, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PaymentModalWithCash from '@/components/PaymentModalWithCash';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Client {
  id: string;
  name: string;
  last_name?: string;
  phone: string;
  email: string;
}

interface ClientBonus {
  id: string;
  services_remaining: number;
  bonus_package_id: string;
  bonus_packages: {
    name: string;
    services_included: number;
  };
}

interface CobroExpressProps {
  isOpen: boolean;
  onClose: () => void;
}

const CobroExpress = ({ isOpen, onClose }: CobroExpressProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientBonuses, setClientBonuses] = useState<ClientBonus[]>([]);
  const [selectedBonus, setSelectedBonus] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [showCashModal, setShowCashModal] = useState(false);
  const { toast } = useToast();

  // Barberos por ubicación
  const barbersByLocation = {
    'cristobal-bordiu': [
      { id: 'luis-bracho', name: 'Luis Bracho' },
      { id: 'jesus-hernandez', name: 'Jesús Hernández' },
      { id: 'luis-alfredo', name: 'Luis Alfredo' },
      { id: 'dionys-bracho', name: 'Dionys Bracho' }
    ],
    'general-pardinas': [
      { id: 'isaac-hernandez', name: 'Isaac Hernández' },
      { id: 'carlos-lopez', name: 'Carlos López' },
      { id: 'luis-urbinez', name: 'Luis Urbiñez' },
      { id: 'randy-valdespino', name: 'Randy Valdespino' }
    ]
  };

  const [selectedLocation, setSelectedLocation] = useState('cristobal-bordiu');
  const [selectedBarber, setSelectedBarber] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadServices();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedClient) {
      loadClientBonuses();
    }
  }, [selectedClient]);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los servicios",
        variant: "destructive",
      });
    }
  };

  const loadClientBonuses = async () => {
    if (!selectedClient) return;

    try {
      const { data, error } = await supabase
        .from('client_bonuses')
        .select(`
          id,
          services_remaining,
          bonus_package_id,
          bonus_packages!client_bonuses_bonus_package_id_fkey (
            name,
            services_included
          )
        `)
        .eq('client_id', selectedClient.id)
        .eq('status', 'activo')
        .gt('services_remaining', 0);

      if (error) throw error;
      setClientBonuses(data || []);
    } catch (error) {
      console.error('Error loading client bonuses:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los bonos del cliente",
        variant: "destructive",
      });
    }
  };

  const searchClients = async (searchTerm: string) => {
    if (searchTerm.length < 3) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching clients:', error);
      toast({
        title: "Error",
        description: "Error al buscar clientes",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClientSearch = (value: string) => {
    setClientSearch(value);
    if (value.length >= 3) {
      searchClients(value);
    } else {
      setSearchResults([]);
    }
  };

  const selectClient = (client: Client) => {
    setSelectedClient(client);
    setClientSearch(`${client.name} ${client.last_name || ''} - ${client.phone}`);
    setSearchResults([]);
    setSelectedBonus('');
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    
    // Si cambia de método de pago con bono a otro, resetear selección de bono
    if (method !== 'bonus') {
      setSelectedBonus('');
    }
    
    // Si cambia a método de pago con bono pero no hay cliente, resetear
    if (method === 'bonus' && !selectedClient) {
      setPaymentMethod('');
      toast({
        title: "Cliente requerido",
        description: "Debe seleccionar un cliente para usar bonos",
        variant: "destructive",
      });
    }
  };

  const canProceedWithPayment = () => {
    if (!selectedService || !selectedBarber) return false;
    
    if (paymentMethod === 'bonus') {
      return selectedClient && selectedBonus;
    }
    
    return paymentMethod !== '';
  };

  const handleProcessPayment = async () => {
    if (!canProceedWithPayment()) return;

    if (paymentMethod === 'cash') {
      // Crear cita temporal para el modal de efectivo
      const tempAppointment = {
        id: `temp-${Date.now()}`,
        service: selectedService!.name,
        price: selectedService!.price,
        barber: selectedBarber,
        location: selectedLocation,
        client_id: selectedClient?.id || null,
        customer_name: selectedClient?.name || 'Cliente Walk-in',
        customer_phone: selectedClient?.phone || '',
        customer_email: selectedClient?.email || '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: new Date().toTimeString().split(' ')[0],
        status: 'completada' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setShowCashModal(true);
      return;
    }

    if (paymentMethod === 'bonus') {
      await processBonusPayment();
    } else {
      await processRegularPayment();
    }
  };

  const processBonusPayment = async () => {
    if (!selectedClient || !selectedBonus || !selectedService) return;

    try {
      // Redimir bono
      const { error: redeemError } = await supabase
        .from('bonus_redemptions')
        .insert({
          client_bonus_id: selectedBonus,
          service_name: selectedService.name,
          redeemed_by_barber: selectedBarber
        });

      if (redeemError) throw redeemError;

      // Actualizar servicios restantes
      const { error: updateError } = await supabase
        .from('client_bonuses')
        .update({
          services_remaining: clientBonuses.find(b => b.id === selectedBonus)!.services_remaining - 1
        })
        .eq('id', selectedBonus);

      if (updateError) throw updateError;

      // Crear historial de servicio
      await supabase
        .from('service_history')
        .insert({
          client_id: selectedClient.id,
          service_name: selectedService.name,
          service_price: selectedService.price,
          barber_name: selectedBarber,
          service_date: new Date().toISOString().split('T')[0],
          payment_method: 'bono',
          used_bonus: true
        });

      toast({
        title: "Pago procesado",
        description: "Bono canjeado exitosamente",
        variant: "default",
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error processing bonus payment:', error);
      toast({
        title: "Error",
        description: "Error al procesar el pago con bono",
        variant: "destructive",
      });
    }
  };

  const processRegularPayment = async () => {
    if (!selectedService) return;

    try {
      // Crear pago
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          client_id: selectedClient?.id || null,
          amount: selectedService.price,
          payment_method: paymentMethod,
          payment_status: 'completado'
        });

      if (paymentError) throw paymentError;

      // Crear historial de servicio
      await supabase
        .from('service_history')
        .insert({
          client_id: selectedClient?.id || null,
          service_name: selectedService.name,
          service_price: selectedService.price,
          barber_name: selectedBarber,
          service_date: new Date().toISOString().split('T')[0],
          payment_method: paymentMethod,
          used_bonus: false
        });

      toast({
        title: "Pago procesado",
        description: `Pago de €${selectedService.price} procesado exitosamente`,
        variant: "default",
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Error al procesar el pago",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedService(null);
    setPaymentMethod('');
    setClientSearch('');
    setSelectedClient(null);
    setClientBonuses([]);
    setSelectedBonus('');
    setSearchResults([]);
    setSelectedBarber('');
  };

  const handleCashPaymentComplete = () => {
    setShowCashModal(false);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Cobro Express
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Selección de ubicación y barbero */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cristobal-bordiu">Mad Men Cristóbal Bordiú</SelectItem>
                    <SelectItem value="general-pardinas">Mad Men General Pardiñas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="barber">Barbero</Label>
                <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar barbero" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbersByLocation[selectedLocation as keyof typeof barbersByLocation].map((barber) => (
                      <SelectItem key={barber.id} value={barber.name}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selección de servicio */}
            <div>
              <Label htmlFor="service">Servicio</Label>
              <Select 
                value={selectedService?.id || ''} 
                onValueChange={(value) => {
                  const service = services.find(s => s.id === value);
                  setSelectedService(service || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex justify-between w-full">
                        <span>{service.name}</span>
                        <span className="font-semibold">€{service.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedService && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{selectedService.name}</span>
                    <span className="font-bold text-blue-600">€{selectedService.price}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedService.duration} minutos
                  </div>
                </div>
              )}
            </div>

            {/* Búsqueda de cliente (solo para bonos) */}
            <div>
              <Label htmlFor="client">Cliente (opcional, requerido para bonos)</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, teléfono o email..."
                  value={clientSearch}
                  onChange={(e) => handleClientSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && (
                <div className="mt-2 border rounded-lg bg-white shadow-lg max-h-40 overflow-y-auto">
                  {searchResults.map((client) => (
                    <div
                      key={client.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => selectClient(client)}
                    >
                      <div className="font-medium">{client.name} {client.last_name || ''}</div>
                      <div className="text-sm text-gray-600">{client.phone} - {client.email}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cliente seleccionado */}
              {selectedClient && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{selectedClient.name} {selectedClient.last_name || ''}</div>
                      <div className="text-sm text-gray-600">{selectedClient.phone}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedClient(null);
                        setClientSearch('');
                        setClientBonuses([]);
                        setSelectedBonus('');
                      }}
                    >
                      Cambiar
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Método de pago */}
            <div>
              <Label>Método de Pago</Label>
              <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    Efectivo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Tarjeta
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <Banknote className="w-4 h-4" />
                    Pago Mixto
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="bonus" 
                    id="bonus" 
                    disabled={!selectedClient}
                  />
                  <Label 
                    htmlFor="bonus" 
                    className={`flex items-center gap-2 ${!selectedClient ? 'opacity-50' : ''}`}
                  >
                    <Gift className="w-4 h-4" />
                    Bono de sesiones {!selectedClient && '(requiere cliente)'}
                  </Label>
                </div>
              </RadioGroup>

              {/* Selección de bono */}
              {paymentMethod === 'bonus' && selectedClient && (
                <div className="mt-4">
                  {clientBonuses.length > 0 ? (
                    <div>
                      <Label>Seleccionar Bono</Label>
                      <Select value={selectedBonus} onValueChange={setSelectedBonus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar bono disponible" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientBonuses.map((bonus) => (
                            <SelectItem key={bonus.id} value={bonus.id}>
                              {bonus.bonus_packages.name} - {bonus.services_remaining} servicios restantes
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Este cliente no tiene bonos activos disponibles.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Resumen del pago */}
            {selectedService && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen del Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Servicio:</span>
                      <span>{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Barbero:</span>
                      <span>{selectedBarber}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>
                        {paymentMethod === 'bonus' ? 'BONO' : `€${selectedService.price}`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { resetForm(); onClose(); }} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleProcessPayment}
                disabled={!canProceedWithPayment()}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Procesar Pago
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de pago en efectivo */}
      {showCashModal && selectedService && (
        <PaymentModalWithCash
          isOpen={showCashModal}
          onClose={() => setShowCashModal(false)}
          appointment={{
            id: `temp-${Date.now()}`,
            service: selectedService.name,
            price: selectedService.price,
            barber: selectedBarber,
            location: selectedLocation,
            client_id: selectedClient?.id || null,
            customer_name: selectedClient?.name || 'Cliente Walk-in',
            customer_phone: selectedClient?.phone || '',
            customer_email: selectedClient?.email || '',
            appointment_date: new Date().toISOString().split('T')[0],
            appointment_time: new Date().toTimeString().split(' ')[0],
            status: 'completada' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }}
          onPaymentComplete={handleCashPaymentComplete}
          barberName={selectedBarber}
        />
      )}
    </>
  );
};

export default CobroExpress;