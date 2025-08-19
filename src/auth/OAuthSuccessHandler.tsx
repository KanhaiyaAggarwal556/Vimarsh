// FIX 1: Update OAuthSuccessHandler.tsx - Fix method name and remove unused variable
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/useAuthStore';
import toast from 'react-hot-toast';
import './OAuthSuccessHandler.css';

const OAuthSuccessHandler: React.FC = () => {
  const navigate = useNavigate();
  const { handleOAuthCallback, setInitializing, setOAuthInProgress } = useAuthStore(); // Fixed: setOAuthInProgress (capital O)
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const processOAuthSuccess = async () => {
      try {
        console.log('Processing OAuth success...');
        
        // Set OAuth in progress to prevent AuthProvider interference
        setOAuthInProgress(true); // Fixed: setOAuthInProgress (capital O)
        
        // Ensure we're not in initializing state during OAuth processing
        setInitializing(false);
        
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);
        
        // Call the OAuth callback handler from the store
        const result = await handleOAuthCallback();
        
        clearInterval(progressInterval);
        setProgress(100);
        
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (result.success && result.user) {
          console.log('OAuth authentication successful:', result.user);
          toast.success(result.message || 'Successfully logged in!', {
            style: {
              background: '#1d4ed8',
              color: '#ffffff',
            },
          });
          navigate('/home', { replace: true });
        } else {
          console.error('OAuth verification failed:', result.message);
          toast.error(result.message || 'Authentication failed. Please try again.', {
            style: {
              background: '#dc2626',
              color: '#ffffff',
            },
          });
          navigate('/i/account/login', { replace: true });
        }
      } catch (error) {
        console.error('OAuth success handler error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Authentication error occurred';
        toast.error(errorMessage, {
          style: {
            background: '#dc2626',
            color: '#ffffff',
          },
        });
        navigate('/i/account/login', { replace: true });
      } finally {
        // Clear all loading states
        setInitializing(false);
        setOAuthInProgress(false); // Fixed: setOAuthInProgress (capital O)
      }
    };

    // Start the OAuth processing
    processOAuthSuccess();
  }, [handleOAuthCallback, navigate, setInitializing, setOAuthInProgress]); // Fixed: setOAuthInProgress

  // Always show loading (removed unused isProcessing variable)
  return (
    <div className="oauth-success-container">
      <div className="oauth-success-content">
        <div className="loading-animation">
          <div className="loading-spinner"></div>
          <div className="loading-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <h4 className="loading-title">Completing Authentication</h4>
        <p className="loading-subtitle">Please wait while we verify your login...</p>
        
        <div className="loading-steps">
          <div className={`step ${progress > 20 ? 'completed' : 'active'}`}>
            <div className="step-icon">✓</div>
            <span>Verifying credentials</span>
          </div>
          <div className={`step ${progress > 60 ? 'completed' : progress > 20 ? 'active' : ''}`}>
            <div className="step-icon">✓</div>
            <span>Setting up session</span>
          </div>
          <div className={`step ${progress > 90 ? 'completed' : progress > 60 ? 'active' : ''}`}>
            <div className="step-icon">✓</div>
            <span>Redirecting to app</span>
          </div>
        </div>
        
        <div className="loading-footer">
          <small>This may take a few seconds</small>
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccessHandler;