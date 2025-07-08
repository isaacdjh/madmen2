import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { 
  BooksyClient, 
  mapColumnHeaders, 
  extractClientData, 
  validateClientData, 
  generateTempContact 
} from '@/utils/clientImportUtils';

interface ImportResults {
  total: number;
  imported: number;
  updated: number;
  errors: string[];
}

export const useClientImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updateExisting, setUpdateExisting] = useState(true);
  const [results, setResults] = useState<ImportResults | null>(null);

  const processExcelFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    
    const errors: string[] = [];
    let imported = 0;
    let updated = 0;
    let total = 0;

    try {
      console.log('Iniciando procesamiento del archivo:', file.name);
      console.log('Modo actualización:', updateExisting ? 'Activado' : 'Desactivado');
      
      // Leer el archivo Excel
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        raw: false,
        defval: ''
      }) as any[][];
      
      console.log('Filas totales en Excel:', jsonData.length);
      
      if (jsonData.length < 2) {
        errors.push('El archivo debe tener al menos una fila de encabezados y una fila de datos');
        setResults({ total: 0, imported: 0, updated: 0, errors });
        return;
      }

      // Obtener encabezados (primera fila)
      const headers = jsonData[0];
      console.log('Encabezados encontrados:', headers);

      const columnMap = mapColumnHeaders(headers);
      console.log('Mapeo de columnas:', columnMap);

      // Procesar todas las filas de datos
      const dataRows = jsonData.slice(1).filter(row => 
        row.some(cell => cell && String(cell).trim() !== '')
      );
      
      total = dataRows.length;
      console.log('Filas de datos a procesar:', total);

      // Procesar en lotes
      const batchSize = 25;
      
      for (let i = 0; i < dataRows.length; i += batchSize) {
        const batch = dataRows.slice(i, i + batchSize);
        
        // Procesar lote secuencialmente para mejor control de errores
        for (let j = 0; j < batch.length; j++) {
          const row = batch[j];
          const actualIndex = i + j;
          
          try {
            // Extraer datos de la fila
            const clientData = extractClientData(row, columnMap);

            // Determinar nombre completo
            let fullName = clientData.name;
            if (!fullName && (clientData.firstName || clientData.lastName)) {
              fullName = `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim();
            }

            // Validar datos mínimos
            const validationErrors = validateClientData(clientData, fullName, actualIndex);
            if (validationErrors.length > 0) {
              errors.push(...validationErrors);
              continue;
            }

            // Generar contactos temporales si es necesario
            const { email, phone } = generateTempContact(clientData, actualIndex);

            // Buscar cliente existente primero
            const { data: existingClients, error: searchError } = await supabase
              .from('clients')
              .select('id')
              .or(`phone.eq."${phone}",email.eq."${email}"`);

            if (searchError) {
              console.error(`Error buscando cliente ${fullName}:`, searchError);
              errors.push(`Fila ${actualIndex + 2}: Error buscando ${fullName}`);
              continue;
            }

            let wasUpdated = false;
            if (existingClients && existingClients.length > 0) {
              // Cliente existe, eliminarlo completamente
              const { error: deleteError } = await supabase
                .from('clients')
                .delete()
                .eq('id', existingClients[0].id);

              if (deleteError) {
                console.error(`Error eliminando cliente duplicado ${fullName}:`, deleteError);
                errors.push(`Fila ${actualIndex + 2}: Error eliminando duplicado ${fullName}`);
                continue;
              }
              wasUpdated = true;
            }

            // Crear cliente nuevo (siempre)
            const { data: newClient, error: createError } = await supabase
              .from('clients')
              .insert({
                name: clientData.firstName || fullName,
                last_name: clientData.lastName || null,
                phone: phone,
                email: email
              })
              .select('id')
              .single();

            if (createError) {
              console.error(`Error creando cliente ${fullName}:`, createError);
              errors.push(`Fila ${actualIndex + 2}: Error al crear ${fullName} - ${createError.message}`);
              continue;
            }

            if (wasUpdated) {
              updated++;
              console.log(`Cliente sustituido: ${fullName}`);
            } else {
              imported++;
              console.log(`Cliente nuevo: ${fullName}`);
            }
            
          } catch (error) {
            console.error(`Error procesando fila ${actualIndex + 2}:`, error);
            errors.push(`Fila ${actualIndex + 2}: Error inesperado - ${error instanceof Error ? error.message : 'Error desconocido'}`);
          }
        }

        // Actualizar progreso
        const currentProgress = ((i + batch.length) / total) * 100;
        setProgress(Math.min(currentProgress, 100));
        
        console.log(`Procesado lote ${Math.floor(i/batchSize) + 1}: ${imported} nuevos, ${updated} actualizados, ${errors.length} errores`);
        
        // Pausa entre lotes para no sobrecargar
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      console.log('Procesamiento completado:', { 
        total, 
        imported, 
        updated, 
        errores: errors.length 
      });

      setResults({
        total,
        imported,
        updated,
        errors: errors.slice(0, 50) // Mostrar máximo 50 errores
      });

    } catch (error) {
      console.error('Error procesando archivo:', error);
      errors.push(`Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setResults({ total: 0, imported: 0, updated: 0, errors });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  return {
    file,
    setFile,
    isProcessing,
    progress,
    updateExisting,
    setUpdateExisting,
    results,
    processExcelFile
  };
};