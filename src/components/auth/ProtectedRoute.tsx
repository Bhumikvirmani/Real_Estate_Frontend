import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

/**
 * A wrapper component that protects routes requiring authentication
 * Redirects to login if user is not authenticated
 * Can also check for specific roles if requiredRole is provided
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Check if user has the required role(s)
  const hasRequiredRole = () => {
    if (!requiredRole || !user) return true;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying authentication...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect to unauthorized page if user doesn't have required role
  if (!hasRequiredRole()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
