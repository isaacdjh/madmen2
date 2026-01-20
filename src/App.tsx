
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthGuard } from "@/components/AuthGuard";
import { navItems } from "./nav-items";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import FloatingCallButton from "@/components/FloatingCallButton";

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
          {navItems.map(({ to, page, requiresAuth, requiredRole }) => (
            <Route 
              key={to} 
              path={to} 
              element={
                requiresAuth ? (
                  <AuthGuard requiredRole={requiredRole}>
                    {page}
                  </AuthGuard>
                ) : page
              } 
            />
          ))}
        </Routes>
        <FloatingCallButton />
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
          </QueryClientProvider>
  </div>
);

export default App;
