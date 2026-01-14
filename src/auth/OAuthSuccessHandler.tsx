// FIX 1: Update OAuthSuccessHandler.tsx - Fix method name and remove unused variable
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import Spinner from '../components/common/spinner';

const OAuthSuccessHandler: React.FC = () => {
  const navigate = useNavigate();
  const { handleOAuthCallback, setInitializing, setOAuthInProgress } = useAuthStore(); // Fixed: setOAuthInProgress (capital O)
  const [progress, setProgress] = useState(0);

  const oAuthProcessInitiated = useRef(false);
  useEffect(() => {
    const processOAuthSuccess = async () => {
      try {
        
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
        await new Promise(resolve => setTimeout(resolve, 300));
        
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

    if (oAuthProcessInitiated.current) {
      return;
    }

    oAuthProcessInitiated.current = true;

    processOAuthSuccess();
  }, [handleOAuthCallback, navigate, setInitializing, setOAuthInProgress]); // Fixed: setOAuthInProgress

  // Always show loading (removed unused isProcessing variable)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black to-neutral-900 font-sans text-white">
      <div className="w-full max-w-md p-8 text-center">
        <div className="mb-8">
          <div className="mb-6 flex justify-center">
            <Spinner />
          </div>
          <div className="mb-4 h-1 w-full overflow-hidden rounded bg-white/10">
            <div 
              className="h-full rounded bg-gradient-to-r from-sky-500 to-blue-700 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="mb-8 space-y-4">
          <div className="text-lg font-semibold">
            {progress < 20 && "Verifying Credentials..."}
            {progress >= 20 && progress < 60 && "Setting Up Session..."}
            {progress >= 60 && "Redirecting to App..."}
          </div>
          <div className="text-sm text-gray-400">
            {progress < 20 && "Checking your credentials with the authentication provider."}
            {progress >= 20 && progress < 60 && "Configuring your session for a seamless experience."}
            {progress >= 60 && "Taking you to the app.  This might take a moment."}
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          <small>Please wait, this process may take a few seconds.</small>
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccessHandler;