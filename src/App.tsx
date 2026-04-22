import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CountryProvider } from "@/contexts/CountryContext";
import { AppLayout } from "@/components/app/AppLayout";
import Dashboard from "@/pages/app/Dashboard";
import Calculators from "@/pages/app/Calculators";
import CalculatorDetail from "@/pages/app/CalculatorDetail";
import Clients from "@/pages/app/Clients";
import Compliance from "@/pages/app/Compliance";
import CalcAI from "@/pages/app/CalcAI";
import Documents from "@/pages/app/Documents";
import Placeholder from "@/pages/app/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CountryProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calculators/:category" element={<Calculators />} />
              <Route path="/calculator/:slug" element={<CalculatorDetail />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/ai" element={<CalcAI />} />
              <Route path="/history" element={<Placeholder title="History" />} />
              <Route path="/reports" element={<Placeholder title="Reports" />} />
              <Route path="/settings" element={<Placeholder title="Settings" />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CountryProvider>
  </QueryClientProvider>
);

export default App;
