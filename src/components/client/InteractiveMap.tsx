import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Ubicaciones de Mad Men Barbería
  const locations = [
    {
      id: 1,
      name: 'Mad Men Barbería - Cristóbal Bordiú',
      address: 'Calle Cristóbal Bordiú, 29, 28003 Madrid',
      phone: '+34 916 83 27 31',
      coordinates: [-3.7076, 40.4357],
      hours: 'L-V: 10:00-14:00, 16:00-21:00 | S: 10:00-20:00',
      description: 'Nuestra ubicación principal en el barrio Ríos Rosas'
    },
    {
      id: 2,
      name: 'Mad Men Barbería - Salamanca',
      address: 'Barrio de Salamanca, Madrid',
      phone: '+34 916 83 27 31',
      coordinates: [-3.6777, 40.4312],
      hours: 'L-V: 10:00-14:00, 16:00-21:00 | S: 10:00-20:00',
      description: 'Nuestra segunda ubicación en el exclusivo barrio de Salamanca'
    }
  ];

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setIsTokenValid(true);
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current) return;

    const token = mapboxToken || localStorage.getItem('mapbox_token');
    if (!token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-3.6923, 40.4337], // Centro de Madrid
      zoom: 12,
    });

    // Agregar controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Agregar marcadores para cada ubicación
    locations.forEach((location) => {
      // Crear elemento del marcador personalizado
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 40px;
        height: 40px;
        background: #dc2626;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      const icon = document.createElement('div');
      icon.innerHTML = '✂️';
      icon.style.fontSize = '16px';
      markerElement.appendChild(icon);

      // Crear popup con información
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #dc2626;">${location.name}</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>📍</strong> ${location.address}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>📞</strong> ${location.phone}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>🕒</strong> ${location.hours}</p>
          <p style="margin: 8px 0 4px 0; font-size: 13px; color: #666;">${location.description}</p>
        </div>
      `);

      // Agregar marcador al mapa
      new mapboxgl.Marker(markerElement)
        .setLngLat(location.coordinates as [number, number])
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setIsTokenValid(true);
      initializeMap();
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isTokenValid) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Nuestras Ubicaciones</h2>
            <p className="text-xl text-muted-foreground">Encuentra la barbería Mad Men más cercana a ti</p>
          </div>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Configurar Mapa Interactivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Para mostrar el mapa interactivo, necesitas un token público de Mapbox.
                <a 
                  href="https://mapbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  Obtén tu token aquí <ExternalLink className="w-3 h-3 inline" />
                </a>
              </p>
              <Input
                type="text"
                placeholder="Ingresa tu token público de Mapbox"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button onClick={handleTokenSubmit} className="w-full">
                Activar Mapa
              </Button>
            </CardContent>
          </Card>

          {/* Información de ubicaciones sin mapa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
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
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Nuestras Ubicaciones</h2>
          <p className="text-xl text-muted-foreground">Encuentra la barbería Mad Men más cercana a ti</p>
        </div>
        
        <div className="mb-8">
          <div 
            ref={mapContainer} 
            className="w-full h-96 rounded-lg shadow-lg border border-border"
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