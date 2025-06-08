
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Plus, Edit, Trash2, Calendar, Clock, MapPin, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

interface Barber {
  id: string;
  name: string;
  location: string;
  username: string;
  phone: string;
  email: string;
  workHours: {
    start: string;
    end: string;
    breakStart: string;
    breakEnd: string;
  };
  workDays: string[];
  status: 'active' | 'vacation' | 'sick' | 'inactive';
  vacationDates?: { start: string; end: string; reason: string }[];
}

const StaffManagement = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isAddingBarber, setIsAddingBarber] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newBarber, setNewBarber] = useState<Partial<Barber>>({
    name: '',
    location: 'cristobal-bordiu',
    username: '',
    phone: '',
    email: '',
    workHours: { start: '09:00', end: '20:00', breakStart: '13:00', breakEnd: '14:00' },
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    status: 'active'
  });

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  const weekDays = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' }
  ];

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = () => {
    const stored = localStorage.getItem('barbers');
    if (stored) {
      setBarbers(JSON.parse(stored));
    } else {
      // Datos iniciales
      const initialBarbers: Barber[] = [
        {
          id: 'luis-bracho',
          name: 'Luis Bracho',
          location: 'cristobal-bordiu',
          username: 'luis.bracho',
          phone: '+34 600 123 456',
          email: 'luis.bracho@madmen.es',
          workHours: { start: '09:00', end: '20:00', breakStart: '13:00', breakEnd: '14:00' },
          workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          status: 'active'
        },
        {
          id: 'isaac-hernandez',
          name: 'Isaac Hernández',
          location: 'general-pardinas',
          username: 'isaac.hernandez',
          phone: '+34 600 789 012',
          email: 'isaac.hernandez@madmen.es',
          workHours: { start: '10:00', end: '21:00', breakStart: '14:00', breakEnd: '15:00' },
          workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          status: 'active'
        }
      ];
      setBarbers(initialBarbers);
      localStorage.setItem('barbers', JSON.stringify(initialBarbers));
    }
  };

  const saveBarbers = (updatedBarbers: Barber[]) => {
    setBarbers(updatedBarbers);
    localStorage.setItem('barbers', JSON.stringify(updatedBarbers));
  };

  const handleAddBarber = () => {
    if (!newBarber.name || !newBarber.username) {
      toast.error('Nombre y usuario son obligatorios');
      return;
    }

    const barber: Barber = {
      id: newBarber.username!.replace(/\./g, '-'),
      name: newBarber.name!,
      location: newBarber.location!,
      username: newBarber.username!,
      phone: newBarber.phone || '',
      email: newBarber.email || '',
      workHours: newBarber.workHours!,
      workDays: newBarber.workDays!,
      status: 'active'
    };

    const updatedBarbers = [...barbers, barber];
    saveBarbers(updatedBarbers);
    setIsAddingBarber(false);
    setNewBarber({
      name: '',
      location: 'cristobal-bordiu',
      username: '',
      phone: '',
      email: '',
      workHours: { start: '09:00', end: '20:00', breakStart: '13:00', breakEnd: '14:00' },
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      status: 'active'
    });
    toast.success('Barbero agregado correctamente');
  };

  const handleUpdateBarber = () => {
    if (!selectedBarber) return;
    
    const updatedBarbers = barbers.map(b => 
      b.id === selectedBarber.id ? selectedBarber : b
    );
    saveBarbers(updatedBarbers);
    setIsEditing(false);
    toast.success('Barbero actualizado correctamente');
  };

  const handleDeleteBarber = (barberId: string) => {
    const updatedBarbers = barbers.filter(b => b.id !== barberId);
    saveBarbers(updatedBarbers);
    toast.success('Barbero eliminado correctamente');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'vacation': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'vacation': return 'Vacaciones';
      case 'sick': return 'Baja médica';
      case 'inactive': return 'Inactivo';
      default: return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Gestión de Empleados</h1>
        <p className="text-muted-foreground">Administrar barberos, horarios y disponibilidad</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Barberos</p>
                <p className="text-2xl font-bold text-barbershop-dark">{barbers.length}</p>
              </div>
              <Users className="w-8 h-8 text-barbershop-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {barbers.filter(b => b.status === 'active').length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Vacaciones</p>
                <p className="text-2xl font-bold text-blue-600">
                  {barbers.filter(b => b.status === 'vacation').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bajas</p>
                <p className="text-2xl font-bold text-red-600">
                  {barbers.filter(b => b.status === 'sick').length}
                </p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Barber Button */}
      <div className="mb-6">
        <Dialog open={isAddingBarber} onOpenChange={setIsAddingBarber}>
          <DialogTrigger asChild>
            <Button className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Barbero
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Barbero</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={newBarber.name}
                  onChange={(e) => setNewBarber({...newBarber, name: e.target.value})}
                  placeholder="Ej: Luis Bracho"
                />
              </div>
              <div>
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  value={newBarber.username}
                  onChange={(e) => setNewBarber({...newBarber, username: e.target.value})}
                  placeholder="Ej: luis.bracho"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={newBarber.phone}
                  onChange={(e) => setNewBarber({...newBarber, phone: e.target.value})}
                  placeholder="+34 600 123 456"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={newBarber.email}
                  onChange={(e) => setNewBarber({...newBarber, email: e.target.value})}
                  placeholder="barbero@madmen.es"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="location">Centro</Label>
                <Select 
                  value={newBarber.location} 
                  onValueChange={(value) => setNewBarber({...newBarber, location: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 grid grid-cols-4 gap-2">
                <div>
                  <Label>Hora Inicio</Label>
                  <Input
                    type="time"
                    value={newBarber.workHours?.start}
                    onChange={(e) => setNewBarber({
                      ...newBarber, 
                      workHours: {...newBarber.workHours!, start: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label>Hora Fin</Label>
                  <Input
                    type="time"
                    value={newBarber.workHours?.end}
                    onChange={(e) => setNewBarber({
                      ...newBarber, 
                      workHours: {...newBarber.workHours!, end: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label>Descanso Inicio</Label>
                  <Input
                    type="time"
                    value={newBarber.workHours?.breakStart}
                    onChange={(e) => setNewBarber({
                      ...newBarber, 
                      workHours: {...newBarber.workHours!, breakStart: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label>Descanso Fin</Label>
                  <Input
                    type="time"
                    value={newBarber.workHours?.breakEnd}
                    onChange={(e) => setNewBarber({
                      ...newBarber, 
                      workHours: {...newBarber.workHours!, breakEnd: e.target.value}
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddingBarber(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddBarber} className="bg-barbershop-gold text-barbershop-dark">
                Agregar Barbero
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barbers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {barbers.map((barber) => (
          <Card key={barber.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-barbershop-dark">{barber.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{barber.username}</p>
                </div>
                <Badge className={getStatusColor(barber.status)}>
                  {getStatusLabel(barber.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                {locations.find(l => l.id === barber.location)?.name}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                {barber.workHours.start} - {barber.workHours.end}
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground mb-1">Descanso:</p>
                <p>{barber.workHours.breakStart} - {barber.workHours.breakEnd}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedBarber(barber);
                    setIsEditing(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDeleteBarber(barber.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Barbero: {selectedBarber?.name}</DialogTitle>
          </DialogHeader>
          {selectedBarber && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input
                    id="edit-name"
                    value={selectedBarber.name}
                    onChange={(e) => setSelectedBarber({...selectedBarber, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Estado</Label>
                  <Select 
                    value={selectedBarber.status} 
                    onValueChange={(value: any) => setSelectedBarber({...selectedBarber, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="vacation">Vacaciones</SelectItem>
                      <SelectItem value="sick">Baja médica</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <Label>Hora Inicio</Label>
                  <Input
                    type="time"
                    value={selectedBarber.workHours.start}
                    onChange={(e) => setSelectedBarber({
                      ...selectedBarber, 
                      workHours: {...selectedBarber.workHours, start: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label>Hora Fin</Label>
                  <Input
                    type="time"
                    value={selectedBarber.workHours.end}
                    onChange={(e) => setSelectedBarber({
                      ...selectedBarber, 
                      workHours: {...selectedBarber.workHours, end: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label>Descanso Inicio</Label>
                  <Input
                    type="time"
                    value={selectedBarber.workHours.breakStart}
                    onChange={(e) => setSelectedBarber({
                      ...selectedBarber, 
                      workHours: {...selectedBarber.workHours, breakStart: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label>Descanso Fin</Label>
                  <Input
                    type="time"
                    value={selectedBarber.workHours.breakEnd}
                    onChange={(e) => setSelectedBarber({
                      ...selectedBarber, 
                      workHours: {...selectedBarber.workHours, breakEnd: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateBarber} className="bg-barbershop-gold text-barbershop-dark">
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
