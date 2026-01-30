import { useEffect } from 'react';

const ContactoRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://wa.me/34623158565';
  }, []);

  return (
    <div className="min-h-screen bg-barbershop-dark flex items-center justify-center">
      <p className="text-white">Redirigiendo a WhatsApp...</p>
    </div>
  );
};

export default ContactoRedirect;
