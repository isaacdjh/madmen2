
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Scissors, 
  Gift, 
  CreditCard,
  History,
  Plus,
  Eye,
  UserPlus
} from 'lucide-react';
import { getAllClients, getClientCompleteData, sellBonus, getAllBonusPackages, createPayment, createOrGetClient } from '@/lib/supabase-helpers';
import type { BonusPackage, ClientBonus } from '@/lib/supabase-helpers';

interface ClientWithSummary {
  id: string;
  name: string;
  last_name?: string;
  phone: string;
  email: string;
  client_since: string;
  total_appointments?: number;
  completed_appointments?: number;
  active_bonus_services?: number;
  total_bonuses_purchased?: number;
  total_spent?: number;
  last_visit_date?: string;
}

interface ClientDetails {
  client: {
    id: string;
    name: string;
    last_name?: string;
    phone: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  appointments: any[];
  bonuses: ClientBonus[];
  payments: any[];
}

interface ClientManagementProps {
  isBarberView?: boolean;
}

const ClientManagement = ({ isBarberView = false }: ClientManagementProps) => {
  const [clients, setClients] = useState<ClientWithSummary[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientWithSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientDetails | null>(null);
  const [bonusPackages, setBonusPackages] = useState<BonusPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSellBonusDialog, setShowSellBonusDialog] = useState(false);
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);
  const [selectedBonusPackage, setSelectedBonusPackage] = useState<string>('');
  const [sellingBarber, setSellingBarber] = useState<string>('');
  
