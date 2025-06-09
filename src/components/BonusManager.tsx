
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Gift, Plus, DollarSign, Package, Users, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { 
  createBonusPackage, 
  getAllBonusPackages, 
  sellBonus, 
  getClientBonuses, 
  getAllClients,
  createOrGetClient,
  type BonusPackage, 
  type ClientBonus, 
  type Client 
} from '@/lib/supabase-helpers';

const BonusManager = () => {
  const [bonusPackages, setBonusPackages] = useState<BonusPackage[]>([]);
  const [clientBonuses, setClientBonuses] = useState<ClientBonus[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [isSellingBonus, setIsSellingBonus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    price: 0,
    services_included: 1
  });

  const [saleData, setSaleData] = useState({
    packageId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    soldByBarber: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [packagesData, bonusesData, clientsData] = await Promise.all([
        getAllBonusPackages(),
        getClientBonuses(),
        getAllClients()
      ]);

      setBonusPackages(packagesData);
      setClientBonuses(bonusesData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPackage = async () => {
    if (!newPackage.name || !newPackage.price || newPackage.services_included <= 0) {
      toast.error('Nombre, precio y servicios incluidos son obligatorios');
      return;
    }

    try {
      await createBonusPackage({
        ...newPackage,
        active: true
      });
      await loadAllData();
      setIsAddingPackage(false);
      setNewPackage({
        name: '',
        description: '',
        price: 0,
        services_included: 1
      });
      toast.success('Pack de bonos creado correctamente');
    } catch (error) {
      console.error('Error al crear pack:', error);
      toast.error('Error al crear el pack de bonos');
    }
  };

  const handleSellBonus = async () => {
    if (!saleData.packageId || !saleData.clientName || !saleData.clientPhone || !saleData.clientEmail || !saleData.soldByBarber) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    try {
      // Crear o obtener cliente
      const client = await createOrGetClient(saleData.clientName, saleData.clientPhone, saleData.clientEmail);
      
      // Obtener el paquete seleccionado
      const selectedPackage = bonusPackages.find(p => p.id === saleData.packageId);
      if (!selectedPackage) return;

      // Vender el bono
      await sellBonus({
        client_id: client.id,
        bonus_package_id: saleData.packageId,
        services_remaining: selectedPackage.services_included,
        sold_by_barber: saleData.soldByBarber,
        status: 'activo'
      });

      await loadAllData();
      setIsSellingBonus(false);
      setSaleData({
        packageId: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        soldByBarber: ''
      });
      toast.success('Bono vendido correctamente');
    } catch (error) {
      console.error('Error al vender bono:', error);
      toast.error('Error al vender el bono');
    }
  };

  const getTotalBonusRevenue = () => {
    return clientBonuses.reduce((total, bonus) => {
      const pkg = bonusPackages.find(p => p.id === bonus.bonus_package_id);
      return total + (pkg?.price || 0);
    }, 0);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente no encontrado';
  };

  const getClientPhone = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.phone || '';
  };

  const getPackageName = (packageId: string) => {
    const pkg = bonusPackages.find(p => p.id === packageId);
    return pkg?.name || 'Paquete no encontrado';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando sistema de bonos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Sistema de Bonos Mad Men</h1>
        <p className="text-muted-foreground">Gestión de packs de servicios y canjes digitales</p>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="packages">Packs Disponibles</TabsTrigger>
          <TabsTrigger value="sales">Bonos Vendidos</TabsTrigger>
          <TabsTrigger value="active">Bonos Activos</TabsTrigger>
        </TabsList>

        {/* Packs Tab */}
        <TabsContent value="packages" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Packs</p>
                    <p className="text-2xl font-bold text-barbershop-dark">{bonusPackages.length}</p>
                  </div>
                  <Gift className="w-8 h-8 text-barbershop-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Bonos Vendidos</p>
                    <p className="text-2xl font-bold text-barbershop-gold">{clientBonuses.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-barbershop-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos Bonos</p>
                    <p className="text-2xl font-bold text-green-600">
                      €{getTotalBonusRevenue()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Dialog open={isAddingPackage} onOpenChange={setIsAddingPackage}>
            <DialogTrigger asChild>
              <Button className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90">
                <Plus className="w-4 h-4 mr-2" />
                Crear Nuevo Pack
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Pack de Servicios</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="package-name">Nombre del Pack</Label>
                  <Input
                    id="package-name"
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                    placeholder="Ej: Pack Premium"
                  />
                </div>
                
                <div>
                  <Label htmlFor="package-description">Descripción</Label>
                  <Textarea
                    id="package-description"
                    value={newPackage.description}
                    onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                    placeholder="Descripción del pack..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="package-price">Precio (€)</Label>
                    <Input
                      id="package-price"
                      type="number"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage({...newPackage, price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="services-included">Servicios Incluidos</Label>
                    <Input
                      id="services-included"
                      type="number"
                      min="1"
                      value={newPackage.services_included}
                      onChange={(e) => setNewPackage({...newPackage, services_included: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingPackage(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddPackage} className="bg-barbershop-gold text-barbershop-dark">
                    Crear Pack
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bonusPackages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-barbershop-dark flex items-center gap-2">
                        <Crown className="w-5 h-5 text-barbershop-gold" />
                        {pkg.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    </div>
                    <Badge className="bg-barbershop-gold text-barbershop-dark">
                      {pkg.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Precio:</span>
                    <span className="text-xl font-bold text-barbershop-gold">€{pkg.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Servicios:</span>
                    <span className="font-bold">{pkg.services_included}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <Dialog open={isSellingBonus} onOpenChange={setIsSellingBonus}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                <DollarSign className="w-4 h-4 mr-2" />
                Vender Bono
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vender Bono a Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sale-package">Pack a Vender</Label>
                  <select
                    id="sale-package"
                    className="w-full px-3 py-2 border rounded-md"
                    value={saleData.packageId}
                    onChange={(e) => setSaleData({...saleData, packageId: e.target.value})}
                  >
                    <option value="">Seleccionar pack</option>
                    {bonusPackages.filter(p => p.active).map(pkg => (
                      <option key={pkg.id} value={pkg.id}>{pkg.name} - €{pkg.price}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client-name">Nombre del Cliente</Label>
                    <Input
                      id="client-name"
                      value={saleData.clientName}
                      onChange={(e) => setSaleData({...saleData, clientName: e.target.value})}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client-phone">Teléfono</Label>
                    <Input
                      id="client-phone"
                      value={saleData.clientPhone}
                      onChange={(e) => setSaleData({...saleData, clientPhone: e.target.value})}
                      placeholder="Número de teléfono"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={saleData.clientEmail}
                    onChange={(e) => setSaleData({...saleData, clientEmail: e.target.value})}
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="sold-by">Vendido por (Barbero)</Label>
                  <Input
                    id="sold-by"
                    value={saleData.soldByBarber}
                    onChange={(e) => setSaleData({...saleData, soldByBarber: e.target.value})}
                    placeholder="Nombre del barbero"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsSellingBonus(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSellBonus} className="bg-green-600 text-white">
                    Confirmar Venta
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Pack</TableHead>
                    <TableHead>Vendido por</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientBonuses.map((bonus) => (
                    <TableRow key={bonus.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{getClientName(bonus.client_id)}</p>
                          <p className="text-sm text-muted-foreground">{getClientPhone(bonus.client_id)}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getPackageName(bonus.bonus_package_id)}</TableCell>
                      <TableCell>{bonus.sold_by_barber}</TableCell>
                      <TableCell>{new Date(bonus.purchase_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={bonus.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {bonus.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Bonuses Tab */}
        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bonos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Pack</TableHead>
                    <TableHead>Servicios Restantes</TableHead>
                    <TableHead>Vendido por</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientBonuses.filter(b => b.status === 'activo').map((bonus) => (
                    <TableRow key={bonus.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{getClientName(bonus.client_id)}</p>
                          <p className="text-sm text-muted-foreground">{getClientPhone(bonus.client_id)}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getPackageName(bonus.bonus_package_id)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {bonus.services_remaining}
                        </Badge>
                      </TableCell>
                      <TableCell>{bonus.sold_by_barber}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Activo</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BonusManager;
