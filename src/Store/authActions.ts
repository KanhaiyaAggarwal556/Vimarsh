// store/authActions.ts
import {
  AuthState,
  AuthActions,
  User,
  RegisterData,
  AuthResponse,
} from "../types/auth";
import { AuthApiService } from "../services/AuthApiService";

export const AUTH_CACHE_DURATION = 3 * 60 * 1000; // 3 minutes cache for auth checks

export const createAuthActions = (
  set: (partial: Partial<AuthState>) => void,
  get: () => AuthState & AuthActions
): AuthActions => ({
  // --- State Setters ---
  setCurrentUser: (user: User | null) => {
    set({
      currentUser: user,
      isAuthenticated: !!user,
      lastAuthCheck: user ? Date.now() : null,
      error: null,
      isLoading: false,
    });
  },

  removeAllUser: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      oauthInProgress: false,
      isInitializing: false,
      lastAuthCheck: Date.now(),
    });
  },

  updateCurrentUser: (updatedUser: Partial<User>) => {
    const { currentUser } = get();
    if (currentUser) {
      set({
        currentUser: { ...currentUser, ...updatedUser },
        error: null,
        lastAuthCheck: Date.now(),
      });
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
  setInitializing: (isInitializing: boolean) => set({ isInitializing }),
  setError: (error: string | null) => set({ error, isLoading: false }),
  clearError: () => set({ error: null }),
  setOAuthInProgress: (oauthInProgress: boolean) => set({ oauthInProgress }),

  // --- Auth Actions ---

  login: async (
    emailOrUsername: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      set({ isLoading: true, error: null });

      // Input validation
      if (!emailOrUsername?.trim() || !password?.trim()) {
        throw new Error("Email/username and password are required");
      }

      const result = await AuthApiService.login(emailOrUsername, password);

      if (result.success && result.user) {
        set({
          currentUser: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          lastAuthCheck: Date.now(),
        });
        return { success: true, user: result.user };
      } else {
        throw new Error(result.message || "Login failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        currentUser: null,
      });
      return { success: false, message: errorMessage };
    }
  },

  // --- Session Management ---
  updateActivity: () => {
    const { currentUser } = get();
    if (currentUser) {
      set({
        lastAuthCheck: Date.now(),
        error: null,
      });
    }
  },

  isSessionValid: (): boolean => {
    const state = get();
    if (!state.currentUser || !state.isAuthenticated || !state.lastAuthCheck) {
      return false;
    }
    return (Date.now() - state.lastAuthCheck) < AUTH_CACHE_DURATION;
  },

  extendSession: (): void => {
    const { currentUser } = get();
    if (currentUser) {
      set({ lastAuthCheck: Date.now(), error: null });
    }
  },

  clearSession: () => {
    get().removeAllUser();
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      set({ isLoading: true, error: null });

      // Input validation
      if (!userData.email?.trim() || !userData.password?.trim() || !userData.userName?.trim()) {
        throw new Error("All required fields must be filled");
      }

      const result = await AuthApiService.register(userData);

      if (result.success && result.user) {
        set({
          currentUser: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          lastAuthCheck: Date.now(),
        });
        return result;
      }
      
      throw new Error(result.message || "Registration failed");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await AuthApiService.logout();
      get().removeAllUser();
      return result;
    } catch (error) {
      // Always clear local state even if API fails
      get().removeAllUser();
      return { success: true, message: "Logged out successfully" };
    }
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const state = get();

    // Check cache first
    const shouldUseCache =
      !state.isInitializing &&
      !state.oauthInProgress &&
      state.lastAuthCheck &&
      Date.now() - state.lastAuthCheck < AUTH_CACHE_DURATION &&
      state.currentUser &&
      state.isAuthenticated;

    if (shouldUseCache) {
      return {
        success: true,
        user: state.currentUser || undefined,
        message: "Using cached user data",
      };
    }

    try {
      // Don't set loading during initialization to prevent UI flicker
      if (!state.isInitializing && !state.oauthInProgress) {
        set({ isLoading: true, error: null });
      }

      const result = await AuthApiService.getCurrentUser();

      if (result.success && result.user) {
        set({
          currentUser: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          lastAuthCheck: Date.now(),
        });
        return result;
      } else {
        // Handle failure
        if (result.message === "Not authenticated") {
          set({
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            lastAuthCheck: Date.now(),
          });
        } else {
          set({ isLoading: false, error: result.message });
        }
        return result;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch user data";

      // Only clear user state for authentication errors
      const isAuthError =
        errorMessage.includes("Not authenticated") ||
        errorMessage.includes("Authentication required") ||
        errorMessage.includes("401") ||
        errorMessage.includes("Access denied");

      if (isAuthError) {
        set({
          currentUser: null,
          isAuthenticated: false,
          isLoading: false,
          error: errorMessage,
          lastAuthCheck: Date.now(),
        });
      } else {
        set({
          isLoading: false,
          error: errorMessage,
        });
      }

      return { success: false, message: errorMessage };
    }
  },

  refreshToken: async () => {
    try {
      const result = await AuthApiService.refreshToken();

      if (result.success) {
        await get().getCurrentUser();
      } else {
        get().removeAllUser();
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Token refresh failed";
      const isAuthError =
        errorMessage.includes("401") ||
        errorMessage.includes("Authentication required") ||
        errorMessage.includes("Access denied");

      if (isAuthError) {
        get().removeAllUser();
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  initializeAuth: async () => {
    const state = get();

    // Skip if not in initializing state (prevents infinite loops)
    if (!state.isInitializing) return;

    // Skip if already loading (prevents duplicate calls)
    if (state.isLoading) return;

    try {
      // Set loading but keep initializing true until we're done
      set({ isLoading: true, error: null });

      // Enhanced cache validation
      const hasCachedUser = state.currentUser && state.lastAuthCheck;
      const isCacheValid =
        hasCachedUser &&
        Date.now() - state.lastAuthCheck! < AUTH_CACHE_DURATION &&
        state.isAuthenticated;

      if (isCacheValid) {
        set({
          isInitializing: false,
          isLoading: false,
          isAuthenticated: true,
        });
        return;
      }

      // If we have a cached user but cache is old, verify with server
      if (hasCachedUser) {
        const result = await state.getCurrentUser();
        if (!result.success) {
          state.removeAllUser();
        }
      } else {
        await state.getCurrentUser();
      }
    } catch (error) {
      state.removeAllUser();
      set({
        error: error instanceof Error ? error.message : "Authentication initialization failed",
      });
    } finally {
      set({
        isInitializing: false,
        isLoading: false,
      });
    }
  },

  // Password reset operations - Enhanced error handling
  forgotPassword: async (email: string) => {
    try {
      // Input validation
      if (!email?.trim()) throw new Error("Email is required");

      set({ isLoading: true, error: null });

      const result = await AuthApiService.forgotPassword(email);
      set({ isLoading: false });

      if (!result.success) set({ error: result.message });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email";
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      // Input validation
      if (!email?.trim() || !otp?.trim()) throw new Error("Email and OTP are required");

      set({ isLoading: true, error: null });

      const result = await AuthApiService.verifyOTP(email, otp);
      set({ isLoading: false });

      if (!result.success) set({ error: result.message });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "OTP verification failed";
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  resetPassword: async (
    email: string,
    resetToken: string,
    newPassword: string
  ) => {
    try {
      // Input validation
      if (!email?.trim() || !resetToken?.trim() || !newPassword?.trim()) {
        throw new Error("All fields are required for password reset");
      }

      set({ isLoading: true, error: null });
      const result = await AuthApiService.resetPassword(email, resetToken, newPassword);
      set({ isLoading: false });

      if (!result.success) set({ error: result.message });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Password reset failed";
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  resendOTP: async (email: string) => {
    try {
      if (!email?.trim()) throw new Error("Email is required to resend OTP");

      set({ isLoading: true, error: null });

      const result = await AuthApiService.resendOTP(email);
      set({ isLoading: false });

      if (!result.success) set({ error: result.message });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to resend OTP";
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // --- OAuth Operations ---
  startOAuth: (provider: string) => {
    try {
      if (!provider?.trim()) {
        set({ error: "OAuth provider is required" });
        return;
      }
      set({ oauthInProgress: true, error: null });
      AuthApiService.startOAuth(provider);
    } catch (error) {
      set({
        oauthInProgress: false,
        error: "Failed to start OAuth flow",
      });
    }
  },

  handleOAuthCallback: async () => {
    try {
      set({
        isLoading: true,
        oauthInProgress: true,
        error: null,
        isInitializing: false,
      });

      // Wait for cookies to be properly set
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Attempt to get current user to verify OAuth success
      const result = await get().getCurrentUser();

      if (result.success && result.user) {
        set({
          oauthInProgress: false,
          isLoading: false,
          error: null,
          isInitializing: false,
        });
        return {
          success: true,
          message: "OAuth authentication successful",
          user: result.user,
        };
      } else {
        set({
          oauthInProgress: false,
          isLoading: false,
          error: "OAuth authentication failed - please try again",
          isInitializing: false,
          currentUser: null,
          isAuthenticated: false,
        });
        return {
          success: false,
          message: result.message || "OAuth authentication failed",
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "OAuth authentication error";

      set({
        oauthInProgress: false,
        isLoading: false,
        error: errorMessage,
        currentUser: null,
        isAuthenticated: false,
        isInitializing: false,
      });

      return { success: false, message: errorMessage };
    }
  },
});
