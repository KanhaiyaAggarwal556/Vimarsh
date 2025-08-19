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
    isAuthenticated,
  } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    console.log('AuthProvider: Location changed to:', location.pathname);
    console.log('AuthProvider: Current state - isInitializing:', isInitializing, 'isAuthenticated:', isAuthenticated, 'oauthInProgress:', oauthInProgress);
    
    // Don't show any loading or initialize for OAuth success page
    if (location.pathname === '/oauth-success') {
      console.log('OAuth success page detected, letting OAuthSuccessHandler take over');
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

  // Your existing styles...
  const loadingStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff'
  };

  const contentStyles: React.CSSProperties = {
    textAlign: 'center'
  };

  const spinnerStyles: React.CSSProperties = {
    width: '3rem',
    height: '3rem',
    border: '0.25em solid rgba(255, 255, 255, 0.1)',
    borderTop: '0.25em solid #1d9bf0',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1.5rem'
  };

  const titleStyles: React.CSSProperties = {
    color: '#ffffff',
    marginBottom: '0.5rem',
    fontSize: '1.25rem',
    fontWeight: 600
  };

  const subtitleStyles: React.CSSProperties = {
    color: '#8b98a5',
    margin: 0,
    fontSize: '0.875rem'
  };

  const hiddenStyles: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0
  };

  // Show loading screen ONLY during normal initialization (NOT for OAuth pages)
  if (isInitializing && location.pathname !== '/oauth-success') {
    console.log('AuthProvider: Showing initialization loading screen');
    return (
      <div style={loadingStyles}>
        <div style={contentStyles}>
          <div style={spinnerStyles} role="status">
            <span style={hiddenStyles}>Loading...</span>
          </div>
          <h5 style={titleStyles}>Initializing...</h5>
          <p style={subtitleStyles}>Setting up your session...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  console.log('AuthProvider: Rendering children');
  return <>{children}</>;
};

export default AuthProvider;