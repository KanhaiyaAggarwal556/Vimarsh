import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthStore } from '../types/auth';
import { createAuthActions, AUTH_CACHE_DURATION } from './authActions';


const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state - User data
      currentUser: null,
      isAuthenticated: false,
      
      // Initial state - Loading states
      isLoading: false,
      isInitializing: true,
      error: null,
      oauthInProgress: false,
      
      // Initial state - Session management (these were missing!)
      lastAuthCheck: null,
      lastActivity: null,
      sessionExpiry: null,

      // Spread all the actions
      ...createAuthActions(set, get),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        lastAuthCheck: state.lastAuthCheck,
        lastActivity: state.lastActivity,
        sessionExpiry: state.sessionExpiry,
        isAuthenticated: state.isAuthenticated,
      }),
      version: 8, // Increment version to trigger migration
      migrate: (persistedState: any, version: number) => {
        console.log("🔄 Migrating auth store from version", version);

        // Clear old data and start fresh for problematic versions
        if (version < 8) {
          return {
            currentUser: null,
            lastAuthCheck: null,
            lastActivity: null,
            sessionExpiry: null,
            isLoading: false,
            isInitializing: true, // Will trigger fresh initialization
            error: null,
            isAuthenticated: false,
            oauthInProgress: false,
          };
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("💾 Auth store rehydrated:", {
            hasUser: !!state.currentUser,
            isAuthenticated: state.isAuthenticated,
            lastAuthCheck: state.lastAuthCheck,
            lastActivity: state.lastActivity,
            sessionExpiry: state.sessionExpiry,
          });

          // Always reset these on rehydration
          state.isLoading = false;
          state.error = null;
          state.oauthInProgress = false;

          // Check session validity
          const now = Date.now();
          const isSessionExpired = state.sessionExpiry && now > state.sessionExpiry;
          const needsAuthCheck = !state.lastAuthCheck || 
            now - state.lastAuthCheck > AUTH_CACHE_DURATION;

          if (isSessionExpired) {
            // Session expired, clear user data
            state.currentUser = null;
            state.isAuthenticated = false;
            state.sessionExpiry = null;
            state.lastActivity = null;
            state.lastAuthCheck = null;
            state.isInitializing = false;
          } else {
            // Set initialization state based on whether we need to verify user
            const needsInitialization = !state.currentUser || needsAuthCheck;
            state.isInitializing = needsInitialization;
            state.isAuthenticated = !!state.currentUser;
          }

          console.log(
            "🔄 Rehydration complete - isInitializing:",
            state.isInitializing,
            "isSessionExpired:",
            isSessionExpired
          );
        }
      },
    }
  )
);

// Helper hook for easier access to common auth properties
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.currentUser, // Alias for easier access
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

export default useAuthStore;
export type { User } from '../types/auth';