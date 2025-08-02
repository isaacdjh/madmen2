import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Save } from 'lucide-react';

// Fix para iconos por defecto de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [clickedCoordinates, setClickedCoordinates] = useState<string>('');
  const [markers, setMarkers] = useState<L.Marker[]>([]);

  // Ubicaciones de Mad Men Barbería (iniciales - puedes actualizarlas)
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: 'Mad Men Barbería - Cristóbal Bordiú 29',
      address: 'C. de Cristóbal Bordiú, 29, Chamberí, 28003 Madrid',
      phone: '+34 916832731',
      coordinates: [40.434190, -3.704250] as [number, number], // Chamberí, Cristóbal Bordiú 29
      hours: 'L-V: 11:00-21:00 | S: 10:00-21:00',
      description: 'Nuestra ubicación principal en el barrio Chamberí'
    },
    {
      id: 2,
      name: 'Mad Men Barbería - General Pardiñas 101',
      address: 'Calle del Gral. Pardiñas, 101, Salamanca, 28006 Madrid',
      phone: '+34 910597766',
      coordinates: [40.431200, -3.677700] as [number, number], // Salamanca, General Pardiñas 101
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

      // Crear popup con información
      const popupContent = `
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #dc2626;">${location.name}</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>📍</strong> ${location.address}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>📞</strong> ${location.phone}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>🕒</strong> ${location.hours}</p>
          <p style="margin: 8px 0 4px 0; font-size: 13px; color: #666;">${location.description}</p>
          <p style="margin: 8px 0 4px 0; font-size: 12px; color: #999;">Coordenadas: ${location.coordinates[0].toFixed(6)}, ${location.coordinates[1].toFixed(6)}</p>
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

    // Función para manejar clics en el mapa
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (editMode) {
        const { lat, lng } = e.latlng;
        setClickedCoordinates(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        
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
        tempMarker.bindPopup(`<div style="padding: 5px;">
          <strong>Nueva ubicación</strong><br/>
          Lat: ${lat.toFixed(6)}<br/>
          Lng: ${lng.toFixed(6)}<br/>
          <small>Usa estos valores para actualizar las coordenadas</small>
        </div>`).openPopup();
      }
    };

    map.current.on('click', handleMapClick);

    // Agregar marcadores iniciales
    addMarkers();
  };

  const updateLocation = (locationId: number, newCoordinates: [number, number]) => {
    setLocations(prev => prev.map(loc => 
      loc.id === locationId 
        ? { ...loc, coordinates: newCoordinates }
        : loc
    ));
  };

  useEffect(() => {
    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambien las ubicaciones
  useEffect(() => {
    if (map.current) {
      clearMarkers();
      addMarkers();
    }
  }, [locations]);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Nuestras Ubicaciones</h2>
          <p className="text-xl text-muted-foreground">Encuentra la barbería Mad Men más cercana a ti</p>
        </div>
        
        {/* Controles de edición */}
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-center">
          <Button 
            onClick={() => setEditMode(!editMode)}
            variant={editMode ? "destructive" : "outline"}
            className="flex items-center gap-2"
          >
            {editMode ? 'Salir del modo edición' : 'Activar modo edición'}
          </Button>
          
          {editMode && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Modo edición activado:</strong> Haz clic en el mapa para obtener coordenadas exactas
              </p>
              {clickedCoordinates && (
                <div className="text-xs bg-background p-2 rounded border">
                  <strong>Última coordenada:</strong> {clickedCoordinates}
                  <br />
                  <small>Copia estos valores para actualizar las ubicaciones en el código</small>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-8">
          <div 
            ref={mapContainer} 
            className={`w-full h-96 rounded-lg shadow-lg border border-border ${editMode ? 'cursor-crosshair' : ''}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-4">{location.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-sm">{location.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-sm">{location.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-sm">{location.hours}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">{location.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;