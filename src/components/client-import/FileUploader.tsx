import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface FileUploaderProps {
  file: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  updateExisting: boolean;
  onUpdateExistingChange: (checked: boolean) => void;
}

const FileUploader = ({ file, onFileChange, updateExisting, onUpdateExistingChange }: FileUploaderProps) => {
  return (
    <div className="space-y-4">
      {/* Opción para actualizar existentes */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="updateExisting"
          checked={updateExisting}
          onChange={(e) => onUpdateExistingChange(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="updateExisting" className="text-sm font-medium">
          Actualizar clientes existentes (recomendado)
        </label>
      </div>

      {/* Selector de archivo */}
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Haz clic para subir</span> el archivo Excel
              </p>
              <p className="text-xs text-gray-500">XLSX, XLS (Procesa TODOS los clientes)</p>
            </div>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={onFileChange}
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
    </div>
  );
};

export default FileUploader;