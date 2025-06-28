
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from 'sonner';
import Index from '@/pages/Index';
import AdminPortal from '@/pages/AdminPortal';
import NotFound from '@/pages/NotFound';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { TooltipProvider } from "@/components/ui/tooltip"
import BarberPortal from '@/pages/BarberPortal';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SonnerToaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/barber" element={<BarberPortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
