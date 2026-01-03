import React, { useEffect, ReactNode } from 'react';
import useAuthStore from '../Store/useAuthStore';
import { useLocation } from 'react-router-dom';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { 
    initializeAuth, 
    isInitializing, 
    oauthInProgress, 
    setInitializing,
  } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Don't show any loading or initialize for OAuth success page
    if (location.pathname === '/oauth-success') {
      if (isInitializing) {
        setInitializing(false);
      }
      return; 
    }
    
    // If OAuth is in progress, don't interfere
    if (oauthInProgress) {
      console.log('OAuth in progress, skipping initialization');
      return;
    }
    
    // If we're not initializing, don't start initialization
    if (!isInitializing) {
      console.log('AuthProvider: Not in initializing state, skipping');
      return;
    }
    
    // Only run initialization once when isInitializing is true
    console.log('AuthProvider: Starting authentication initialization...');
    initializeAuth();
    
  }, [location.pathname, initializeAuth, setInitializing, isInitializing, oauthInProgress]);



  // Show loading screen ONLY during normal initialization (NOT for OAuth pages)
  if (isInitializing && location.pathname !== '/oauth-success') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-[#1d9bf0] rounded-full animate-spin mx-auto mb-6" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <h5 className="text-white mb-2 text-xl font-semibold">Initializing...</h5>
          <p className="text-gray-400 m-0 text-sm">Setting up your session...</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthProvider;