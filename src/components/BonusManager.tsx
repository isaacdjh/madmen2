
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
import { Gift, Plus, Edit, Trash2, DollarSign, Package, Users, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface BonusPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  services: {
    serviceId: string;
    serviceName: string;
    quantity: number;
  }[];
  active: boolean;
  createdAt: string;
}

interface PurchasedBonus {
  id: string;
  packageId: string;
  packageName: string;
  clientName: string;
  clientPhone: string;
  purchaseDate: string;
  totalPrice: number;
  servicesRemaining: {
    serviceId: string;
    serviceName: string;
    remaining: number;
    total: number;
  }[];
  status: 'active' | 'completed';
}

interface RedeemService {
  bonusId: string;
  serviceId: string;
  serviceName: string;
  redeemDate: string;
  barberName: string;
}

const BonusManager = () => {
  const [bonusPackages, setBonusPackages] = useState<BonusPackage[]>([]);
  const [purchasedBonuses, setPurchasedBonuses] = useState<PurchasedBonus[]>([]);
  const [redeemHistory, setRedeemHistory] = useState<RedeemService[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<BonusPackage | null>(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [isSellingBonus, setIsSellingBonus] = useState(false);
  const [isRedeemingService, setIsRedeemingService] = useState(false);

  const [newPackage, setNewPackage] = useState<Partial<BonusPackage>>({
    name: '',
    description: '',
    price: 0,
    services: [],
    active: true
  });

  const [saleData, setSaleData] = useState({
    packageId: '',
    clientName: '',
    clientPhone: ''
  });

  const [redeemData, setRedeemData] = useState({
    bonusId: '',
    serviceId: '',
    barberName: ''
  });

  // Servicios disponibles predefinidos
  const availableServices = [
    { id: 'classic-cut', name: 'Corte de Pelo' },
    { id: 'beard-trim', name: 'Arreglo de Barba' },
    { id: 'cut-beard', name: 'Corte + Barba' },
    { id: 'buzz-beard', name: 'Rapado + Barba' }
  ];

  useEffect(() => {
    loadBonusPackages();
    loadPurchasedBonuses();
    loadRedeemHistory();
  }, []);

  const loadBonusPackages = () => {
    const stored = localStorage.getItem('bonusPackages');
    if (stored) {
      setBonusPackages(JSON.parse(stored));
    } else {
      // Pack inicial Mad Men
      const initialPackage: BonusPackage = {
        id: 'mad-men-pack',
        name: 'Pack Mad Men Premium',
        description: 'Pack de 4 servicios sin caducidad - La experiencia completa',
        price: 200,
        services: [
          { serviceId: 'classic-cut', serviceName: 'Corte de Pelo', quantity: 1 },
          { serviceId: 'beard-trim', serviceName: 'Arreglo de Barba', quantity: 1 },
          { serviceId: 'cut-beard', serviceName: 'Corte + Barba', quantity: 1 },
          { serviceId: 'buzz-beard', serviceName: 'Rapado + Barba', quantity: 1 }
        ],
        active: true,
        createdAt: new Date().toISOString()
      };
      setBonusPackages([initialPackage]);
      localStorage.setItem('bonusPackages', JSON.stringify([initialPackage]));
    }
  };

  const loadPurchasedBonuses = () => {
    const stored = localStorage.getItem('purchasedBonuses');
    if (stored) {
      setPurchasedBonuses(JSON.parse(stored));
    }
  };

  const loadRedeemHistory = () => {
    const stored = localStorage.getItem('redeemHistory');
    if (stored) {
      setRedeemHistory(JSON.parse(stored));
    }
  };

  const saveBonusPackages = (packages: BonusPackage[]) => {
    setBonusPackages(packages);
    localStorage.setItem('bonusPackages', JSON.stringify(packages));
  };

  const savePurchasedBonuses = (bonuses: PurchasedBonus[]) => {
    setPurchasedBonuses(bonuses);
    localStorage.setItem('purchasedBonuses', JSON.stringify(bonuses));
  };

  const saveRedeemHistory = (history: RedeemService[]) => {
    setRedeemHistory(history);
    localStorage.setItem('redeemHistory', JSON.stringify(history));
  };

  const handleAddPackage = () => {
    if (!newPackage.name || !newPackage.price || newPackage.services!.length === 0) {
      toast.error('Nombre, precio y al menos un servicio son obligatorios');
      return;
    }

    const bonusPackage: BonusPackage = {
      id: newPackage.name!.toLowerCase().replace(/\s+/g, '-'),
      name: newPackage.name!,
      description: newPackage.description || '',
      price: newPackage.price!,
      services: newPackage.services!,
      active: true,
      createdAt: new Date().toISOString()
    };

    const updatedPackages = [...bonusPackages, bonusPackage];
    saveBonusPackages(updatedPackages);
    setIsAddingPackage(false);
    setNewPackage({
      name: '',
      description: '',
      price: 0,
      services: [],
      active: true
    });
    toast.success('Pack de bonos creado correctamente');
  };

  const handleSellBonus = () => {
    if (!saleData.packageId || !saleData.clientName || !saleData.clientPhone) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const selectedPkg = bonusPackages.find(p => p.id === saleData.packageId);
    if (!selectedPkg) return;

    const purchasedBonus: PurchasedBonus = {
      id: `bonus-${Date.now()}`,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      clientName: saleData.clientName,
      clientPhone: saleData.clientPhone,
      purchaseDate: new Date().toISOString(),
      totalPrice: selectedPkg.price,
      servicesRemaining: selectedPkg.services.map(s => ({
        serviceId: s.serviceId,
        serviceName: s.serviceName,
        remaining: s.quantity,
        total: s.quantity
      })),
      status: 'active'
    };

    const updatedBonuses = [...purchasedBonuses, purchasedBonus];
    savePurchasedBonuses(updatedBonuses);
    setIsSellingBonus(false);
    setSaleData({ packageId: '', clientName: '', clientPhone: '' });
    toast.success('Bono vendido correctamente');
  };

  const handleRedeemService = () => {
    if (!redeemData.bonusId || !redeemData.serviceId || !redeemData.barberName) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const bonusIndex = purchasedBonuses.findIndex(b => b.id === redeemData.bonusId);
    if (bonusIndex === -1) return;

    const bonus = purchasedBonuses[bonusIndex];
    const serviceIndex = bonus.servicesRemaining.findIndex(s => s.serviceId === redeemData.serviceId);
    
    if (serviceIndex === -1 || bonus.servicesRemaining[serviceIndex].remaining <= 0) {
      toast.error('Servicio no disponible en este bono');
      return;
    }

    // Reducir servicio disponible
    bonus.servicesRemaining[serviceIndex].remaining -= 1;
    
    // Verificar si el bono está completo
    const allServicesUsed = bonus.servicesRemaining.every(s => s.remaining === 0);
    if (allServicesUsed) {
      bonus.status = 'completed';
    }

    // Agregar al historial
    const redeemRecord: RedeemService = {
      bonusId: redeemData.bonusId,
      serviceId: redeemData.serviceId,
      serviceName: bonus.servicesRemaining[serviceIndex].serviceName,
      redeemDate: new Date().toISOString(),
      barberName: redeemData.barberName
    };

    const updatedBonuses = [...purchasedBonuses];
    updatedBonuses[bonusIndex] = bonus;
    
    const updatedHistory = [...redeemHistory, redeemRecord];

    savePurchasedBonuses(updatedBonuses);
    saveRedeemHistory(updatedHistory);
    setIsRedeemingService(false);
    setRedeemData({ bonusId: '', serviceId: '', barberName: '' });
    toast.success('Servicio canjeado correctamente');
  };

  const addServiceToPackage = () => {
    setNewPackage({
      ...newPackage,
      services: [
        ...newPackage.services!,
        { serviceId: '', serviceName: '', quantity: 1 }
      ]
    });
  };

  const updateServiceInPackage = (index: number, field: string, value: any) => {
    const updatedServices = [...newPackage.services!];
    if (field === 'serviceId') {
      const service = availableServices.find(s => s.id === value);
      updatedServices[index] = {
        ...updatedServices[index],
        serviceId: value,
        serviceName: service?.name || ''
      };
    } else {
      updatedServices[index] = {
        ...updatedServices[index],
        [field]: value
      };
    }
    setNewPackage({ ...newPackage, services: updatedServices });
  };

  const removeServiceFromPackage = (index: number) => {
    const updatedServices = newPackage.services!.filter((_, i) => i !== index);
    setNewPackage({ ...newPackage, services: updatedServices });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Sistema de Bonos Mad Men</h1>
        <p className="text-muted-foreground">Gestión de packs de servicios y canjes digitales</p>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="packages">Packs Disponibles</TabsTrigger>
          <TabsTrigger value="sales">Ventas de Bonos</TabsTrigger>
          <TabsTrigger value="redeem">Canjear Servicios</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
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
                    <p className="text-2xl font-bold text-barbershop-gold">{purchasedBonuses.length}</p>
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
                      €{purchasedBonuses.reduce((sum, b) => sum + b.totalPrice, 0)}
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Pack de Servicios</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="package-price">Precio (€)</Label>
                    <Input
                      id="package-price"
                      type="number"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage({...newPackage, price: Number(e.target.value)})}
                    />
                  </div>
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
                
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label>Servicios Incluidos</Label>
                    <Button type="button" size="sm" onClick={addServiceToPackage}>
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Servicio
                    </Button>
                  </div>
                  {newPackage.services?.map((service, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 items-center mb-2">
                      <select
                        className="col-span-3 px-3 py-2 border rounded-md"
                        value={service.serviceId}
                        onChange={(e) => updateServiceInPackage(index, 'serviceId', e.target.value)}
                      >
                        <option value="">Seleccionar servicio</option>
                        {availableServices.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <Input
                        type="number"
                        min="1"
                        value={service.quantity}
                        onChange={(e) => updateServiceInPackage(index, 'quantity', Number(e.target.value))}
                        placeholder="Cant."
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeServiceFromPackage(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
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
                  <div>
                    <span className="text-sm text-muted-foreground block mb-2">Servicios incluidos:</span>
                    {pkg.services.map((service, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span>{service.serviceName}</span>
                        <span className="font-medium">x{service.quantity}</span>
                      </div>
                    ))}
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

          <div className="grid grid-cols-1 gap-4">
            {purchasedBonuses.map((bonus) => (
              <Card key={bonus.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-barbershop-dark">{bonus.packageName}</h3>
                      <p className="text-sm text-muted-foreground">Cliente: {bonus.clientName}</p>
                      <p className="text-sm text-muted-foreground">Tel: {bonus.clientPhone}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={bonus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {bonus.status === 'active' ? 'Activo' : 'Completado'}
                      </Badge>
                      <p className="text-lg font-bold text-barbershop-gold mt-1">€{bonus.totalPrice}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {bonus.servicesRemaining.map((service, idx) => (
                      <div key={idx} className="text-center p-2 border rounded">
                        <p className="text-xs text-muted-foreground">{service.serviceName}</p>
                        <p className="font-bold">
                          {service.remaining}/{service.total}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Redeem Tab */}
        <TabsContent value="redeem" className="space-y-6">
          <Dialog open={isRedeemingService} onOpenChange={setIsRedeemingService}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                <Package className="w-4 h-4 mr-2" />
                Canjear Servicio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Canjear Servicio de Bono</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="redeem-bonus">Bono del Cliente</Label>
                  <select
                    id="redeem-bonus"
                    className="w-full px-3 py-2 border rounded-md"
                    value={redeemData.bonusId}
                    onChange={(e) => setRedeemData({...redeemData, bonusId: e.target.value})}
                  >
                    <option value="">Seleccionar bono</option>
                    {purchasedBonuses.filter(b => b.status === 'active').map(bonus => (
                      <option key={bonus.id} value={bonus.id}>
                        {bonus.clientName} - {bonus.packageName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="redeem-service">Servicio a Canjear</Label>
                  <select
                    id="redeem-service"
                    className="w-full px-3 py-2 border rounded-md"
                    value={redeemData.serviceId}
                    onChange={(e) => setRedeemData({...redeemData, serviceId: e.target.value})}
                  >
                    <option value="">Seleccionar servicio</option>
                    {availableServices.map(service => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="barber-name">Barbero que Realiza el Servicio</Label>
                  <Input
                    id="barber-name"
                    value={redeemData.barberName}
                    onChange={(e) => setRedeemData({...redeemData, barberName: e.target.value})}
                    placeholder="Nombre del barbero"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsRedeemingService(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleRedeemService} className="bg-purple-600 text-white">
                    Confirmar Canje
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
                    <TableHead>Servicios Disponibles</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchasedBonuses.filter(b => b.status === 'active').map((bonus) => (
                    <TableRow key={bonus.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{bonus.clientName}</p>
                          <p className="text-sm text-muted-foreground">{bonus.clientPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{bonus.packageName}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {bonus.servicesRemaining.map((service, idx) => (
                            <Badge key={idx} variant={service.remaining > 0 ? "default" : "secondary"}>
                              {service.serviceName}: {service.remaining}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
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

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Canjes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Barbero</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redeemHistory.map((redeem, index) => {
                    const bonus = purchasedBonuses.find(b => b.id === redeem.bonusId);
                    return (
                      <TableRow key={index}>
                        <TableCell>{new Date(redeem.redeemDate).toLocaleDateString()}</TableCell>
                        <TableCell>{bonus?.clientName || 'N/A'}</TableCell>
                        <TableCell>{redeem.serviceName}</TableCell>
                        <TableCell>{redeem.barberName}</TableCell>
                      </TableRow>
                    );
                  })}
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
