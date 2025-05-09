
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SearchResults from "./pages/SearchResults";
import NewBooking from "./pages/NewBooking";
import BookingDetails from "./pages/BookingDetails";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminUsers from "./pages/admin/Users";
import AdminDestinations from "./pages/admin/Destinations";
import AdminBookingRequests from "./pages/admin/BookingRequests";
import { useEffect } from "react";

// Create the query client
const queryClient = new QueryClient();

const App = () => {
  // Force dark mode when app loads to match the video
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected user routes */}
              <Route
                path="/search"
                element={<ProtectedRoute><SearchResults /></ProtectedRoute>}
              />
              <Route
                path="/booking/new"
                element={<ProtectedRoute><NewBooking /></ProtectedRoute>}
              />
              <Route
                path="/booking/:id"
                element={<ProtectedRoute><BookingDetails /></ProtectedRoute>}
              />
              <Route
                path="/bookings"
                element={<ProtectedRoute><Bookings /></ProtectedRoute>}
              />
              
              {/* Admin routes */}
              <Route
                path="/admin/users"
                element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>}
              />
              <Route
                path="/admin/destinations"
                element={<ProtectedRoute requiredRole="admin"><AdminDestinations /></ProtectedRoute>}
              />
              <Route
                path="/admin/booking-requests"
                element={<ProtectedRoute requiredRole="admin"><AdminBookingRequests /></ProtectedRoute>}
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
