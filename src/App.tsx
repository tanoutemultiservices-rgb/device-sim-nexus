import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import SimCards from "./pages/SimCards";
import Users from "./pages/Users";
import Activations from "./pages/Activations";
import Topups from "./pages/Topups";
import TopupRequest from "./pages/TopupRequest";
import ActivationRequest from "./pages/ActivationRequest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen w-full bg-background">
          <TopNav />
          <main className="p-6 animate-fade-in">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/sim-cards" element={<SimCards />} />
              <Route path="/users" element={<Users />} />
              <Route path="/activations" element={<Activations />} />
              <Route path="/topups" element={<Topups />} />
              <Route path="/topup-request" element={<TopupRequest />} />
              <Route path="/activation-request" element={<ActivationRequest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
