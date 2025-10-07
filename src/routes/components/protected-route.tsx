import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from 'src/contexts/auth-context';
import { LoadingSpinner } from 'src/components/loading-spinner';

// ----------------------------------------------------------------------

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: string;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredUserType, 
  redirectTo = '/admin/sign-in' 
}: ProtectedRouteProps) {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // If not authenticated, redirect to sign-in page
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If user type is required and doesn't match, redirect to unauthorized page
  if (requiredUserType && userType !== requiredUserType) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  return <>{children}</>;
}

// ----------------------------------------------------------------------

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  return (
    <ProtectedRoute requiredUserType="admin" redirectTo="/admin/sign-in">
      {children}
    </ProtectedRoute>
  );
}

// ----------------------------------------------------------------------

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

export function UserProtectedRoute({ children }: UserProtectedRouteProps) {
  return (
    <ProtectedRoute requiredUserType="user" redirectTo="/user/sign-in">
      {children}
    </ProtectedRoute>
  );
}