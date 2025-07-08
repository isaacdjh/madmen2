import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ImportResultsProps {
  results: {
    total: number;
    imported: number;
    updated: number;
    errors: string[];
  };
}

const ImportResults = ({ results }: ImportResultsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
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
              <p className="text-sm text-gray-600">Nuevos</p>
              <p className="text-2xl font-bold text-green-600">{results.imported}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Actualizados</p>
              <p className="text-2xl font-bold text-blue-600">{results.updated}</p>
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
            {results.errors.length === 50 && (
              <p className="text-xs mt-2 text-gray-500">
                (Mostrando solo los primeros 50 errores)
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>¡Importación completada!</strong><br />
          Se han procesado <strong>{results.imported + results.updated} de {results.total}</strong> clientes:
          <br />• {results.imported} clientes nuevos creados
          <br />• {results.updated} clientes actualizados
          <br />Puedes ver todos los clientes en la sección de Gestión de Clientes.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ImportResults;