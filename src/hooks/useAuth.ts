import  useAuthStore from '@store/useAuthStore';

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.currentUser,
    currentUser: store.currentUser,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isInitializing: store.isInitializing,
    error: store.error,
    oauthInProgress: store.oauthInProgress,
    lastActivity: store.lastActivity,
    sessionExpiry: store.sessionExpiry,
    login: store.login,
    logout: store.logout,
    register: store.register,
    handleOAuthCallback: store.handleOAuthCallback,
    startOAuth: store.startOAuth,
    clearError: store.clearError,
    updateActivity: store.updateActivity,
    isSessionValid: store.isSessionValid,
    extendSession: store.extendSession,
    clearSession: store.clearSession,
  };
};
