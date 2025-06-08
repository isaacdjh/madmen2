
import { useState, useEffect } from 'react';
import BarberLogin from '@/components/BarberLogin';
import BarberDashboard from '@/components/BarberDashboard';

const BarberPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si hay una sesión activa
    const session = localStorage.getItem('barberSession');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        // Verificar que la sesión no tenga más de 8 horas
        const loginTime = new Date(parsedSession.loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 8) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('barberSession');
        }
      } catch (error) {
        localStorage.removeItem('barberSession');
      }
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <BarberDashboard onLogout={handleLogout} />
      ) : (
        <BarberLogin onLogin={handleLogin} />
      )}
    </div>
  );
};

export default BarberPortal;
