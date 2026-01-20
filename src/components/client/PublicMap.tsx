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
      name: 'Mad Men Barbería - General Pardiñas 101',
      address: 'Calle del Gral. Pardiñas, 101, Salamanca, 28006 Madrid',
      phone: '+34 910597766',
      coordinates: [40.4368176, -3.6777538] as [number, number],
      hours: 'L-V: 11:00-21:00 | S: 10:00-21:00',
      description: 'Nuestra ubicación en el exclusivo barrio de Salamanca'
    },
    {
      id: 2,
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
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: isMobile ? 15 : 18,
      tileSize: isMobile ? 512 : 256,
      zoomOffset: isMobile ? -1 : 0,
      updateWhenIdle: true,
      keepBuffer: isMobile ? 1 : 2,
      className: 'map-tiles-green' // Clase para aplicar filtro verde
    }).addTo(map.current);

    // Crear icono personalizado para las barberías - Amarillo con tijeras
    const customIcon = L.divIcon({
      html: `
        <div style="
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 50%;
          border: 3px solid #fef3c7;
          box-shadow: 0 4px 15px rgba(251, 191, 36, 0.5), 0 2px 8px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        ">
          ✂️
        </div>
      `,
      className: 'custom-marker',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    });

    // Agregar marcadores para cada ubicación
    locations.forEach((location) => {
      const marker = L.marker(location.coordinates, { icon: customIcon })
        .addTo(map.current!);

      // Crear popup con información - con colores verdes
      const popupContent = `
        <div style="padding: 12px; min-width: 220px;">
          <h3 style="margin: 0 0 10px 0; font-weight: bold; color: #16a34a; font-size: 15px;">${location.name}</h3>
          <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>📍</strong> ${location.address}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>📞</strong> <a href="tel:${location.phone}" style="color: #16a34a; text-decoration: none;">${location.phone}</a></p>
          <p style="margin: 6px 0; font-size: 14px; color: #374151;"><strong>🕒</strong> ${location.hours}</p>
          <p style="margin: 10px 0 4px 0; font-size: 13px; color: #6b7280; font-style: italic;">${location.description}</p>
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
          <h2 className="text-4xl font-bold text-primary mb-4">Encuéntranos</h2>
          <p className="text-xl text-muted-foreground">Haz clic en los marcadores para ver la información de cada ubicación</p>
        </div>
        
        <div>
          <style>{`
            .map-tiles-green {
              filter: hue-rotate(85deg) saturate(1.2) brightness(0.95);
            }
            .leaflet-popup-content-wrapper {
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            }
            .leaflet-popup-content h3 {
              color: #16a34a !important;
            }
            .custom-marker {
              background: transparent !important;
              border: none !important;
            }
          `}</style>
          <div 
            ref={mapContainer} 
            className="w-full h-96 rounded-lg shadow-lg border border-primary/30 relative overflow-hidden"
          >
            {!isMapLoaded && isMapVisible && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-10">
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
      </div>
    </section>
  );
};

export default PublicMap;