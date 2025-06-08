
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
import { Checkbox } from '@/components/ui/checkbox';

interface DaySchedule {
  isWorking: boolean;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
}

interface WeekSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface Barber {
  id: string;
  name: string;
  location: string;
  username: string;
  phone: string;
  email: string;
  weekSchedule: WeekSchedule;
  status: 'active' | 'vacation' | 'sick' | 'inactive';
  vacationDates?: { start: string; end: string; reason: string }[];
}

const StaffManagement = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isAddingBarber, setIsAddingBarber] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const defaultDaySchedule: DaySchedule = {
    isWorking: true,
    start: '09:00',
    end: '20:00',
    breakStart: '13:00',
    breakEnd: '14:00'
  };

  const defaultWeekSchedule: WeekSchedule = {
    monday: { ...defaultDaySchedule },
    tuesday: { ...defaultDaySchedule },
    wednesday: { ...defaultDaySchedule },
    thursday: { ...defaultDaySchedule },
    friday: { ...defaultDaySchedule },
    saturday: { ...defaultDaySchedule },
    sunday: { ...defaultDaySchedule, isWorking: false }
  };

  const [newBarber, setNewBarber] = useState<Partial<Barber>>({
    name: '',
    location: 'cristobal-bordiu',
    username: '',
    phone: '',
    email: '',
    weekSchedule: defaultWeekSchedule,
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
      const storedBarbers = JSON.parse(stored);
      // Migrar datos antiguos al nuevo formato si es necesario
      const migratedBarbers = storedBarbers.map((barber: any) => {
        if (barber.workHours && !barber.weekSchedule) {
          // Migrar formato antiguo al nuevo
          return {
            ...barber,
            weekSchedule: {
              monday: { isWorking: true, ...barber.workHours },
              tuesday: { isWorking: true, ...barber.workHours },
              wednesday: { isWorking: true, ...barber.workHours },
              thursday: { isWorking: true, ...barber.workHours },
              friday: { isWorking: true, ...barber.workHours },
              saturday: { isWorking: true, ...barber.workHours },
              sunday: { isWorking: false, ...barber.workHours }
            }
          };
        }
        return barber;
      });
      setBarbers(migratedBarbers);
      localStorage.setItem('barbers', JSON.stringify(migratedBarbers));
    } else {
      // Datos iniciales con el nuevo formato
      const initialBarbers: Barber[] = [
        {
          id: 'luis-bracho',
          name: 'Luis Bracho',
          location: 'cristobal-bordiu',
          username: 'luis.bracho',
          phone: '+34 600 123 456',
          email: 'luis.bracho@madmen.es',
          weekSchedule: {
            monday: { isWorking: true, start: '09:00', end: '20:00', breakStart: '13:00', breakEnd: '14:00' },
            tuesday: { isWorking: true, start: '09:00', end: '20:00', breakStart: '13:00', breakEnd: '14:00' },
            wednesday: { isWorking: true, start: '10:00', end: '21:00', breakStart: '14:00', breakEnd: '15:00' },
            thursday: { isWorking: true, start: '09:00', end: '20:00', breakStart: '13:00', breakEnd: '14:00' },
            friday: { isWorking: true, start: '09:00', end: '20:00', breakStart: '13:00', breakEnd: '14:00' },
            saturday: { isWorking: true, start: '10:00', end: '19:00', breakStart: '13:30', breakEnd: '14:30' },
            sunday: { isWorking: false, start: '09:00', end: '20:00', breakStart: '13:00', breakEnd: '14:00' }
          },
          status: 'active'
        },
        {
          id: 'isaac-hernandez',
          name: 'Isaac Hernández',
          location: 'general-pardinas',
          username: 'isaac.hernandez',
          phone: '+34 600 789 012',
          email: 'isaac.hernandez@madmen.es',
          weekSchedule: {
            monday: { isWorking: true, start: '10:00', end: '21:00', breakStart: '14:00', breakEnd: '15:00' },
            tuesday: { isWorking: true, start: '10:00', end: '21:00', breakStart: '14:00', breakEnd: '15:00' },
            wednesday: { isWorking: true, start: '09:00', end: '20:00', breakStart: '13:00', breakEnd: '14:00' },
            thursday: { isWorking: true, start: '10:00', end: '21:00', breakStart: '14:00', breakEnd: '15:00' },
            friday: { isWorking: true, start: '10:00', end: '21:00', breakStart: '14:00', breakEnd: '15:00' },
            saturday: { isWorking: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
            sunday: { isWorking: false, start: '10:00', end: '21:00', breakStart: '14:00', breakEnd: '15:00' }
          },
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
      weekSchedule: newBarber.weekSchedule!,
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
      weekSchedule: defaultWeekSchedule,
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

  const updateDaySchedule = (
    barber: Barber, 
    day: keyof WeekSchedule, 
    field: keyof DaySchedule, 
    value: string | boolean
  ) => {
    return {
      ...barber,
      weekSchedule: {
        ...barber.weekSchedule,
        [day]: {
          ...barber.weekSchedule[day],
          [field]: value
        }
      }
    };
  };

  const getWorkingDays = (weekSchedule: WeekSchedule) => {
    return Object.entries(weekSchedule)
      .filter(([_, schedule]) => schedule.isWorking)
      .map(([day, _]) => weekDays.find(wd => wd.id === day)?.name)
      .join(', ');
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
        <p className="text-muted-foreground">Administrar barberos, horarios por día y disponibilidad</p>
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Barbero</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
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
              </div>

              {/* Weekly Schedule */}
              <div>
                <Label className="text-lg font-semibold">Horarios por Día</Label>
                <div className="mt-4 space-y-4">
                  {weekDays.map((day) => (
                    <div key={day.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{day.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`working-${day.id}`}
                            checked={newBarber.weekSchedule?.[day.id as keyof WeekSchedule]?.isWorking || false}
                            onCheckedChange={(checked) => {
                              if (newBarber.weekSchedule) {
                                setNewBarber({
                                  ...newBarber,
                                  weekSchedule: {
                                    ...newBarber.weekSchedule,
                                    [day.id]: {
                                      ...newBarber.weekSchedule[day.id as keyof WeekSchedule],
                                      isWorking: checked as boolean
                                    }
                                  }
                                });
                              }
                            }}
                          />
                          <Label htmlFor={`working-${day.id}`}>Trabaja</Label>
                        </div>
                      </div>
                      
                      {newBarber.weekSchedule?.[day.id as keyof WeekSchedule]?.isWorking && (
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <Label className="text-xs">Inicio</Label>
                            <Input
                              type="time"
                              value={newBarber.weekSchedule[day.id as keyof WeekSchedule]?.start || '09:00'}
                              onChange={(e) => {
                                if (newBarber.weekSchedule) {
                                  setNewBarber({
                                    ...newBarber,
                                    weekSchedule: {
                                      ...newBarber.weekSchedule,
                                      [day.id]: {
                                        ...newBarber.weekSchedule[day.id as keyof WeekSchedule],
                                        start: e.target.value
                                      }
                                    }
                                  });
                                }
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Fin</Label>
                            <Input
                              type="time"
                              value={newBarber.weekSchedule[day.id as keyof WeekSchedule]?.end || '20:00'}
                              onChange={(e) => {
                                if (newBarber.weekSchedule) {
                                  setNewBarber({
                                    ...newBarber,
                                    weekSchedule: {
                                      ...newBarber.weekSchedule,
                                      [day.id]: {
                                        ...newBarber.weekSchedule[day.id as keyof WeekSchedule],
                                        end: e.target.value
                                      }
                                    }
                                  });
                                }
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Descanso Inicio</Label>
                            <Input
                              type="time"
                              value={newBarber.weekSchedule[day.id as keyof WeekSchedule]?.breakStart || '13:00'}
                              onChange={(e) => {
                                if (newBarber.weekSchedule) {
                                  setNewBarber({
                                    ...newBarber,
                                    weekSchedule: {
                                      ...newBarber.weekSchedule,
                                      [day.id]: {
                                        ...newBarber.weekSchedule[day.id as keyof WeekSchedule],
                                        breakStart: e.target.value
                                      }
                                    }
                                  });
                                }
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Descanso Fin</Label>
                            <Input
                              type="time"
                              value={newBarber.weekSchedule[day.id as keyof WeekSchedule]?.breakEnd || '14:00'}
                              onChange={(e) => {
                                if (newBarber.weekSchedule) {
                                  setNewBarber({
                                    ...newBarber,
                                    weekSchedule: {
                                      ...newBarber.weekSchedule,
                                      [day.id]: {
                                        ...newBarber.weekSchedule[day.id as keyof WeekSchedule],
                                        breakEnd: e.target.value
                                      }
                                    }
                                  });
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
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
                Días de trabajo: {getWorkingDays(barber.weekSchedule)}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Barbero: {selectedBarber?.name}</DialogTitle>
          </DialogHeader>
          {selectedBarber && (
            <div className="space-y-6">
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
              
              {/* Weekly Schedule Editor */}
              <div>
                <Label className="text-lg font-semibold">Horarios por Día</Label>
                <div className="mt-4 space-y-4">
                  {weekDays.map((day) => (
                    <div key={day.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{day.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-working-${day.id}`}
                            checked={selectedBarber.weekSchedule[day.id as keyof WeekSchedule]?.isWorking || false}
                            onCheckedChange={(checked) => {
                              setSelectedBarber(updateDaySchedule(selectedBarber, day.id as keyof WeekSchedule, 'isWorking', checked as boolean));
                            }}
                          />
                          <Label htmlFor={`edit-working-${day.id}`}>Trabaja</Label>
                        </div>
                      </div>
                      
                      {selectedBarber.weekSchedule[day.id as keyof WeekSchedule]?.isWorking && (
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <Label className="text-xs">Inicio</Label>
                            <Input
                              type="time"
                              value={selectedBarber.weekSchedule[day.id as keyof WeekSchedule]?.start || '09:00'}
                              onChange={(e) => setSelectedBarber(updateDaySchedule(selectedBarber, day.id as keyof WeekSchedule, 'start', e.target.value))}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Fin</Label>
                            <Input
                              type="time"
                              value={selectedBarber.weekSchedule[day.id as keyof WeekSchedule]?.end || '20:00'}
                              onChange={(e) => setSelectedBarber(updateDaySchedule(selectedBarber, day.id as keyof WeekSchedule, 'end', e.target.value))}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Descanso Inicio</Label>
                            <Input
                              type="time"
                              value={selectedBarber.weekSchedule[day.id as keyof WeekSchedule]?.breakStart || '13:00'}
                              onChange={(e) => setSelectedBarber(updateDaySchedule(selectedBarber, day.id as keyof WeekSchedule, 'breakStart', e.target.value))}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Descanso Fin</Label>
                            <Input
                              type="time"
                              value={selectedBarber.weekSchedule[day.id as keyof WeekSchedule]?.breakEnd || '14:00'}
                              onChange={(e) => setSelectedBarber(updateDaySchedule(selectedBarber, day.id as keyof WeekSchedule, 'breakEnd', e.target.value))}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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
