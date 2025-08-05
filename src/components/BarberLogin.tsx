import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface BarberLoginProps {
  onLogin: (barberId: string, barberName: string) => void;
}

const BarberLogin = ({ onLogin }: BarberLoginProps) => {
  const { user, profile, isAuthenticated, isBarber } = useAuth();

  useEffect(() => {
    if (isAuthenticated() && isBarber() && profile) {
      onLogin(profile.id, profile.full_name || profile.email);
    }
  }, [user, profile, onLogin, isAuthenticated, isBarber]);

  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  if (!isBarber()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos de barbero para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return null; // User is authenticated and authorized
};

export default BarberLogin;