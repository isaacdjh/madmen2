import { HomeIcon, CalendarIcon, Users, MapIcon, MessageCircle, Package, Gift, UserCheck, DollarSign, Upload, BarChart3, Scissors } from "lucide-react";
import Index from "./pages/Index";
import Servicios from "./pages/Servicios";
import Equipo from "./pages/Equipo";
import Ubicaciones from "./pages/Ubicaciones";
import Contacto from "./pages/Contacto";
import Productos from "./pages/Productos";
import Bonos from "./pages/Bonos";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import CancelAppointment from "./pages/CancelAppointment";
import AdminPortal from "./pages/AdminPortal";
import BarberPortal from "./pages/BarberPortal";
import ImportClients from "./pages/ImportClients";
import Auth from "./pages/Auth";

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
    title: "Servicios",
    to: "/servicios",
    icon: CalendarIcon,
    page: <Servicios />,
  },
  {
    title: "Equipo",
    to: "/equipo",
    icon: Users,
    page: <Equipo />,
  },
  {
    title: "Ubicaciones",
    to: "/ubicaciones",
    icon: MapIcon,
    page: <Ubicaciones />,
  },
  {
    title: "Contacto",
    to: "/contacto",
    icon: MessageCircle,
    page: <Contacto />,
  },
  {
    title: "Productos",
    to: "/productos",
    icon: Package,
    page: <Productos />,
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
    icon: BarChart3,
    page: <Blog />,
  },
  {
    title: "Administrador",
    to: "/admin",
    icon: UserCheck,
    page: <AdminPortal />,
    requiresAuth: true,
    requiredRole: 'admin',
  },
  {
    title: "Barbero",
    to: "/barber",
    icon: Scissors,
    page: <BarberPortal />,
    requiresAuth: true,
    requiredRole: 'barber',
  },
  {
    title: "Importar Clientes",
    to: "/import-clients",
    icon: Upload,
    page: <ImportClients />,
    requiresAuth: true,
    requiredRole: 'admin',
  },
  {
    title: "Autenticación",
    to: "/auth",
    page: <Auth />,
  },
  {
    title: "Cancelar Cita",
    to: "/cancel-appointment/:id",
    page: <CancelAppointment />,
  },
  {
    title: "Not Found",
    to: "*",
    page: <NotFound />,
  },
];

export { navItems };