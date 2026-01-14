import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import './PublicRoute.css';

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/home' 
}) => {
  const { isAuthenticated, isInitializing, currentUser } = useAuthStore();
  const location = useLocation();

  console.log('🌐 PublicRoute check:', { isAuthenticated, isInitializing, hasUser: !!currentUser, path: location.pathname });

  // Don't redirect during initialization
  if (isInitializing) {
    return (
      <div className="public-route-loading">
        <div className="loading-content">
          <div className="loading-spinner" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to home if already authenticated
  if (isAuthenticated && currentUser) {
    console.log('🌐 PublicRoute: User authenticated, redirecting to app');
    // Check if there's a return URL from navigation state
    const from = (location.state as any)?.from?.pathname;
    return <Navigate to={from || redirectTo} replace />;
  }

  console.log('🌐 PublicRoute: Showing public page');
  return <>{children}</>;
};

export default PublicRoute;