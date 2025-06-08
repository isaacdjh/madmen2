import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { Sonner } from 'sonner';
import Index from '@/pages/Index';
import AdminIndex from '@/pages/AdminIndex';
import NotFound from '@/pages/NotFound';
import {
  QueryClient,
} from '@tanstack/react-query'
import { TooltipProvider } from "@/components/ui/tooltip"
import BarberPortal from '@/pages/BarberPortal';

function App() {
  return (
    <QueryClient>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminIndex />} />
            <Route path="/barber" element={<BarberPortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClient>
  );
}

export default App;
