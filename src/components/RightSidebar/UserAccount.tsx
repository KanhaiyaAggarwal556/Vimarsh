// UserAccount.tsx - Updated version compatible with new backend
import React, { useState, useEffect, useRef, useCallback } from "react";
import { User, LogIn, UserPlus, LogOut, Settings, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../Post/view_post/Single_Post/UI/UserAvatar";
import useAuthStore, { User as UserType } from "@store/useAuthStore";
import "./styles/UserAccount.css";

interface UserAccountProps {
  onUserChange?: (user: UserType | null) => void;
  className?: string;
}

const UserAccount: React.FC<UserAccountProps> = ({
  onUserChange,
  className = "",
}) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [showErrorNotification, setShowErrorNotification] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const initializeTimeoutRef = useRef<NodeJS.Timeout>();
  const errorTimeoutRef = useRef<NodeJS.Timeout>();

  // Get user and actions from Zustand store
  const { 
    currentUser, 
    isAuthenticated,
    isLoading,
    isInitializing,
    error,
    logout,
    initializeAuth,
    clearError,
  } = useAuthStore();

  // Memoized callback to prevent unnecessary re-renders
  const handleUserChange = useCallback((user: UserType | null) => {
    if (onUserChange) {
      onUserChange(user);
    }
  }, [onUserChange]);

  // Initialize authentication on mount
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (mounted && isInitializing) {
        try {
          console.log('UserAccount: Initializing auth...');
          await initializeAuth();
          console.log('UserAccount: Auth initialization completed');
        } catch (error) {
          console.error('UserAccount: Auth initialization failed:', error);
        }
      }
    };

    // Add small delay to prevent rapid successive calls
    initializeTimeoutRef.current = setTimeout(initialize, 50);

    return () => {
      mounted = false;
      if (initializeTimeoutRef.current) {
        clearTimeout(initializeTimeoutRef.current);
      }
    };
  }, [initializeAuth, isInitializing]);

  // Call onUserChange callback when user state changes
  useEffect(() => {
    handleUserChange(currentUser);
  }, [currentUser, handleUserChange]);

  // Handle clicking outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Handle error notifications
  useEffect(() => {
    if (error) {
      setShowErrorNotification(true);
      
      // Auto-clear error notification after 5 seconds
      errorTimeoutRef.current = setTimeout(() => {
        setShowErrorNotification(false);
        clearError();
      }, 5000);
    } else {
      setShowErrorNotification(false);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error, clearError]);

  // Event handlers with improved error handling
  const handleLogin = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserMenuOpen(false);
    clearError(); // Clear any existing errors
    navigate("/i/account/login");
  }, [navigate, clearError]);

  const handleSignup = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserMenuOpen(false);
    clearError(); // Clear any existing errors
    navigate("/i/account/signup");
  }, [navigate, clearError]);

  const handleLogout = useCallback(async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoggingOut) return; // Prevent double-clicks

    try {
      setIsLoggingOut(true);
      setIsUserMenuOpen(false);
      console.log("UserAccount: Starting logout process...");
      
      const result = await logout();
      console.log("UserAccount: Logout completed:", result);
      
      // Navigate to login page after successful logout
      navigate("/i/account/login", { replace: true });
      
    } catch (error) {
      console.error("UserAccount: Unexpected error during logout:", error);
      // Still navigate to login page even on error
      navigate("/i/account/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, navigate, isLoggingOut]);

  const handleUserProfile = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (currentUser) {
      setIsUserMenuOpen(false);
      navigate(`/${currentUser.userName}`);
    }
  }, [currentUser, navigate]);

  const handleSettings = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserMenuOpen(false);
    navigate("/settings");
  }, [navigate]);

  const handleMenuToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear any existing errors when opening menu
    if (!isUserMenuOpen && error) {
      setShowErrorNotification(false);
      clearError();
    }
    
    setIsUserMenuOpen(!isUserMenuOpen);
  }, [isUserMenuOpen, error, clearError]);

  const handleErrorDismiss = useCallback(() => {
    setShowErrorNotification(false);
    clearError();
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
  }, [clearError]);

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className={`user-account-loading ${className}`}>
        <div className="user-menu">
          <button
            type="button"
            disabled
            className="user-menu-button loading"
            aria-label="Loading user data"
          >
            <Loader2 size={24} className="animate-spin" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`user-account ${className}`} ref={userMenuRef}>
      <div className="user-menu">
        <button
          onClick={handleMenuToggle}
          type="button"
          aria-label={isAuthenticated ? "User menu" : "Account menu"}
          aria-expanded={isUserMenuOpen}
          className={`user-menu-button ${
            isAuthenticated && currentUser ? "logged-in" : "not-logged-in"
          } ${isLoading ? "loading" : ""}`}
          disabled={isLoading && !currentUser}
        >
          {isLoading && !currentUser ? (
            <Loader2 size={24} className="animate-spin" />
          ) : isAuthenticated && currentUser ? (
            <UserAvatar
              user={{
                avatar: currentUser.profilepic || "",
                name: currentUser.fullName,
                username: currentUser.userName,
                id: currentUser._id,
              }}
              size={40}
            />
          ) : (
            <User size={24} />
          )}
        </button>

        {isUserMenuOpen && (
          <div 
            className="user-dropdown"
            role="menu"
            aria-label="User account menu"
          >
            {isAuthenticated && currentUser ? (
              <>
                <button
                  onClick={handleUserProfile}
                  className="menu-item"
                  type="button"
                  role="menuitem"
                  aria-label="View profile"
                >
                  <User size={16} />
                  Profile
                </button>

                <button
                  onClick={handleSettings}
                  className="menu-item"
                  type="button"
                  role="menuitem"
                  aria-label="Settings"
                >
                  <Settings size={16} />
                  Settings
                </button>

                <div className="menu-divider" />

                <button
                  onClick={handleLogout}
                  className={`menu-item logout-item ${isLoggingOut ? 'loading' : ''}`}
                  type="button"
                  role="menuitem"
                  disabled={isLoggingOut || isLoading}
                  aria-label={isLoggingOut ? "Logging out..." : "Logout"}
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut size={16} />
                      Logout
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="menu-item"
                  type="button"
                  role="menuitem"
                  aria-label="Login"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                  Login
                </button>

                <button
                  onClick={handleSignup}
                  className="menu-item"
                  type="button"
                  role="menuitem"
                  aria-label="Sign up"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Enhanced error notification */}
      {showErrorNotification && error && (
        <div 
          className="auth-error-notification" 
          role="alert"
          aria-live="polite"
        >
          <AlertCircle size={16} className="error-icon" />
          <div className="error-message">
            {error}
          </div>
          <button
            onClick={handleErrorDismiss}
            className="error-dismiss-button"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );  
};

export default UserAccount;