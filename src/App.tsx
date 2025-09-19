import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Index from "./pages/Index";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookDemo from "./pages/BookDemo";
import RequestDemo from "./pages/RequestDemo";
import WhatsAppAPI from "./pages/WhatsAppAPI";
import FarmerDashboard from "./pages/dashboard/FarmerDashboard";
import ProcessorDashboard from "./pages/dashboard/ProcessorDashboard";
import LaboratoryDashboard from "./pages/dashboard/LaboratoryDashboard";
import ManufacturerDashboard from "./pages/dashboard/ManufacturerDashboard";
import RegulatorDashboard from "./pages/dashboard/RegulatorDashboard";
import ConsumerDashboard from "./pages/dashboard/ConsumerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/book-demo" element={<BookDemo />} />
              <Route path="/request-demo" element={<RequestDemo />} />
              <Route path="/whatsapp-api" element={<WhatsAppAPI />} />
              <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
              <Route path="/dashboard/processor" element={<ProcessorDashboard />} />
              <Route path="/dashboard/laboratory" element={<LaboratoryDashboard />} />
              <Route path="/dashboard/manufacturer" element={<ManufacturerDashboard />} />
              <Route path="/dashboard/regulator" element={<RegulatorDashboard />} />
              <Route path="/dashboard/consumer" element={<ConsumerDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </I18nextProvider>
  </QueryClientProvider>
);

export default App;
