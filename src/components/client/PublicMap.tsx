import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';

// Fix para iconos por defecto de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const PublicMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Ubicaciones de Mad Men Barbería (solo lectura para usuarios)
  const locations = [
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
    },
    {
      id: 3,
      name: 'Mad Men Barbería - Retiro',
      address: 'Calle Alcalde Sainz de Baranda 53, 28009 Madrid',
      phone: '+34 912 231 715',
      coordinates: [40.4172, -3.6694] as [number, number],
      hours: 'L-V: 11:00-21:00 | S: 10:00-21:00 | D: 10:00-17:00',
      description: 'Nuestra nueva ubicación en el barrio Retiro'
    }
  ];

  const initializeMap = () => {
    if (!mapContainer.current || map.current || !isMapVisible) return;

    // Detectar si es dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Crear el mapa con configuración optimizada para móviles
    map.current = L.map(mapContainer.current, {
      zoomControl: !isMobile, // Deshabilitar controles de zoom en móvil
      attributionControl: false, // Deshabilitar atribución para ahorrar espacio
      dragging: !isMobile, // Deshabilitar arrastre en móvil para evitar conflictos
      touchZoom: false, // Deshabilitar zoom táctil
      scrollWheelZoom: false, // Deshabilitar zoom con scroll
      doubleClickZoom: false, // Deshabilitar zoom con doble click
      boxZoom: false, // Deshabilitar zoom con caja
      keyboard: false // Deshabilitar controles de teclado
    }).setView([40.4337, -3.6923], isMobile ? 12 : 13);

    // Agregar capa de OpenStreetMap con configuración optimizada
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: isMobile ? 15 : 18, // Limitar zoom máximo en móviles
      tileSize: isMobile ? 512 : 256, // Usar tiles más grandes en móvil
      zoomOffset: isMobile ? -1 : 0,
      updateWhenIdle: true, // Solo actualizar cuando el mapa esté idle
      keepBuffer: isMobile ? 1 : 2 // Reducir buffer en móviles
    }).addTo(map.current);

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
        </div>
      `;

      marker.bindPopup(popupContent);
    });
    
    setIsMapLoaded(true);
  };

  // Configurar Intersection Observer para lazy loading
  useEffect(() => {
    if (!mapContainer.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isMapVisible) {
            setIsMapVisible(true);
          }
        });
      },
      {
        rootMargin: '100px', // Cargar cuando esté 100px antes de ser visible
        threshold: 0.1
      }
    );

    observerRef.current.observe(mapContainer.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isMapVisible]);

  // Inicializar mapa cuando sea visible
  useEffect(() => {
    if (isMapVisible && !map.current) {
      // Agregar un pequeño delay para mejorar rendimiento
      const timer = setTimeout(() => {
        initializeMap();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isMapVisible]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

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
            className="w-full h-96 rounded-lg shadow-lg border border-border relative"
          >
            {!isMapLoaded && isMapVisible && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Cargando mapa...</p>
                </div>
              </div>
            )}
            {!isMapVisible && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-lg font-semibold text-primary">Mapa Interactivo</p>
                  <p className="text-sm text-muted-foreground">Se cargará automáticamente</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

export default PublicMap;