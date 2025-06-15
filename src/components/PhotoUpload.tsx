
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdate: (photoUrl: string | null) => void;
  barberName: string;
}

const PhotoUpload = ({ currentPhotoUrl, onPhotoUpdate, barberName }: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen para subir');
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Solo se permiten archivos de imagen');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen no puede ser mayor a 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${barberName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Delete previous photo if exists
      if (currentPhotoUrl) {
        const oldFileName = currentPhotoUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage.from('barber-photos').remove([oldFileName]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('barber-photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('barber-photos').getPublicUrl(filePath);
      
      setPreviewUrl(data.publicUrl);
      onPhotoUpdate(data.publicUrl);
      toast.success('Foto subida correctamente');

    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error(error instanceof Error ? error.message : 'Error al subir la foto');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async () => {
    try {
      if (currentPhotoUrl) {
        const fileName = currentPhotoUrl.split('/').pop();
        if (fileName) {
          const { error } = await supabase.storage
            .from('barber-photos')
            .remove([fileName]);
          
          if (error) throw error;
        }
      }
      
      setPreviewUrl(null);
      onPhotoUpdate(null);
      toast.success('Foto eliminada correctamente');
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Error al eliminar la foto');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={previewUrl || undefined} alt={barberName} />
          <AvatarFallback className="bg-barbershop-gold text-barbershop-dark font-bold text-lg">
            {getInitials(barberName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <Label htmlFor="photo-upload" className="text-sm font-medium">
            Foto del Barbero
          </Label>
          <div className="flex space-x-2">
            <Label htmlFor="photo-upload" className="cursor-pointer">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                className="relative"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Subiendo...' : 'Subir Foto'}
                </span>
              </Button>
            </Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={uploadPhoto}
              disabled={uploading}
              className="hidden"
            />
            
            {previewUrl && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removePhoto}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Formatos: JPG, PNG. Máximo 5MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
