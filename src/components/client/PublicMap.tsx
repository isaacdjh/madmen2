import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const locations = [
  {
    id: 1,
    name: 'Salamanca',
    address: 'General Pardiñas 101, 28006 Madrid',
    phone: '+34 910 597 766',
    coordinates: [40.4368176, -3.6777538] as [number, number],
    hours: 'L–V 11–21h · S 10–21h',
  },
  {
    id: 2,
    name: 'Retiro',
    address: 'Alcalde Sainz de Baranda 53, 28009 Madrid',
    phone: '+34 912 231 715',
    coordinates: [40.4172, -3.6694] as [number, number],
    hours: 'L–V 11–21h · S 10–21h · D 10–17h',
  },
];

const PublicMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const initializeMap = () => {
    if (!mapContainer.current || map.current || !isMapVisible) return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    map.current = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: !isMobile,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    }).setView([40.4270, -3.6736], isMobile ? 12 : 13);

    // Desaturated grayscale tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 18,
      updateWhenIdle: true,
      keepBuffer: isMobile ? 1 : 2,
    }).addTo(map.current);

    // Minimal marker
    const customIcon = L.divIcon({
      html: `<svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="#C0392B"/>
        <circle cx="14" cy="14" r="5.5" fill="white"/>
      </svg>`,
      className: '',
      iconSize: [28, 40],
      iconAnchor: [14, 40],
      popupAnchor: [0, -40],
    });

    locations.forEach((loc) => {
      const marker = L.marker(loc.coordinates, { icon: customIcon }).addTo(map.current!);

      const popupContent = `
        <div style="padding: 14px 16px; min-width: 200px; font-family: system-ui, sans-serif;">
          <p style="margin: 0 0 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: hsl(0,0%,55%);">
            Barrio de ${loc.name}
          </p>
          <p style="margin: 0 0 10px; font-size: 14px; color: hsl(0,0%,93%); font-weight: 400;">
            ${loc.address}
          </p>
          <p style="margin: 0 0 4px; font-size: 12px; color: hsl(0,0%,50%);">
            ${loc.hours}
          </p>
          <p style="margin: 0; font-size: 12px;">
            <a href="tel:${loc.phone}" style="color: hsl(155,28%,28%); text-decoration: none;">${loc.phone}</a>
          </p>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        className: 'minimal-popup',
      });
    });

    setIsMapLoaded(true);
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isMapVisible) setIsMapVisible(true);
        });
      },
      { rootMargin: '100px', threshold: 0.1 }
    );
    observerRef.current.observe(mapContainer.current);
    return () => observerRef.current?.disconnect();
  }, [isMapVisible]);

  useEffect(() => {
    if (isMapVisible && !map.current) {
      const timer = setTimeout(initializeMap, 100);
      return () => clearTimeout(timer);
    }
  }, [isMapVisible]);

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <section className="bg-barbershop-dark">
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px" style={{ background: 'hsl(0 0% 18%)' }} />
      </div>

      <div className="py-32 md:py-44">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 md:mb-24">
            <p
              className="uppercase tracking-[0.35em] text-[11px] mb-8 font-light"
              style={{ color: 'hsl(0 0% 50%)' }}
            >
              Mapa
            </p>
            <h2
              className="font-serif text-2xl md:text-4xl font-normal tracking-tight"
              style={{ color: 'hsl(0 0% 93%)' }}
            >
              Nuestras ubicaciones
            </h2>
          </div>

          {/* Map */}
          <style>{`
            .minimal-popup .leaflet-popup-content-wrapper {
              background: hsl(0, 0%, 14%);
              border-radius: 4px;
              box-shadow: 0 8px 30px rgba(0,0,0,0.4);
              border: 1px solid hsl(0,0%,20%);
            }
            .minimal-popup .leaflet-popup-tip {
              background: hsl(0,0%,14%);
              border: 1px solid hsl(0,0%,20%);
              border-top: none;
              border-left: none;
            }
            .minimal-popup .leaflet-popup-content {
              margin: 0;
            }
          `}</style>

          <div
            ref={mapContainer}
            className="w-full overflow-hidden relative"
            style={{
              height: '400px',
              border: '1px solid hsl(0 0% 18%)',
            }}
          >
            {!isMapLoaded && isMapVisible && (
              <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'hsl(0 0% 11%)' }}>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b border-muted-foreground mx-auto mb-3" />
                  <p className="text-xs tracking-widest uppercase" style={{ color: 'hsl(0 0% 40%)' }}>
                    Cargando
                  </p>
                </div>
              </div>
            )}
            {!isMapVisible && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'hsl(0 0% 11%)' }}>
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-3" style={{ color: 'hsl(0 0% 35%)' }} />
                  <p className="text-xs tracking-widest uppercase" style={{ color: 'hsl(0 0% 35%)' }}>
                    Mapa interactivo
                  </p>
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
