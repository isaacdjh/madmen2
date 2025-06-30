
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { createOrGetClient } from '@/lib/supabase-helpers';
import * as XLSX from 'xlsx';

interface BooksyClient {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  totalVisits?: number;
  lastVisit?: string;
  totalSpent?: number;
  notes?: string;
}

const ClientImporter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    total: number;
    imported: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResults(null);
    }
  };

  const normalizePhoneNumber = (phone: string): string => {
    if (!phone) return '';
    
    // Limpiar el número de espacios, guiones, paréntesis
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Si empieza con +34, mantenerlo
    if (cleaned.startsWith('+34')) {
      return cleaned;
    }
    
    // Si empieza con 34, agregar +
    if (cleaned.startsWith('34') && cleaned.length === 11) {
      return '+' + cleaned;
    }
    
    // Si es un número español de 9 dígitos, agregar +34
    if (cleaned.length === 9 && !cleaned.startsWith('0')) {
      return '+34' + cleaned;
    }
    
    return cleaned;
  };

  const normalizeEmail = (email: string): string => {
    if (!email) return '';
    return email.toLowerCase().trim();
  };

  const processExcelFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    
    const errors: string[] = [];
    let imported = 0;
    let total = 0;

    try {
      // Leer el archivo Excel
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      if (jsonData.length < 2) {
        errors.push('El archivo debe tener al menos una fila de encabezados y una fila de datos');
        setResults({ total: 0, imported: 0, errors });
        return;
      }

      // Obtener encabezados (primera fila)
      const headers = jsonData[0].map((h: any) => String(h).toLowerCase().trim());
      console.log('Encabezados encontrados:', headers);

      // Mapear posibles nombres de columnas
      const columnMap = {
        name: headers.findIndex(h => h.includes('name') || h.includes('nombre') || h.includes('client')),
        firstName: headers.findIndex(h => h.includes('first') || h.includes('nombre')),
        lastName: headers.findIndex(h => h.includes('last') || h.includes('apellido')),
        email: headers.findIndex(h => h.includes('email') || h.includes('correo')),
        phone: headers.findIndex(h => h.includes('phone') || h.includes('teléfono') || h.includes('telefono') || h.includes('mobile') || h.includes('móvil')),
        totalVisits: headers.findIndex(h => h.includes('visit') || h.includes('cita') || h.includes('appointment')),
        lastVisit: headers.findIndex(h => h.includes('last visit') || h.includes('última') || h.includes('recent')),
        totalSpent: headers.findIndex(h => h.includes('spent') || h.includes('total') || h.includes('amount') || h.includes('gastado'))
      };

      console.log('Mapeo de columnas:', columnMap);

      // Procesar filas de datos (saltando la primera que son encabezados)
      const dataRows = jsonData.slice(1);
      total = dataRows.length;

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        setProgress((i / total) * 100);

        try {
          // Extraer datos de la fila
          const clientData: BooksyClient = {
            name: row[columnMap.name] ? String(row[columnMap.name]).trim() : '',
            firstName: row[columnMap.firstName] ? String(row[columnMap.firstName]).trim() : '',
            lastName: row[columnMap.lastName] ? String(row[columnMap.lastName]).trim() : '',
            email: row[columnMap.email] ? normalizeEmail(String(row[columnMap.email])) : '',
            phone: row[columnMap.phone] ? normalizePhoneNumber(String(row[columnMap.phone])) : '',
            totalVisits: row[columnMap.totalVisits] ? Number(row[columnMap.totalVisits]) : 0,
            lastVisit: row[columnMap.lastVisit] ? String(row[columnMap.lastVisit]) : '',
            totalSpent: row[columnMap.totalSpent] ? Number(row[columnMap.totalSpent]) : 0
          };

          // Determinar nombre completo
          let fullName = clientData.name;
          if (!fullName && (clientData.firstName || clientData.lastName)) {
            fullName = `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim();
          }

          // Validar datos mínimos
          if (!fullName) {
            errors.push(`Fila ${i + 2}: Falta el nombre del cliente`);
            continue;
          }

          if (!clientData.email && !clientData.phone) {
            errors.push(`Fila ${i + 2}: Falta email o teléfono para ${fullName}`);
            continue;
          }

          // Crear email temporal si no existe
          const email = clientData.email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@temp.booksy`;
          
          // Crear teléfono temporal si no existe
          const phone = clientData.phone || `+34${String(Date.now()).slice(-9)}`;

          // Intentar crear/obtener cliente
          await createOrGetClient(
            clientData.firstName || fullName,
            phone,
            email
          );

          imported++;
          
        } catch (error) {
          console.error(`Error procesando fila ${i + 2}:`, error);
          errors.push(`Fila ${i + 2}: Error al procesar - ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      }

      setResults({
        total,
        imported,
        errors: errors.slice(0, 10) // Mostrar máximo 10 errores
      });

    } catch (error) {
      console.error('Error procesando archivo:', error);
      errors.push(`Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setResults({ total: 0, imported: 0, errors });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6" />
            Importar Clientes desde Booksy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instrucciones */}
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <strong>Formato esperado del Excel:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Primera fila: Encabezados (Name, Email, Phone, etc.)</li>
                <li>• Siguientes filas: Datos de clientes</li>
                <li>• Al menos debe tener nombre y email o teléfono</li>
                <li>• Los teléfonos se normalizarán automáticamente a formato español</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Selector de archivo */}
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Haz clic para subir</span> el archivo Excel
                  </p>
                  <p className="text-xs text-gray-500">XLSX, XLS (MAX. 10MB)</p>
                </div>
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
          </div>

          {/* Botón de procesamiento */}
          <Button 
            onClick={processExcelFile}
            disabled={!file || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Procesando...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Importar Clientes
              </>
            )}
          </Button>

          {/* Barra de progreso */}
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-gray-600">
                Procesando... {Math.round(progress)}%
              </p>
            </div>
          )}

          {/* Resultados */}
          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total procesados</p>
                      <p className="text-2xl font-bold">{results.total}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Importados</p>
                      <p className="text-2xl font-bold text-green-600">{results.imported}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {results.errors.length > 0 && (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Errores encontrados ({results.errors.length}):</strong>
                    <ul className="mt-2 space-y-1 text-sm max-h-32 overflow-y-auto">
                      {results.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                    {results.errors.length === 10 && (
                      <p className="text-xs mt-2 text-gray-500">
                        (Mostrando solo los primeros 10 errores)
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ¡Importación completada! Se han procesado {results.imported} de {results.total} clientes.
                  Puedes ver los clientes importados en la sección de Gestión de Clientes.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientImporter;
