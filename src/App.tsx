import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import AppNavbar from "@/components/AppNavbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoutesPage from "./pages/RoutesPage";
import BookRide from "./pages/BookRide";
import MyTickets from "./pages/MyTickets";
import Loyalty from "./pages/Loyalty";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoutes from "./pages/AdminRoutes";
import AdminVehicles from "./pages/AdminVehicles";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppNavbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/book" element={<BookRide />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/loyalty" element={<Loyalty />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/routes" element={<AdminRoutes />} />
            <Route path="/admin/vehicles" element={<AdminVehicles />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
