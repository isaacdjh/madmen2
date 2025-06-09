
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Euro, Clock, User, LogOut, TrendingUp, Gift, DollarSign, Package } from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  location: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: 'confirmada' | 'cancelada' | 'completada';
  createdAt: string;
}

interface BarberSession {
  id: string;
  name: string;
  location: string;
  loginTime: string;
}

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
  soldBy?: string;
}

interface RedeemService {
  bonusId: string;
  serviceId: string;
  serviceName: string;
  redeemDate: string;
  barberName: string;
}

interface BarberDashboardProps {
  onLogout: () => void;
}

const BarberDashboard = ({ onLogout }: BarberDashboardProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barberSession, setBarberSession] = useState<BarberSession | null>(null);
  const [bonusPackages, setBonusPackages] = useState<BonusPackage[]>([]);
  const [purchasedBonuses, setPurchasedBonuses] = useState<PurchasedBonus[]>([]);
  const [redeemHistory, setRedeemHistory] = useState<RedeemService[]>([]);
  const [isSellingBonus, setIsSellingBonus] = useState(false);
  const [isRedeemingService, setIsRedeemingService] = useState(false);

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

  const services = [
    { id: 'classic-cut', name: 'Corte Clásico', price: 45 },
    { id: 'beard-trim', name: 'Arreglo de Barba', price: 25 },
    { id: 'cut-beard', name: 'Corte + Barba', price: 65 },
    { id: 'shave', name: 'Afeitado Tradicional', price: 35 },
    { id: 'treatments', name: 'Tratamientos Especiales', price: 40 }
  ];

  const availableServices = [
    { id: 'classic-cut', name: 'Corte de Pelo' },
    { id: 'beard-trim', name: 'Arreglo de Barba' },
    { id: 'cut-beard', name: 'Corte + Barba' },
    { id: 'buzz-beard', name: 'Rapado + Barba' }
  ];

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  useEffect(() => {
    // Cargar sesión del barbero
    const session = localStorage.getItem('barberSession');
    if (session) {
      const parsedSession = JSON.parse(session);
      setBarberSession(parsedSession);
      setRedeemData(prev => ({ ...prev, barberName: parsedSession.name }));
    }

    // Cargar datos
    loadAppointments();
    loadBonusData();
    
    const interval = setInterval(() => {
      loadAppointments();
      loadBonusData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAppointments = () => {
    const stored = localStorage.getItem('appointments');
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  };

  const loadBonusData = () => {
    // Cargar packs de bonos
    const storedPackages = localStorage.getItem('bonusPackages');
    if (storedPackages) {
      setBonusPackages(JSON.parse(storedPackages));
    }

    // Cargar bonos comprados
    const storedBonuses = localStorage.getItem('purchasedBonuses');
    if (storedBonuses) {
      setPurchasedBonuses(JSON.parse(storedBonuses));
    }

    // Cargar historial
    const storedHistory = localStorage.getItem('redeemHistory');
    if (storedHistory) {
      setRedeemHistory(JSON.parse(storedHistory));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('barberSession');
    onLogout();
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
      status: 'active',
      soldBy: barberSession?.name
    };

    const updatedBonuses = [...purchasedBonuses, purchasedBonus];
    setPurchasedBonuses(updatedBonuses);
    localStorage.setItem('purchasedBonuses', JSON.stringify(updatedBonuses));
    
    setIsSellingBonus(false);
    setSaleData({ packageId: '', clientName: '', clientPhone: '' });
    toast.success('Bono vendido correctamente');
  };

  const handleRedeemService = () => {
    if (!redeemData.bonusId || !redeemData.serviceId) {
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

    setPurchasedBonuses(updatedBonuses);
    setRedeemHistory(updatedHistory);
    localStorage.setItem('purchasedBonuses', JSON.stringify(updatedBonuses));
    localStorage.setItem('redeemHistory', JSON.stringify(updatedHistory));
    
    setIsRedeemingService(false);
    setRedeemData({ bonusId: '', serviceId: '', barberName: barberSession?.name || '' });
    toast.success('Servicio canjeado correctamente');
  };

  if (!barberSession) {
    return <div>Cargando...</div>;
  }

  // Filtrar solo las citas del barbero actual
  const myAppointments = appointments.filter(apt => apt.barber === barberSession.id);
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = myAppointments.filter(apt => apt.date === today && apt.status === 'confirmada');
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyCompletedAppointments = myAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return apt.status === 'completada' && 
           aptDate.getMonth() === currentMonth && 
           aptDate.getFullYear() === currentYear;
  });

  const monthlyRevenue = monthlyCompletedAppointments.reduce((sum, apt) => {
    const service = services.find(s => s.id === apt.service);
    return sum + (service ? service.price : 0);
  }, 0);

  const commission = monthlyRevenue > 3000 ? monthlyRevenue * 0.1 : 0;
  const hasCommission = monthlyRevenue > 3000;

  const getServiceName = (id: string) => {
    return services.find(s => s.id === id)?.name || id;
  };

  const getServicePrice = (id: string) => {
    return services.find(s => s.id === id)?.price || 0;
  };

  const getLocationName = (id: string) => {
    return locations.find(l => l.id === id)?.name || id;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Bonos vendidos por este barbero
  const myBonusSales = purchasedBonuses.filter(b => b.soldBy === barberSession.name);
  const myBonusRevenue = myBonusSales.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-barbershop-dark text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">¡Hola, {barberSession.name}!</h1>
              <p className="text-barbershop-gold">{getLocationName(barberSession.location)}</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-barbershop-dark"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bonuses">Gestión de Bonos</TabsTrigger>
            <TabsTrigger value="history">Historial Bonos</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Citas Hoy</p>
                      <p className="text-2xl font-bold text-barbershop-dark">{todayAppointments.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-barbershop-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completadas</p>
                      <p className="text-2xl font-bold text-green-600">{monthlyCompletedAppointments.length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Servicios</p>
                      <p className="text-2xl font-bold text-barbershop-gold">{monthlyRevenue}€</p>
                    </div>
                    <Euro className="w-8 h-8 text-barbershop-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Bonos Vendidos</p>
                      <p className="text-2xl font-bold text-purple-600">{myBonusSales.length}</p>
                    </div>
                    <Gift className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className={hasCommission ? 'border-green-500 bg-green-50' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Comisión</p>
                      <p className={`text-2xl font-bold ${hasCommission ? 'text-green-600' : 'text-gray-400'}`}>
                        {commission.toFixed(2)}€
                      </p>
                      {hasCommission && (
                        <p className="text-xs text-green-600 mt-1">¡Meta superada!</p>
                      )}
                    </div>
                    <TrendingUp className={`w-8 h-8 ${hasCommission ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress to Commission */}
            {!hasCommission && (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso hacia comisión (3,000€)</span>
                      <span>{monthlyRevenue}/3,000€</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-barbershop-gold h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min((monthlyRevenue / 3000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Te faltan {(3000 - monthlyRevenue).toFixed(2)}€ para obtener el 10% de comisión
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Today's Appointments and Monthly Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Citas de Hoy ({todayAppointments.length})</h2>
                <div className="space-y-4">
                  {todayAppointments.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        No tienes citas para hoy
                      </CardContent>
                    </Card>
                  ) : (
                    todayAppointments.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-barbershop-dark">
                                {appointment.time}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {getServiceName(appointment.service)}
                              </p>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <User className="w-4 h-4 mr-2" />
                              Cliente: ****** (Protegido)
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Servicio: {getServiceName(appointment.service)}</span>
                              <span className="font-bold text-barbershop-gold">
                                {getServicePrice(appointment.service)}€
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Resumen del Mes</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Facturación Total</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">Servicios</span>
                        <span className="font-bold text-barbershop-gold">{monthlyRevenue}€</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">Bonos Vendidos</span>
                        <span className="font-bold text-purple-600">{myBonusRevenue}€</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Mes:</span>
                        <span className="text-barbershop-gold">{monthlyRevenue + myBonusRevenue}€</span>
                      </div>
                      {hasCommission && (
                        <div className="flex justify-between items-center text-lg font-bold text-green-600 mt-2">
                          <span>Tu Comisión (10%):</span>
                          <span>{commission.toFixed(2)}€</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bonuses" className="space-y-6">
            <div className="flex gap-4 mb-6">
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
            </div>

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

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Ventas de Bonos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Pack</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myBonusSales.map((bonus) => (
                      <TableRow key={bonus.id}>
                        <TableCell>{new Date(bonus.purchaseDate).toLocaleDateString()}</TableCell>
                        <TableCell>{bonus.clientName}</TableCell>
                        <TableCell>{bonus.packageName}</TableCell>
                        <TableCell>€{bonus.totalPrice}</TableCell>
                        <TableCell>
                          <Badge className={bonus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {bonus.status === 'active' ? 'Activo' : 'Completado'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mis Canjes Realizados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Servicio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {redeemHistory.filter(r => r.barberName === barberSession.name).map((redeem, index) => {
                      const bonus = purchasedBonuses.find(b => b.id === redeem.bonusId);
                      return (
                        <TableRow key={index}>
                          <TableCell>{new Date(redeem.redeemDate).toLocaleDateString()}</TableCell>
                          <TableCell>{bonus?.clientName || 'N/A'}</TableCell>
                          <TableCell>{redeem.serviceName}</TableCell>
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
    </div>
  );
};

export default BarberDashboard;
