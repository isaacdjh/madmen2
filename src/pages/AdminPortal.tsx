
import { useState, useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import AdminIndex from '@/pages/AdminIndex';

const AdminPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si hay una sesión administrativa activa
    const session = localStorage.getItem('adminSession');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        // Verificar que la sesión no tenga más de 8 horas
        const loginTime = new Date(parsedSession.loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 8 && parsedSession.role === 'administrator') {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('adminSession');
        }
      } catch (error) {
        localStorage.removeItem('adminSession');
      }
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <AdminIndex onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
};

export default AdminPortal;
