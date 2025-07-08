import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Mail, 
  Calendar, 
  Gift,
  Eye
} from 'lucide-react';

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

interface ClientsTableProps {
  clients: ClientWithSummary[];
  searchTerm: string;
  onViewClient: (clientId: string) => void;
  isBarberView?: boolean;
}

const ClientsTable = ({ clients, searchTerm, onViewClient, isBarberView = false }: ClientsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'appointments' | 'spent'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Función para enmascarar datos sensibles para barberos
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

  // Filtrar clientes
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar clientes
  const sortedClients = [...filteredClients].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = `${a.name} ${a.last_name || ''}`.toLowerCase();
        bValue = `${b.name} ${b.last_name || ''}`.toLowerCase();
        break;
      case 'created':
        aValue = new Date(a.client_since);
        bValue = new Date(b.client_since);
        break;
      case 'appointments':
        aValue = a.total_appointments || 0;
        bValue = b.total_appointments || 0;
        break;
      case 'spent':
        aValue = a.total_spent || 0;
        bValue = b.total_spent || 0;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginación
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = sortedClients.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (column: 'name' | 'created' | 'appointments' | 'spent') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Controles de tabla */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">de {filteredClients.length} clientes</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ordenar por:</span>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nombre</SelectItem>
              <SelectItem value="created">Fecha registro</SelectItem>
              <SelectItem value="appointments">Citas</SelectItem>
              {!isBarberView && <SelectItem value="spent">Gasto total</SelectItem>}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  Cliente {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('appointments')}
                >
                  Citas {sortBy === 'appointments' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Bonos</TableHead>
                {!isBarberView && (
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('spent')}
                  >
                    Total Gastado {sortBy === 'spent' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                )}
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('created')}
                >
                  Registro {sortBy === 'created' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {client.name} {client.last_name || ''}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {client.id.slice(0, 8)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone className="w-3 h-3 mr-1" />
                        {maskSensitiveData(client.phone, 'phone')}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-1" />
                        {maskSensitiveData(client.email, 'email')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{client.total_appointments || 0}</div>
                      <div className="text-xs text-muted-foreground">
                        Completadas: {client.completed_appointments || 0}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {(client.active_bonus_services || 0) > 0 ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Gift className="w-3 h-3 mr-1" />
                        {client.active_bonus_services}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  {!isBarberView && (
                    <TableCell>
                      <div className="font-medium">
                        €{(client.total_spent || 0).toFixed(2)}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(client.client_since).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewClient(client.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredClients.length)} de {filteredClients.length}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + Math.max(1, currentPage - 2);
                if (pageNum > totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsTable;