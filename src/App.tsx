
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import AdminPortal from "./pages/AdminPortal";
import BarberPortal from "./pages/BarberPortal";
import CancelAppointment from "./pages/CancelAppointment";
import ImportClients from "./pages/ImportClients";
import NotFound from "./pages/NotFound";
import Bonos from "./pages/Bonos";
import Equipo from "./pages/Equipo";
import Ubicaciones from "./pages/Ubicaciones";
import Productos from "./pages/Productos";
import Servicios from "./pages/Servicios";
import Contacto from "./pages/Contacto";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import BlogPage from "@/pages/Blog";

const queryClient = new QueryClient();

const App = () => (
  <div className="min-h-screen">
    <GoogleAnalytics />
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="barbershop-ui-theme">
        <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bonos" element={<Bonos />} />
          <Route path="/equipo" element={<Equipo />} />
          <Route path="/ubicaciones" element={<Ubicaciones />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/servicios" element={<Servicios />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/barber" element={<BarberPortal />} />
            <Route path="/cancel/:appointmentId" element={<CancelAppointment />} />
            <Route path="/import-clients" element={<ImportClients />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
          </QueryClientProvider>
  </div>
);

export default App;
