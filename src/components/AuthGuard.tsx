import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'barber' | 'user';
  redirectTo?: string;
}

export const AuthGuard = ({ 
  children, 
  requiredRole = 'user',
  redirectTo = '/auth'
}: AuthGuardProps) => {
  const { user, profile, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        toast.error('Debes iniciar sesión para acceder a esta página');
        navigate(redirectTo, { 
          state: { from: location.pathname },
          replace: true 
        });
        return;
      }

      if (profile && requiredRole) {
        const hasPermission = 
          requiredRole === 'user' ||
          (requiredRole === 'barber' && (profile.role === 'barber' || profile.role === 'admin')) ||
          (requiredRole === 'admin' && profile.role === 'admin');

        if (!hasPermission) {
          toast.error('No tienes permisos para acceder a esta página');
          navigate('/', { replace: true });
          return;
        }
      }
    }
  }, [user, profile, loading, navigate, location, requiredRole, redirectTo, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated() || (requiredRole && profile && !profile.role)) {
    return null;
  }

  return <>{children}</>;
};