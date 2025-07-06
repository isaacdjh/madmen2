
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
      console.log('Iniciando procesamiento del archivo:', file.name);
      
      // Leer el archivo Excel
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON - aumentar límite de filas
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        raw: false, // Para evitar problemas con fechas
        defval: '' // Valor por defecto para celdas vacías
      }) as any[][];
      
      console.log('Filas totales en Excel:', jsonData.length);
      
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
        name: headers.findIndex(h => 
          h.includes('name') || h.includes('nombre') || h.includes('client') || 
          h.includes('customer') || h.includes('cliente')
        ),
        firstName: headers.findIndex(h => 
          h.includes('first') || h.includes('nombre') || h.includes('given')
        ),
        lastName: headers.findIndex(h => 
          h.includes('last') || h.includes('apellido') || h.includes('surname') || h.includes('family')
        ),
        email: headers.findIndex(h => 
          h.includes('email') || h.includes('correo') || h.includes('mail')
        ),
        phone: headers.findIndex(h => 
          h.includes('phone') || h.includes('teléfono') || h.includes('telefono') || 
          h.includes('mobile') || h.includes('móvil') || h.includes('movil') || h.includes('cel')
        ),
        totalVisits: headers.findIndex(h => 
          h.includes('visit') || h.includes('cita') || h.includes('appointment') || h.includes('bookings')
        ),
        lastVisit: headers.findIndex(h => 
          h.includes('last visit') || h.includes('última') || h.includes('recent') || h.includes('último')
        ),
        totalSpent: headers.findIndex(h => 
          h.includes('spent') || h.includes('total') || h.includes('amount') || h.includes('gastado') || h.includes('revenue')
        )
      };

      console.log('Mapeo de columnas:', columnMap);

      // Procesar TODAS las filas de datos (saltando la primera que son encabezados)
      const dataRows = jsonData.slice(1).filter(row => 
        // Filtrar filas completamente vacías
        row.some(cell => cell && String(cell).trim() !== '')
      );
      
      total = dataRows.length;
      console.log('Filas de datos a procesar:', total);

      // Procesar en lotes más grandes para mayor eficiencia
      const batchSize = 50;
      
      for (let i = 0; i < dataRows.length; i += batchSize) {
        const batch = dataRows.slice(i, i + batchSize);
        
        // Procesar lote en paralelo
        const batchPromises = batch.map(async (row, batchIndex) => {
          const actualIndex = i + batchIndex;
          
          try {
            // Extraer datos de la fila
            const clientData: BooksyClient = {
              name: row[columnMap.name] ? String(row[columnMap.name]).trim() : '',
              firstName: row[columnMap.firstName] ? String(row[columnMap.firstName]).trim() : '',
              lastName: row[columnMap.lastName] ? String(row[columnMap.lastName]).trim() : '',
              email: row[columnMap.email] ? normalizeEmail(String(row[columnMap.email])) : '',
              phone: row[columnMap.phone] ? normalizePhoneNumber(String(row[columnMap.phone])) : '',
              totalVisits: row[columnMap.totalVisits] ? Number(row[columnMap.totalVisits]) || 0 : 0,
              lastVisit: row[columnMap.lastVisit] ? String(row[columnMap.lastVisit]) : '',
              totalSpent: row[columnMap.totalSpent] ? Number(row[columnMap.totalSpent]) || 0 : 0
            };

            // Determinar nombre completo
            let fullName = clientData.name;
            if (!fullName && (clientData.firstName || clientData.lastName)) {
              fullName = `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim();
            }

            // Validar datos mínimos
            if (!fullName) {
              return { success: false, error: `Fila ${actualIndex + 2}: Falta el nombre del cliente` };
            }

            if (!clientData.email && !clientData.phone) {
              return { success: false, error: `Fila ${actualIndex + 2}: Falta email o teléfono para ${fullName}` };
            }

            // Crear email temporal si no existe pero tiene teléfono
            const email = clientData.email || `cliente.${actualIndex}@temp.booksy.com`;
            
            // Crear teléfono temporal si no existe pero tiene email
            const phone = clientData.phone || `+34${String(600000000 + actualIndex).slice(0, 9)}`;

            // Intentar crear/obtener cliente
            await createOrGetClient(
              clientData.firstName || fullName,
              phone,
              email
            );

            return { success: true };
            
          } catch (error) {
            console.error(`Error procesando fila ${actualIndex + 2}:`, error);
            return { 
              success: false, 
              error: `Fila ${actualIndex + 2}: Error al procesar - ${error instanceof Error ? error.message : 'Error desconocido'}` 
            };
          }
        });

        // Esperar a que termine el lote
        const batchResults = await Promise.all(batchPromises);
        
        // Contar resultados
        batchResults.forEach(result => {
          if (result.success) {
            imported++;
          } else {
            errors.push(result.error);
          }
        });

        // Actualizar progreso
        const currentProgress = ((i + batch.length) / total) * 100;
        setProgress(Math.min(currentProgress, 100));
        
        console.log(`Procesado lote ${Math.floor(i/batchSize) + 1}: ${imported} importados, ${errors.length} errores`);
        
        // Pequeña pausa para no sobrecargar la base de datos
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('Procesamiento completado:', { total, imported, errores: errors.length });

      setResults({
        total,
        imported,
        errors: errors.slice(0, 20) // Mostrar máximo 20 errores
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
                <li>• <strong>Ahora procesa TODOS los clientes sin límites</strong></li>
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
                  <p className="text-xs text-gray-500">XLSX, XLS (Sin límite de tamaño)</p>
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
                Procesando todos los clientes...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Importar TODOS los Clientes
              </>
            )}
          </Button>

          {/* Barra de progreso */}
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-gray-600">
                Procesando todos los clientes... {Math.round(progress)}%
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
                      <p className="text-sm text-gray-600">Importados exitosamente</p>
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
                    <ul className="mt-2 space-y-1 text-sm max-h-40 overflow-y-auto">
                      {results.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                    {results.errors.length === 20 && (
                      <p className="text-xs mt-2 text-gray-500">
                        (Mostrando solo los primeros 20 errores)
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>¡Importación completada!</strong><br />
                  Se han procesado <strong>{results.imported} de {results.total}</strong> clientes de ambos centros.
                  <br />Puedes ver todos los clientes importados en la sección de Gestión de Clientes.
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
