
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileSpreadsheet, Users, RefreshCw, AlertCircle } from 'lucide-react';
import { useClientImport } from '@/hooks/useClientImport';
import FileUploader from '@/components/client-import/FileUploader';
import ImportProgress from '@/components/client-import/ImportProgress';
import ImportResults from '@/components/client-import/ImportResults';

const ClientImporter = () => {
  const {
    file,
    setFile,
    isProcessing,
    progress,
    updateExisting,
    setUpdateExisting,
    results,
    processExcelFile
  } = useClientImport();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
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
                <li>• <strong>Ahora maneja duplicados automáticamente</strong></li>
              </ul>
            </AlertDescription>
          </Alert>

          <FileUploader
            file={file}
            onFileChange={handleFileChange}
            updateExisting={updateExisting}
            onUpdateExistingChange={setUpdateExisting}
          />

          {/* Botón de procesamiento */}
          <Button 
            onClick={processExcelFile}
            disabled={!file || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Procesando todos los clientes...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Importar TODOS los Clientes
              </>
            )}
          </Button>

          <ImportProgress isProcessing={isProcessing} progress={progress} />

          {results && <ImportResults results={results} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientImporter;