  // Estados para agregar cliente
  const [newClientName, setNewClientName] = useState('');
  const [newClientLastName, setNewClientLastName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  const barbers = [
    'Luis Bracho', 'Jesús Hernández', 'Luis Alfredo', 'Dionys Bracho',
    'Isaac Hernández', 'Carlos López', 'Luis Urbiñez', 'Randy Valdespino'
  ];

  // Función para encriptar datos sensibles para barberos
  const maskSensitiveData = (data: string, type: 'phone' | 'email') => {
    if (!isBarberView) return data;
    
    if (type === 'phone') {
      return data.replace(/(\d{3})\d{3}(\d{3})/, '$1***$2');
    } else if (type === 'email') {
      const [username, domain] = data.split('@');
      const maskedUsername = username.length > 2 
        ? username.substring(0, 2) + '*'.repeat(username.length - 2)
        : username;
      return `${maskedUsername}@${domain}`;
    }
    return data;
  };

  useEffect(() => {
    loadClients();
    if (!isBarberView) {
      loadBonusPackages();
    }
  }, [isBarberView]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredClients(
        clients.filter(client =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.includes(searchTerm) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  const loadClients = async () => {
    try {
      console.log('ClientManagement: Iniciando loadClients...');
      const clientsData = await getAllClients();
      console.log('ClientManagement: Datos recibidos:', clientsData);
      console.log('ClientManagement: Número de clientes:', clientsData?.length || 0);
      
      setClients(clientsData);
      setFilteredClients(clientsData);
      
      console.log('ClientManagement: Estado actualizado exitosamente');
    } catch (error) {
      console.error('ClientManagement: Error loading clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBonusPackages = async () => {
    try {
      const packages = await getAllBonusPackages();
      setBonusPackages(packages.filter(pkg => pkg.active));
    } catch (error) {
      console.error('Error loading bonus packages:', error);
    }
  };

  const loadClientDetails = async (clientId: string) => {
    try {
      const details = await getClientCompleteData(clientId);
      setSelectedClient(details);
    } catch (error) {
      console.error('Error loading client details:', error);
    }
  };

  const handleAddClient = async () => {
    if (!newClientName || !newClientPhone || !newClientEmail) return;

    try {
      await createOrGetClient(newClientName, newClientPhone, newClientEmail);
      
      // Recargar lista de clientes
      await loadClients();
      
      // Limpiar formulario
      setNewClientName('');
      setNewClientLastName('');
      setNewClientPhone('');
      setNewClientEmail('');
      setShowAddClientDialog(false);
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleSellBonus = async () => {
    if (!selectedClient || !selectedBonusPackage || !sellingBarber) return;

    try {
      const bonusPackage = bonusPackages.find(pkg => pkg.id === selectedBonusPackage);
      if (!bonusPackage) return;

      await sellBonus({
        client_id: selectedClient.client.id,
        bonus_package_id: selectedBonusPackage,
        services_remaining: bonusPackage.services_included,
        sold_by_barber: sellingBarber,
        status: 'activo'
      });

      // Registrar el pago del bono
      await createPayment({
        client_id: selectedClient.client.id,
        amount: bonusPackage.price,
        payment_method: 'efectivo',
        payment_status: 'completado'
      });

      // Recargar datos del cliente
      await loadClientDetails(selectedClient.client.id);
      setShowSellBonusDialog(false);
      setSelectedBonusPackage('');
      setSellingBarber('');
    } catch (error) {
      console.error('Error selling bonus:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando clientes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-barbershop-dark mb-2">
          {isBarberView ? 'Base de Datos de Clientes' : 'Gestión de Clientes'}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {isBarberView ? 'Consulta información de clientes y historial' : 'Base de datos completa de clientes, historial y bonos'}
        </p>
      </div>

      {/* Search Bar y Botón Agregar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nombre, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {!isBarberView && (
          <Dialog open={showAddClientDialog} onOpenChange={setShowAddClientDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nombre *</label>
                  <Input
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Nombre del cliente"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Apellido</label>
                  <Input
                    value={newClientLastName}
                    onChange={(e) => setNewClientLastName(e.target.value)}
                    placeholder="Apellido del cliente"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Teléfono *</label>
                  <Input
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="cliente@email.com"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddClient}
                    disabled={!newClientName || !newClientPhone || !newClientEmail}
                    className="flex-1"
                  >
                    Agregar Cliente
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddClientDialog(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards - Solo para admin */}
      {!isBarberView && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Clientes</p>
                  <p className="text-xl font-bold text-barbershop-dark">{clients.length}</p>
                </div>
                <User className="w-6 h-6 text-barbershop-gold" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Con Bonos Activos</p>
                  <p className="text-xl font-bold text-green-600">
                    {clients.filter(c => (c.active_bonus_services || 0) > 0).length}
                  </p>
                </div>
                <Gift className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Servicios Activos</p>
                  <p className="text-xl font-bold text-blue-600">
                    {clients.reduce((sum, c) => sum + (c.active_bonus_services || 0), 0)}
                  </p>
                </div>
                <Scissors className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Ingresos Total</p>
                  <p className="text-xl font-bold text-barbershop-gold">
                    €{clients.reduce((sum, c) => sum + (c.total_spent || 0), 0).toFixed(2)}
                  </p>
                </div>
                <CreditCard className="w-6 h-6 text-barbershop-gold" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-barbershop-dark truncate">
                    {client.name} {client.last_name || ''}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Phone className="w-3 h-3 mr-1" />
                    <span className="truncate">{maskSensitiveData(client.phone, 'phone')}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Mail className="w-3 h-3 mr-1" />
                    <span className="truncate">{maskSensitiveData(client.email, 'email')}</span>
                  </div>
                </div>
                {(client.active_bonus_services || 0) > 0 && (
                  <Badge className="bg-green-100 text-green-800 ml-2">
                    {client.active_bonus_services} bonos
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{client.total_appointments || 0} citas</span>
                </div>
                {!isBarberView && (
                  <div className="flex items-center">
                    <CreditCard className="w-3 h-3 mr-1" />
                    <span>€{(client.total_spent || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => loadClientDetails(client.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      Perfil de {selectedClient?.client.name} {selectedClient?.client.last_name || ''}
                    </DialogTitle>
                  </DialogHeader>
                  
                  {selectedClient && (
                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className={`grid w-full ${isBarberView ? 'grid-cols-2' : 'grid-cols-4'}`}>
                        <TabsTrigger value="info">Información</TabsTrigger>
                        <TabsTrigger value="appointments">Citas</TabsTrigger>
                        {!isBarberView && (
                          <>
                            <TabsTrigger value="bonuses">Bonos</TabsTrigger>
                            <TabsTrigger value="payments">Pagos</TabsTrigger>
                          </>
                        )}
                      </TabsList>

                      <TabsContent value="info" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Información Personal</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-muted-foreground" />
                              <span>{selectedClient.client.name} {selectedClient.client.last_name || ''}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                              <span>{maskSensitiveData(selectedClient.client.phone, 'phone')}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                              <span>{maskSensitiveData(selectedClient.client.email, 'email')}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                              <span>Cliente desde: {new Date(selectedClient.client.created_at).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-barbershop-dark">
                                {selectedClient.appointments.filter(a => a.status === 'completada').length}
                              </div>
                              <div className="text-sm text-muted-foreground">Servicios Completados</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {selectedClient.bonuses.reduce((sum, b) => sum + b.services_remaining, 0)}
                              </div>
                              <div className="text-sm text-muted-foreground">Servicios en Bonos</div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="appointments" className="space-y-4">
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {selectedClient.appointments.map((appointment) => (
                            <Card key={appointment.id}>
                              <CardContent className="p-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{appointment.service}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {appointment.appointment_date} - {appointment.appointment_time}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Barbero: {appointment.barber}
                                    </div>
                                  </div>
                                  <Badge 
                                    className={
                                      appointment.status === 'completada' 
                                        ? 'bg-green-100 text-green-800'
                                        : appointment.status === 'confirmada'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-red-100 text-red-800'
                                    }
                                  >
                                    {appointment.status}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      {!isBarberView && (
                        <>
                          <TabsContent value="bonuses" className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold">Bonos del Cliente</h3>
                              <Button
                                size="sm"
                                onClick={() => setShowSellBonusDialog(true)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Vender Bono
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              {selectedClient.bonuses.map((bonus) => (
                                <Card key={bonus.id}>
                                  <CardContent className="p-3">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <div className="font-medium">Bono de Servicios</div>
                                        <div className="text-sm text-muted-foreground">
                                          Servicios restantes: {bonus.services_remaining}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          Vendido por: {bonus.sold_by_barber}
                                        </div>
                                      </div>
                                      <Badge 
                                        className={
                                          bonus.status === 'activo' 
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }
                                      >
                                        {bonus.status}
                                      </Badge>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="payments" className="space-y-4">
                            <div className="max-h-60 overflow-y-auto space-y-2">
                              {selectedClient.payments.map((payment) => (
                                <Card key={payment.id}>
                                  <CardContent className="p-3">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <div className="font-medium">€{payment.amount}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {payment.payment_method}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {new Date(payment.created_at).toLocaleDateString()}
                                        </div>
                                      </div>
                                      <Badge className="bg-green-100 text-green-800">
                                        {payment.payment_status}
                                      </Badge>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>
                        </>
                      )}
                    </Tabs>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sell Bonus Dialog - Solo para admin */}
      {!isBarberView && (
        <Dialog open={showSellBonusDialog} onOpenChange={setShowSellBonusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vender Bono a {selectedClient?.client.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Paquete de Bono</label>
                <Select value={selectedBonusPackage} onValueChange={setSelectedBonusPackage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar paquete" />
                  </SelectTrigger>
                  <SelectContent>
                    {bonusPackages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} - {pkg.services_included} servicios - €{pkg.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Barbero que Vende</label>
                <Select value={sellingBarber} onValueChange={setSellingBarber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar barbero" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers.map((barber) => (
                      <SelectItem key={barber} value={barber}>
                        {barber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSellBonus}
                  disabled={!selectedBonusPackage || !sellingBarber}
                  className="flex-1"
                >
                  Vender Bono
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSellBonusDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClientManagement;
