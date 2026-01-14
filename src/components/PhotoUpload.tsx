import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PhotoUploadProps {
  currentPhotoUrl: string | null;
  onPhotoUpdate: (photoUrl: string | null) => void;
  barberName?: string;
}

const PhotoUpload = ({ currentPhotoUrl, onPhotoUpdate, barberName }: PhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `barbers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('barber-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('barber-photos')
        .getPublicUrl(filePath);

      onPhotoUpdate(publicUrl);
      toast.success('Foto actualizada correctamente');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error al subir la foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoUpdate(null);
    toast.success('Foto eliminada');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={currentPhotoUrl || undefined} alt="Foto del barbero" />
        <AvatarFallback>
          <Camera className="w-8 h-8 text-gray-400" />
        </AvatarFallback>
      </Avatar>

      <div className="flex gap-2">
        <Label htmlFor="photo-upload" className="cursor-pointer">
          <Button variant="outline" size="sm" disabled={isUploading} asChild>
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Subiendo...' : 'Subir foto'}
            </span>
          </Button>
          <Input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </Label>

        {currentPhotoUrl && (
          <Button variant="outline" size="sm" onClick={handleRemovePhoto}>
            <X className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
