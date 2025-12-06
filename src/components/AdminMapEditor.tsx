import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Save, Edit } from 'lucide-react';

// Fix para iconos por defecto de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const AdminMapEditor = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [clickedCoordinates, setClickedCoordinates] = useState<string>('');
  const [markers, setMarkers] = useState<L.Marker[]>([]);

  // Ubicaciones de Mad Men Barbería (editables por admin)
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: 'Mad Men Barbería - Cristóbal Bordiú 29',
      address: 'C. de Cristóbal Bordiú, 29, Chamberí, 28003 Madrid',
      phone: '+34 916832731',
      coordinates: [40.4433397, -3.6992976] as [number, number],
      hours: 'L-V: 11:00-21:00 | S: 10:00-21:00',
      description: 'Nuestra primera ubicación en el barrio Chamberí'
    },
    {
      id: 2,
      name: 'Mad Men Barbería - General Pardiñas 101',
      address: 'Calle del Gral. Pardiñas, 101, Salamanca, 28006 Madrid',
      phone: '+34 910597766',
      coordinates: [40.4368176, -3.6777538] as [number, number],
      hours: 'L-V: 11:00-21:00 | S: 10:00-21:00',
      description: 'Nuestra segunda ubicación en el exclusivo barrio de Salamanca'
    }
  ]);

  const clearMarkers = () => {
    markers.forEach(marker => {
      if (map.current) {
        map.current.removeLayer(marker);
      }
    });
    setMarkers([]);
  };

  const addMarkers = () => {
    // Crear icono personalizado para las barberías
    const customIcon = L.divIcon({
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: #dc2626;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        ">
          ✂️
        </div>
      `,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });

    const newMarkers: L.Marker[] = [];

    // Agregar marcadores para cada ubicación
    locations.forEach((location) => {
      const marker = L.marker(location.coordinates, { icon: customIcon })
        .addTo(map.current!);

      // Crear popup con información para admin
      const popupContent = `
        <div style="padding: 10px; min-width: 250px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #dc2626;">${location.name}</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>📍</strong> ${location.address}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>📞</strong> ${location.phone}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>🕒</strong> ${location.hours}</p>
          <p style="margin: 8px 0 4px 0; font-size: 13px; color: #666;">${location.description}</p>
          <p style="margin: 8px 0 4px 0; font-size: 12px; color: #999;"><strong>Coordenadas:</strong> ${location.coordinates[0].toFixed(7)}, ${location.coordinates[1].toFixed(7)}</p>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
            <small style="color: #666;">Modo Admin: Usa el modo edición para obtener nuevas coordenadas</small>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  };

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    // Crear el mapa con OpenStreetMap
    map.current = L.map(mapContainer.current).setView([40.4337, -3.6923], 13);

    // Agregar capa de OpenStreetMap (gratuita)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Función para manejar clics en el mapa (solo en modo edición)
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (editMode) {
        const { lat, lng } = e.latlng;
        const coordinates = `${lat.toFixed(7)}, ${lng.toFixed(7)}`;
        setClickedCoordinates(coordinates);
        
        // Crear marcador temporal en la ubicación clickeada
        const tempIcon = L.divIcon({
          html: `<div style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>`,
          className: 'temp-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        // Remover marcador temporal anterior si existe
        if (map.current) {
          map.current.eachLayer((layer) => {
            if (layer instanceof L.Marker && (layer as any).options.icon?.options?.className === 'temp-marker') {
              map.current!.removeLayer(layer);
            }
          });
        }

        const tempMarker = L.marker([lat, lng], { icon: tempIcon }).addTo(map.current!);
        tempMarker.bindPopup(`<div style="padding: 8px;">
          <strong>Nueva ubicación</strong><br/>
          <strong>Lat:</strong> ${lat.toFixed(7)}<br/>
          <strong>Lng:</strong> ${lng.toFixed(7)}<br/>
          <small style="color: #666;">Copia estos valores para actualizar las coordenadas</small>
        </div>`).openPopup();
      }
    };

    map.current.on('click', handleMapClick);

    // Agregar marcadores iniciales
    addMarkers();
  };

  // Actualizar marcadores cuando cambien las ubicaciones
  useEffect(() => {
    if (map.current) {
      clearMarkers();
      addMarkers();
    }
  }, [locations]);

  useEffect(() => {
    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const copyCoordinates = () => {
    if (clickedCoordinates) {
      navigator.clipboard.writeText(clickedCoordinates);
      // Aquí podrías agregar un toast notification
      console.log('Coordenadas copiadas:', clickedCoordinates);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Editor de Ubicaciones (Solo Admin)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Controles de edición */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Button 
              onClick={() => setEditMode(!editMode)}
              variant={editMode ? "destructive" : "outline"}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {editMode ? 'Salir del modo edición' : 'Activar modo edición'}
            </Button>
            
            {clickedCoordinates && (
              <Button 
                onClick={copyCoordinates}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Copiar coordenadas
              </Button>
            )}
          </div>
          
          {editMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>🔧 Modo edición activado:</strong> Haz clic en cualquier punto del mapa para obtener coordenadas exactas
              </p>
              {clickedCoordinates && (
                <div className="bg-white p-3 rounded border border-blue-300">
                  <p className="text-sm font-mono"><strong>Coordenadas seleccionadas:</strong></p>
                  <p className="text-sm font-mono text-blue-700">{clickedCoordinates}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Copia estos valores para actualizar las ubicaciones en el código
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mapa */}
        <div className="mb-6">
          <div 
            ref={mapContainer} 
            className={`w-full h-96 rounded-lg shadow-lg border border-border ${editMode ? 'cursor-crosshair' : ''}`}
          />
        </div>

        {/* Información de ubicaciones actuales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((location) => (
            <Card key={location.id} className="border border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-bold text-primary mb-3">{location.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{location.hours}</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                    <strong>Coordenadas actuales:</strong><br/>
                    {location.coordinates[0].toFixed(7)}, {location.coordinates[1].toFixed(7)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>⚠️ Importante:</strong> Para actualizar las coordenadas permanentemente, copia los valores obtenidos 
            y actualiza manualmente el código del componente. Los cambios aquí son solo para obtener coordenadas precisas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminMapEditor;