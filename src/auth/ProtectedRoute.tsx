import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../Store/useAuthStore';
import './ProtectedRoute.css';

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

  console.log('🔒 ProtectedRoute check:', { isAuthenticated, isInitializing, hasUser: !!currentUser, path: location.pathname });

  // Don't redirect during initialization
  if (isInitializing) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !currentUser) {
    console.log('🔒 ProtectedRoute: Redirecting to login');
    // Save the intended destination
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  console.log('🔒 ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;