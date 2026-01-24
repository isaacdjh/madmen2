import { HomeIcon, Calendar, UserCheck } from "lucide-react";
import Index from "./pages/Index";
import AdminPortal from "./pages/AdminPortal";
import Reservas from "./pages/Reservas";
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
