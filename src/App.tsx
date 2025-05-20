
import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const PropertiesPage = lazy(() => import("./pages/properties/PropertiesPage"));
const RentPropertiesPage = lazy(() => import("./pages/properties/RentPropertiesPage"));
const AddProperty = lazy(() => import("./pages/properties/AddProperty"));
const EditProperty = lazy(() => import("./pages/properties/EditProperty"));
const AgentsPage = lazy(() => import("./pages/agents/AgentsPage"));
const MortgageCalculatorPage = lazy(() => import("./pages/MortgageCalculatorPage"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/user/Dashboard"));
const ProfileSettings = lazy(() => import("./pages/user/ProfileSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

// Create a query client for React Query with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 404s or other specific errors
        if (error?.response?.status === 404) return false;
        // Only retry once for network issues
        return failureCount < 1;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // Prevent refetching on reconnect to reduce error spam
    },
  },
});

// Simple error boundary to catch and display React errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("React Error Boundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="mb-4 text-gray-700">
              Sorry, an error has occurred in the application.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading...</span>
              </div>
            }>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/rent" element={<RentPropertiesPage />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/mortgage-calculator" element={<MortgageCalculatorPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected routes - require authentication */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/user/profile-settings" element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                } />
                <Route path="/properties/add" element={
                  <ProtectedRoute>
                    <AddProperty />
                  </ProtectedRoute>
                } />
                <Route path="/add-property" element={
                  <ProtectedRoute>
                    <AddProperty />
                  </ProtectedRoute>
                } />
                <Route path="/properties/edit/:id" element={
                  <ProtectedRoute>
                    <EditProperty />
                  </ProtectedRoute>
                } />

                {/* Admin routes - require admin role */}
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRole="admin">
                    <div>Admin Dashboard</div>
                  </ProtectedRoute>
                } />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
