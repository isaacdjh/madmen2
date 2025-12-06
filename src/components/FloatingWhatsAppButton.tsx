const FloatingWhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/34623158565"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 w-[60px] h-[60px] bg-[#25d366] text-white rounded-full flex items-center justify-center text-[28px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-[9999] no-underline animate-pulse hover:animate-none hover:scale-110 hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] transition-all duration-300"
      aria-label="Contactar por WhatsApp"
    >
      💬
    </a>
  );
};

export default FloatingWhatsAppButton;
