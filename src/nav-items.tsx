import { HomeIcon, Calendar, UserCheck, MapPin, Scissors, Users, Gift, BookOpen } from "lucide-react";
import Index from "./pages/Index";
import AdminPortal from "./pages/AdminPortal";
import Reservas from "./pages/Reservas";
import Ubicaciones from "./pages/Ubicaciones";
import Servicios from "./pages/Servicios";
import Equipo from "./pages/Equipo";
import Bonos from "./pages/Bonos";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

export interface NavItem {
  title: string;
  to: string;
  icon?: any;
  page: React.ReactNode;
  requiresAuth?: boolean;
  requiredRole?: 'admin' | 'barber' | 'user';
}

const navItems: NavItem[] = [
  {
    title: "Inicio",
    to: "/",
    icon: HomeIcon,
    page: <Index />,
  },
  {
    title: "Ubicaciones",
    to: "/ubicaciones",
    icon: MapPin,
    page: <Ubicaciones />,
  },
  {
    title: "Servicios",
    to: "/servicios",
    icon: Scissors,
    page: <Servicios />,
  },
  {
    title: "Equipo",
    to: "/equipo",
    icon: Users,
    page: <Equipo />,
  },
  {
    title: "Bonos",
    to: "/bonos",
    icon: Gift,
    page: <Bonos />,
  },
  {
    title: "Blog",
    to: "/blog",
    icon: BookOpen,
    page: <Blog />,
  },
  {
    title: "Administrador",
    to: "/admin",
    icon: UserCheck,
    page: <AdminPortal />,
  },
  {
    title: "Reserva",
    to: "/reserva",
    icon: Calendar,
    page: <Reservas />,
  },
  {
    title: "Not Found",
    to: "*",
    page: <NotFound />,
  },
];

export { navItems };
