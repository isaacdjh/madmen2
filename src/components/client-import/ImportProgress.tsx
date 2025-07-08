import { Progress } from '@/components/ui/progress';

interface ImportProgressProps {
  isProcessing: boolean;
  progress: number;
}

const ImportProgress = ({ isProcessing, progress }: ImportProgressProps) => {
  if (!isProcessing) return null;

  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-center text-gray-600">
        Procesando clientes... {Math.round(progress)}%
      </p>
    </div>
  );
};

export default ImportProgress;