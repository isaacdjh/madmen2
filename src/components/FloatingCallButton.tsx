import { Phone, MessageCircle } from "lucide-react";

const FloatingCallButton = () => {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 items-center">
      <a
        href="https://wa.me/34910597766"
        target="_blank"
        rel="noopener noreferrer"
        className="w-[60px] h-[60px] bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] no-underline hover:scale-110 hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] transition-all duration-300"
        aria-label="WhatsApp Mad Men Barbería"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
      <a
        href="tel:+34912239203"
        className="w-[60px] h-[60px] bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] no-underline animate-pulse hover:animate-none hover:scale-110 hover:shadow-[0_6px_20px_rgba(34,197,94,0.5)] transition-all duration-300"
        aria-label="Llamar a Mad Men Barbería"
      >
        <Phone className="w-7 h-7" />
      </a>
    </div>
  );
};

export default FloatingCallButton;
