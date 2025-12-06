import { MessageCircle } from 'lucide-react';

const FloatingWhatsAppButton = () => {
  const phoneNumber = '34623158565'; // Número de Mad Men Barbería
  const message = encodeURIComponent('¡Hola! Me gustaría reservar una cita en Mad Men Barbería.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse hover:animate-none"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 fill-current" />
    </a>
  );
};

export default FloatingWhatsAppButton;
