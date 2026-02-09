import { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ValentinesPopup = () => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 1500);
    const hideTimer = setTimeout(() => handleClose(), 8000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className={`relative bg-gradient-to-br from-rose-950 via-red-900 to-rose-950 border border-rose-500/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl shadow-rose-500/20 transition-all duration-300 ${closing ? 'scale-90' : 'scale-100'}`}>
        <button onClick={handleClose} className="absolute top-3 right-3 text-rose-300/60 hover:text-rose-100 transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-1">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
            <Heart className="w-6 h-6 text-red-400 fill-red-400 animate-pulse" />
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
          </div>
          
          <p className="text-2xl font-bold text-rose-100">
            🔥 Especial San Valentín
          </p>
          
          <div className="space-y-2">
            <p className="text-lg text-rose-50 font-semibold">
              ✂️ Corte + Barba con <span className="text-yellow-400">10% OFF</span>
            </p>
            <p className="text-rose-200 text-sm">
              Solo del 12 al 14 de febrero
            </p>
          </div>
          
          <p className="text-rose-200 text-xs font-medium">👉 Reserva ahora</p>
          
          <div className="flex gap-3">
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold py-3 text-sm rounded-xl shadow-lg"
            >
              <a href="https://booksy.com/es-es/108540_mad-men-barberia-tradicional-barrio-salamanca_barberia_53009_madrid" target="_blank" rel="noopener noreferrer">
                📍 Salamanca
              </a>
            </Button>
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold py-3 text-sm rounded-xl shadow-lg"
            >
              <a href="https://booksy.com/es-es/160842_barberia-retiro-mad-men-barberia-tradicional_barberia_53009_madrid" target="_blank" rel="noopener noreferrer">
                📍 Retiro
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValentinesPopup;
