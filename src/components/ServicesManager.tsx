
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scissors, Plus, Edit, Trash2, DollarSign, Package } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getAllServices, 
  createService, 
  updateService, 
  deleteService, 
  type Service,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product
} from '@/lib/supabase-helpers';

const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    category: 'corte',
    active: true
  });

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'pomada',
    active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar servicios y productos desde Supabase
      const [servicesData, productsData] = await Promise.all([
        getAllServices(),
        getAllProducts()
      ]);
      
      setServices(servicesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      toast.error('Nombre y precio son obligatorios');
      return;
    }

    try {
      const serviceData = {
        name: newService.name!,
        description: newService.description || '',
        price: newService.price!,
        duration: newService.duration!,
        category: newService.category!,
        active: true
      };

      await createService(serviceData);
      await loadData(); // Recargar datos
      setIsAddingService(false);
      setNewService({
        name: '',
        description: '',
        price: 0,
        duration: 30,
        category: 'corte',
        active: true
      });
      toast.success('Servicio agregado correctamente');
    } catch (error) {
      console.error('Error al agregar servicio:', error);
      toast.error('Error al agregar el servicio');
    }
  };

  const handleUpdateService = async () => {
    if (!selectedService) return;
    
    try {
      await updateService(selectedService.id, {
        name: selectedService.name,
        description: selectedService.description,
        price: selectedService.price,
        duration: selectedService.duration,
        category: selectedService.category,
        active: selectedService.active
      });
      await loadData(); // Recargar datos
      setIsEditingService(false);
      toast.success('Servicio actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      toast.error('Error al actualizar el servicio');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      await loadData(); // Recargar datos
      toast.success('Servicio eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      toast.error('Error al eliminar el servicio');
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error('Nombre y precio son obligatorios');
      return;
    }

    try {
      const productData = {
        name: newProduct.name!,
        description: newProduct.description || '',
        price: newProduct.price!,
        stock: newProduct.stock!,
        category: newProduct.category!,
        active: true
      };

      await createProduct(productData);
      await loadData(); // Recargar datos
      setIsAddingProduct(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: 'pomada',
        active: true
      });
      toast.success('Producto agregado correctamente');
    } catch (error) {
      console.error('Error al agregar producto:', error);
      toast.error('Error al agregar el producto');
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await updateProduct(selectedProduct.id, {
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
        category: selectedProduct.category,
        active: selectedProduct.active
      });
      await loadData(); // Recargar datos
      setIsEditingProduct(false);
      toast.success('Producto actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.error('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      await loadData(); // Recargar datos
      toast.success('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'corte': return 'bg-blue-100 text-blue-800';
      case 'barba': return 'bg-green-100 text-green-800';
      case 'combo': return 'bg-purple-100 text-purple-800';
      case 'tratamiento': return 'bg-orange-100 text-orange-800';
      case 'pomada': return 'bg-yellow-100 text-yellow-800';
      case 'cera': return 'bg-indigo-100 text-indigo-800';
      case 'pasta': return 'bg-pink-100 text-pink-800';
      case 'acabado': return 'bg-teal-100 text-teal-800';
      case 'cuidado': return 'bg-emerald-100 text-emerald-800';
      case 'aceite': return 'bg-amber-100 text-amber-800';
      case 'otros': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-barbershop-gold mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando gestión de servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Gestión de Servicios y Productos</h1>
        <p className="text-muted-foreground">Administrar precios, servicios y productos de la barbería</p>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {/* Services Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Servicios</p>
                    <p className="text-2xl font-bold text-barbershop-dark">{services.length}</p>
                  </div>
                  <Scissors className="w-8 h-8 text-barbershop-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Precio Promedio</p>
                    <p className="text-2xl font-bold text-barbershop-gold">
                      €{services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length) : 0}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-barbershop-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Activos</p>
                    <p className="text-2xl font-bold text-green-600">
                      {services.filter(s => s.active).length}
                    </p>
                  </div>
                  <Scissors className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Duración Promedio</p>
                    <p className="text-2xl font-bold text-barbershop-dark">
                      {services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length) : 0}min
                    </p>
                  </div>
                  <Scissors className="w-8 h-8 text-barbershop-gold" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Service Button */}
          <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
            <DialogTrigger asChild>
              <Button className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Servicio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="service-name">Nombre del Servicio</Label>
                  <Input
                    id="service-name"
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    placeholder="Ej: Corte Moderno"
                  />
                </div>
                <div>
                  <Label htmlFor="service-description">Descripción</Label>
                  <Textarea
                    id="service-description"
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    placeholder="Descripción del servicio..."
                  />
                </div>
                <div>
                  <Label htmlFor="service-category">Categoría</Label>
                  <Select value={newService.category} onValueChange={(value) => setNewService({...newService, category: value as 'corte' | 'barba' | 'combo' | 'tratamiento'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corte">Corte</SelectItem>
                      <SelectItem value="barba">Barba</SelectItem>
                      <SelectItem value="combo">Combo</SelectItem>
                      <SelectItem value="tratamiento">Tratamiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="service-price">Precio (€)</Label>
                    <Input
                      id="service-price"
                      type="number"
                      value={newService.price}
                      step={"0.1"}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const parsed = Number(raw);
                        console.log("raw: ", raw, parsed)
                        if (!isNaN(parsed)) {
                          setNewService({ ...newService, price: parsed });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="service-duration">Duración (min)</Label>
                    <Input
                      id="service-duration"
                      type="number"
                      value={newService.duration}
                      onChange={(e) => setNewService({...newService, duration: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingService(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddService} className="bg-barbershop-gold text-barbershop-dark">
                    Agregar Servicio
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-barbershop-dark">{service.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <Badge className={getCategoryColor(service.category)}>
                      {service.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Precio:</span>
                    <span className="text-lg font-bold text-barbershop-gold">€{service.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Duración:</span>
                    <span className="text-sm">{service.duration} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estado:</span>
                    <Badge className={service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {service.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedService(service);
                        setIsEditingService(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Products Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Productos</p>
                    <p className="text-2xl font-bold text-barbershop-dark">{products.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-barbershop-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Inventario</p>
                    <p className="text-2xl font-bold text-barbershop-gold">
                      €{products.reduce((sum, p) => sum + (p.price * p.stock), 0)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-barbershop-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Total</p>
                    <p className="text-2xl font-bold text-barbershop-dark">
                      {products.reduce((sum, p) => sum + p.stock, 0)}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-barbershop-gold" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Product Button */}
          <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
            <DialogTrigger asChild>
              <Button className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-name">Nombre del Producto</Label>
                  <Input
                    id="product-name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Ej: Pomada Premium"
                  />
                </div>
                <div>
                  <Label htmlFor="product-description">Descripción</Label>
                  <Textarea
                    id="product-description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Descripción del producto..."
                  />
                </div>
                <div>
                  <Label htmlFor="product-category">Categoría</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value as 'pomada' | 'shampoo' | 'aceite' | 'accesorio' | 'cera' | 'pasta' | 'acabado' | 'cuidado' | 'otros'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pomada">Pomada</SelectItem>
                      <SelectItem value="cera">Cera</SelectItem>
                      <SelectItem value="pasta">Pasta</SelectItem>
                      <SelectItem value="acabado">Acabado</SelectItem>
                      <SelectItem value="cuidado">Cuidado</SelectItem>
                      <SelectItem value="aceite">Aceite</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-price">Precio (€)</Label>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-stock">Stock</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddProduct} className="bg-barbershop-gold text-barbershop-dark">
                    Agregar Producto
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-barbershop-dark">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                    <Badge className={getCategoryColor(product.category)}>
                      {product.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Precio:</span>
                    <span className="text-lg font-bold text-barbershop-gold">€{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Stock:</span>
                    <span className={`text-sm font-medium ${product.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stock} unidades
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estado:</span>
                    <Badge className={product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {product.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsEditingProduct(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Service Dialog */}
      <Dialog open={isEditingService} onOpenChange={setIsEditingService}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Servicio: {selectedService?.name}</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-service-name">Nombre</Label>
                <Input
                  id="edit-service-name"
                  value={selectedService.name}
                  onChange={(e) => setSelectedService({...selectedService, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-service-description">Descripción</Label>
                <Textarea
                  id="edit-service-description"
                  value={selectedService.description || ''}
                  onChange={(e) => setSelectedService({...selectedService, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-service-category">Categoría</Label>
                <Select value={selectedService.category} onValueChange={(value) => setSelectedService({...selectedService, category: value as 'corte' | 'barba' | 'combo' | 'tratamiento'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corte">Corte</SelectItem>
                    <SelectItem value="barba">Barba</SelectItem>
                    <SelectItem value="combo">Combo</SelectItem>
                    <SelectItem value="tratamiento">Tratamiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-service-price">Precio (€)</Label>
                  <Input
                    id="edit-service-price"
                    type="number"
                    value={selectedService.price}
                    onChange={(e) => setSelectedService({...selectedService, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-service-duration">Duración (min)</Label>
                  <Input
                    id="edit-service-duration"
                    type="number"
                    value={selectedService.duration}
                    onChange={(e) => setSelectedService({...selectedService, duration: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-service-active"
                  checked={selectedService.active}
                  onChange={(e) => setSelectedService({...selectedService, active: e.target.checked})}
                />
                <Label htmlFor="edit-service-active">Servicio activo</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditingService(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateService} className="bg-barbershop-gold text-barbershop-dark">
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditingProduct} onOpenChange={setIsEditingProduct}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto: {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-product-name">Nombre</Label>
                <Input
                  id="edit-product-name"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-product-description">Descripción</Label>
                <Textarea
                  id="edit-product-description"
                  value={selectedProduct.description || ''}
                  onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-product-category">Categoría</Label>
                <Select value={selectedProduct.category} onValueChange={(value) => setSelectedProduct({...selectedProduct, category: value as 'pomada' | 'shampoo' | 'aceite' | 'accesorio' | 'cera' | 'pasta' | 'acabado' | 'cuidado' | 'otros'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pomada">Pomada</SelectItem>
                    <SelectItem value="cera">Cera</SelectItem>
                    <SelectItem value="pasta">Pasta</SelectItem>
                    <SelectItem value="acabado">Acabado</SelectItem>
                    <SelectItem value="cuidado">Cuidado</SelectItem>
                    <SelectItem value="aceite">Aceite</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-product-price">Precio (€)</Label>
                  <Input
                    id="edit-product-price"
                    type="number"
                    step="0.01"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({...selectedProduct, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-product-stock">Stock</Label>
                  <Input
                    id="edit-product-stock"
                    type="number"
                    value={selectedProduct.stock}
                    onChange={(e) => setSelectedProduct({...selectedProduct, stock: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-product-active"
                  checked={selectedProduct.active}
                  onChange={(e) => setSelectedProduct({...selectedProduct, active: e.target.checked})}
                />
                <Label htmlFor="edit-product-active">Producto activo</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditingProduct(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateProduct} className="bg-barbershop-gold text-barbershop-dark">
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

export default ServicesManager;
