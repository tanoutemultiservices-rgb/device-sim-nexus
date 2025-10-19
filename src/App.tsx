import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import SimCards from "./pages/SimCards";
import Users from "./pages/Users";
import Activations from "./pages/Activations";
import Topups from "./pages/Topups";
import TopupRequest from "./pages/TopupRequest";
import ActivationRequest from "./pages/ActivationRequest";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ApiTest from "./pages/ApiTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <header className="sticky top-0 z-40 border-b bg-card h-14 flex items-center px-4">
                  <SidebarTrigger />
                </header>
                <main className="flex-1 p-6 animate-fade-in">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute allowedRoles={['ADMIN', 'CUSTOMER']}><Home /></ProtectedRoute>} />
                    <Route path="/devices" element={<ProtectedRoute allowedRoles={['ADMIN']}><Devices /></ProtectedRoute>} />
                    <Route path="/sim-cards" element={<ProtectedRoute allowedRoles={['ADMIN']}><SimCards /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><Users /></ProtectedRoute>} />
                    <Route path="/activations" element={<ProtectedRoute allowedRoles={['ADMIN', 'CUSTOMER']}><Activations /></ProtectedRoute>} />
                    <Route path="/topups" element={<ProtectedRoute allowedRoles={['ADMIN', 'CUSTOMER']}><Topups /></ProtectedRoute>} />
                    <Route path="/topup-request" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><TopupRequest /></ProtectedRoute>} />
                    <Route path="/activation-request" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ActivationRequest /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/api-test" element={<ProtectedRoute allowedRoles={['ADMIN']}><ApiTest /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
