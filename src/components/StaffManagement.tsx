import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Edit, Trash2, Calendar, Clock, MapPin, UserCheck, UserX, Building } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PhotoUpload from './PhotoUpload';
import { 
  createBarber, 
  getAllBarbers, 
  updateBarber, 
  deleteBarber, 
  upsertBarberSchedule, 
  getBarbersWithSchedules,
  type Barber, 
  type BarberSchedule 
} from '@/lib/supabase-helpers';

interface BarberWithSchedules extends Barber {
  schedules: BarberSchedule[];
}

const StaffManagement = () => {
  const [barbers, setBarbers] = useState<BarberWithSchedules[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<BarberWithSchedules | null>(null);
  const [isAddingBarber, setIsAddingBarber] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newBarber, setNewBarber] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'cristobal-bordiu' as 'cristobal-bordiu' | 'general-pardinas',
    photo_url: null as string | null,
    schedules: {} as Record<string, {
      is_working: boolean;
      start_time: string;
      end_time: string;
      break_start: string;
      break_end: string;
    }>
  });

  const weekDays = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' }
  ];

  const locations = [
    { id: 'cristobal-bordiu', name: 'Mad Men Cristóbal Bordiú' },
    { id: 'general-pardinas', name: 'Mad Men General Pardiñas' }
  ];

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      setIsLoading(true);
      const data = await getBarbersWithSchedules();
      setBarbers(data);
    } catch (error) {
      console.error('Error al cargar barberos:', error);
      toast.error('Error al cargar los barberos');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeNewBarberSchedules = () => {
    const schedules: Record<string, any> = {};
    weekDays.forEach(day => {
      schedules[day.id] = {
        is_working: day.id !== 'sunday',
        start_time: '09:00',
        end_time: '20:00',
        break_start: '13:00',
        break_end: '14:00'
      };
    });
    setNewBarber({
      name: '',
      email: '',
      phone: '',
      location: 'cristobal-bordiu',
      photo_url: null,
      schedules
    });
  };

  const handleAddBarber = async () => {
    if (!newBarber.name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    try {
      // Crear el barbero
      const barber = await createBarber({
        name: newBarber.name.trim(),
        email: newBarber.email.trim() || undefined,
        phone: newBarber.phone.trim() || undefined,
        location: newBarber.location,
        photo_url: newBarber.photo_url,
        status: 'active'
      });

      // Crear los horarios
      await Promise.all(
        weekDays.map(day =>
          upsertBarberSchedule({
            barber_id: barber.id,
            day_of_week: day.id,
            ...newBarber.schedules[day.id]
          })
        )
      );

      await loadBarbers();
      setIsAddingBarber(false);
      initializeNewBarberSchedules();
      toast.success('Barbero agregado correctamente');
    } catch (error) {
      console.error('Error al agregar barbero:', error);
      toast.error('Error al agregar el barbero');
    }
  };

  const handleUpdateBarber = async () => {
    if (!selectedBarber) return;

    try {
      // Actualizar información del barbero
      await updateBarber(selectedBarber.id, {
        name: selectedBarber.name,
        email: selectedBarber.email,
        phone: selectedBarber.phone,
        location: selectedBarber.location,
        photo_url: selectedBarber.photo_url,
        status: selectedBarber.status
      });

      // Actualizar horarios
      await Promise.all(
        selectedBarber.schedules.map(schedule =>
          upsertBarberSchedule({
            barber_id: selectedBarber.id,
            day_of_week: schedule.day_of_week,
            is_working: schedule.is_working,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            break_start: schedule.break_start,
            break_end: schedule.break_end
          })
        )
      );

      await loadBarbers();
      setIsEditing(false);
      setSelectedBarber(null);
      toast.success('Barbero actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar barbero:', error);
      toast.error('Error al actualizar el barbero');
    }
  };

  const handleDeleteBarber = async (barberId: string) => {
    try {
      await deleteBarber(barberId);
      await loadBarbers();
      toast.success('Barbero eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar barbero:', error);
      toast.error('Error al eliminar el barbero');
    }
  };

  const getWorkingDays = (schedules: BarberSchedule[]) => {
    return schedules
      .filter(schedule => schedule.is_working)
      .map(schedule => weekDays.find(day => day.id === schedule.day_of_week)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      default: return status;
    }
  };

  const updateSelectedBarberSchedule = (dayId: string, field: string, value: any) => {
    if (!selectedBarber) return;

    const updatedSchedules = selectedBarber.schedules.map(schedule => {
      if (schedule.day_of_week === dayId) {
        return { ...schedule, [field]: value };
      }
      return schedule;
    });

    setSelectedBarber({
      ...selectedBarber,
      schedules: updatedSchedules
    });
  };

  const getLocationName = (location: string) => {
    return locations.find(loc => loc.id === location)?.name || location;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-barbershop-gold"></div>
          <span className="ml-3 text-gray-600">Cargando barberos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Gestión de Empleados</h1>
        <p className="text-muted-foreground">Administrar barberos, horarios por día y sedes de trabajo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
                <p className="text-sm text-muted-foreground">Cristóbal Bordiú</p>
                <p className="text-2xl font-bold text-blue-600">
                  {barbers.filter(b => b.location === 'cristobal-bordiu' && b.status === 'active').length}
                </p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">General Pardiñas</p>
                <p className="text-2xl font-bold text-purple-600">
                  {barbers.filter(b => b.location === 'general-pardinas' && b.status === 'active').length}
                </p>
              </div>
              <Building className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactivos</p>
                <p className="text-2xl font-bold text-gray-600">
                  {barbers.filter(b => b.status === 'inactive').length}
                </p>
              </div>
              <UserX className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Barber Button */}
      <div className="mb-6">
        <Dialog open={isAddingBarber} onOpenChange={(open) => {
          setIsAddingBarber(open);
          if (open) initializeNewBarberSchedules();
        }}>
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
              {/* Photo Upload Section */}
              <PhotoUpload
                currentPhotoUrl={newBarber.photo_url}
                onPhotoUpdate={(photoUrl) => setNewBarber({...newBarber, photo_url: photoUrl})}
                barberName={newBarber.name || 'Nuevo Barbero'}
              />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={newBarber.name}
                    onChange={(e) => setNewBarber({...newBarber, name: e.target.value})}
                    placeholder="Ej: Luis Bracho"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newBarber.email}
                    onChange={(e) => setNewBarber({...newBarber, email: e.target.value})}
                    placeholder="barbero@madmen.es"
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
                  <Label htmlFor="location">Sede *</Label>
                  <Select 
                    value={newBarber.location} 
                    onValueChange={(value: 'cristobal-bordiu' | 'general-pardinas') => 
                      setNewBarber({...newBarber, location: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sede" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
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
                            checked={newBarber.schedules[day.id]?.is_working || false}
                            onCheckedChange={(checked) => {
                              setNewBarber({
                                ...newBarber,
                                schedules: {
                                  ...newBarber.schedules,
                                  [day.id]: {
                                    ...newBarber.schedules[day.id],
                                    is_working: checked as boolean
                                  }
                                }
                              });
                            }}
                          />
                          <Label htmlFor={`working-${day.id}`}>Trabaja</Label>
                        </div>
                      </div>
                      
                      {newBarber.schedules[day.id]?.is_working && (
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <Label className="text-xs">Inicio</Label>
                            <Input
                              type="time"
                              value={newBarber.schedules[day.id]?.start_time || '09:00'}
                              onChange={(e) => {
                                setNewBarber({
                                  ...newBarber,
                                  schedules: {
                                    ...newBarber.schedules,
                                    [day.id]: {
                                      ...newBarber.schedules[day.id],
                                      start_time: e.target.value
                                    }
                                  }
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Fin</Label>
                            <Input
                              type="time"
                              value={newBarber.schedules[day.id]?.end_time || '20:00'}
                              onChange={(e) => {
                                setNewBarber({
                                  ...newBarber,
                                  schedules: {
                                    ...newBarber.schedules,
                                    [day.id]: {
                                      ...newBarber.schedules[day.id],
                                      end_time: e.target.value
                                    }
                                  }
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Descanso Inicio</Label>
                            <Input
                              type="time"
                              value={newBarber.schedules[day.id]?.break_start || '13:00'}
                              onChange={(e) => {
                                setNewBarber({
                                  ...newBarber,
                                  schedules: {
                                    ...newBarber.schedules,
                                    [day.id]: {
                                      ...newBarber.schedules[day.id],
                                      break_start: e.target.value
                                    }
                                  }
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Descanso Fin</Label>
                            <Input
                              type="time"
                              value={newBarber.schedules[day.id]?.break_end || '14:00'}
                              onChange={(e) => {
                                setNewBarber({
                                  ...newBarber,
                                  schedules: {
                                    ...newBarber.schedules,
                                    [day.id]: {
                                      ...newBarber.schedules[day.id],
                                      break_end: e.target.value
                                    }
                                  }
                                });
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
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={barber.photo_url || undefined} alt={barber.name} />
                    <AvatarFallback className="bg-barbershop-gold text-barbershop-dark font-bold">
                      {getInitials(barber.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-barbershop-dark">{barber.name}</CardTitle>
                    {barber.email && <p className="text-sm text-muted-foreground">{barber.email}</p>}
                  </div>
                </div>
                <Badge className={getStatusColor(barber.status)}>
                  {getStatusLabel(barber.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {barber.phone && (
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  {barber.phone}
                </div>
              )}
              <div className="flex items-center text-sm">
                <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{getLocationName(barber.location)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                Días de trabajo: {getWorkingDays(barber.schedules)}
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
              {/* Photo Upload Section */}
              <PhotoUpload
                currentPhotoUrl={selectedBarber.photo_url}
                onPhotoUpdate={(photoUrl) => setSelectedBarber({...selectedBarber, photo_url: photoUrl})}
                barberName={selectedBarber.name}
              />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input
                    id="edit-name"
                    value={selectedBarber.name}
                    onChange={(e) => setSelectedBarber({...selectedBarber, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedBarber.email || ''}
                    onChange={(e) => setSelectedBarber({...selectedBarber, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    value={selectedBarber.phone || ''}
                    onChange={(e) => setSelectedBarber({...selectedBarber, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">Sede</Label>
                  <Select 
                    value={selectedBarber.location} 
                    onValueChange={(value: 'cristobal-bordiu' | 'general-pardinas') => 
                      setSelectedBarber({...selectedBarber, location: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Estado</Label>
                  <Select 
                    value={selectedBarber.status} 
                    onValueChange={(value: 'active' | 'inactive') => 
                      setSelectedBarber({...selectedBarber, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Weekly Schedule Editor */}
              <div>
                <Label className="text-lg font-semibold">Horarios por Día</Label>
                <div className="mt-4 space-y-4">
                  {weekDays.map((day) => {
                    const schedule = selectedBarber.schedules.find(s => s.day_of_week === day.id);
                    return (
                      <div key={day.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">{day.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-working-${day.id}`}
                              checked={schedule?.is_working || false}
                              onCheckedChange={(checked) => {
                                updateSelectedBarberSchedule(day.id, 'is_working', checked);
                              }}
                            />
                            <Label htmlFor={`edit-working-${day.id}`}>Trabaja</Label>
                          </div>
                        </div>
                        
                        {schedule?.is_working && (
                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <Label className="text-xs">Inicio</Label>
                              <Input
                                type="time"
                                value={schedule.start_time || '09:00'}
                                onChange={(e) => updateSelectedBarberSchedule(day.id, 'start_time', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Fin</Label>
                              <Input
                                type="time"
                                value={schedule.end_time || '20:00'}
                                onChange={(e) => updateSelectedBarberSchedule(day.id, 'end_time', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Descanso Inicio</Label>
                              <Input
                                type="time"
                                value={schedule.break_start || '13:00'}
                                onChange={(e) => updateSelectedBarberSchedule(day.id, 'break_start', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Descanso Fin</Label>
                              <Input
                                type="time"
                                value={schedule.break_end || '14:00'}
                                onChange={(e) => updateSelectedBarberSchedule(day.id, 'break_end', e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
