
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scissors } from 'lucide-react';

interface BarberLoginProps {
  onLogin: (barberId: string, barberName: string) => void;
}

const BarberLogin = ({ onLogin }: BarberLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Credenciales de barberos (en producción esto estaría en una base de datos)
  const barberCredentials = {
    // Cristóbal Bordiú
    'luis.bracho': { password: 'madmen2024', id: 'luis-bracho', name: 'Luis Bracho', location: 'cristobal-bordiu' },
    'jesus.hernandez': { password: 'madmen2024', id: 'jesus-hernandez', name: 'Jesús Hernández', location: 'cristobal-bordiu' },
    'luis.alfredo': { password: 'madmen2024', id: 'luis-alfredo', name: 'Luis Alfredo', location: 'cristobal-bordiu' },
    'dionys.bracho': { password: 'madmen2024', id: 'dionys-bracho', name: 'Dionys Bracho', location: 'cristobal-bordiu' },
    // General Pardiñas
    'isaac.hernandez': { password: 'madmen2024', id: 'isaac-hernandez', name: 'Isaac Hernández', location: 'general-pardinas' },
    'carlos.lopez': { password: 'madmen2024', id: 'carlos-lopez', name: 'Carlos López', location: 'general-pardinas' },
    'luis.urbinez': { password: 'madmen2024', id: 'luis-urbinez', name: 'Luis Urbiñez', location: 'general-pardinas' },
    'randy.valdespino': { password: 'madmen2024', id: 'randy-valdespino', name: 'Randy Valdespino', location: 'general-pardinas' }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const barber = barberCredentials[username as keyof typeof barberCredentials];
    
    if (barber && barber.password === password) {
      // Guardar sesión del barbero
      localStorage.setItem('barberSession', JSON.stringify({
        id: barber.id,
        name: barber.name,
        location: barber.location,
        loginTime: new Date().toISOString()
      }));
      onLogin(barber.id, barber.name);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-barbershop-gold p-3 rounded-full">
              <Scissors className="w-8 h-8 text-barbershop-dark" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-barbershop-dark">
            Acceso Barberos
          </CardTitle>
          <p className="text-muted-foreground">Mad Men Barbería</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: luis.bracho"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90"
            >
              Iniciar Sesión
            </Button>
          </form>
          <div className="mt-4 text-xs text-center text-muted-foreground">
            <p>Usuarios de ejemplo:</p>
            <p>luis.bracho / madmen2024</p>
            <p>isaac.hernandez / madmen2024</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarberLogin;
