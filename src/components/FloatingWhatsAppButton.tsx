const FloatingWhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/34623158565"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#25d366',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        zIndex: 9999,
        textDecoration: 'none',
      }}
      aria-label="Contactar por WhatsApp"
    >
      💬
    </a>
  );
};

export default FloatingWhatsAppButton;
