import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import Spinner from '../components/common/spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/i/account/login' 
}) => {
  const { isAuthenticated, isInitializing, currentUser } = useAuthStore();
  const location = useLocation();

  // Don't redirect during initialization
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !currentUser) {
    // Save the intended destination
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;