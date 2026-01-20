import { Phone } from "lucide-react";

const FloatingCallButton = () => {
  return (
    <a
      href="tel:+34912239203"
      className="fixed bottom-5 right-5 w-[60px] h-[60px] bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-[9999] no-underline animate-pulse hover:animate-none hover:scale-110 hover:shadow-[0_6px_20px_rgba(34,197,94,0.5)] transition-all duration-300"
      aria-label="Llamar a Mad Men Barbería"
    >
      <Phone className="w-7 h-7" />
    </a>
  );
};

export default FloatingCallButton;
