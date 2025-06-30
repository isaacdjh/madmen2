
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminPortal from "./pages/AdminPortal";
import BarberPortal from "./pages/BarberPortal";
import AdminIndex from "./pages/AdminIndex";
import CancelAppointment from "./pages/CancelAppointment";
import ImportClients from "./pages/ImportClients";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/*" element={<AdminIndex />} />
          <Route path="/admin-portal" element={<AdminPortal />} />
          <Route path="/barber-portal" element={<BarberPortal />} />
          <Route path="/cancel/:appointmentId" element={<CancelAppointment />} />
          <Route path="/import-clients" element={<ImportClients />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
