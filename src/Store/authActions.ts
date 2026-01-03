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
  // State setters
  setCurrentUser: (user: User | null) => {
    set({
      currentUser: user,
      isAuthenticated: !!user,
      error: null,
      isLoading: false,
      oauthInProgress: false,
      lastAuthCheck: user ? Date.now() : null,
    });
  },

  removeAllUser: () => {
    console.log("🧹 Clearing all user data");
    set({
      currentUser: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      oauthInProgress: false,
      isInitializing: false, // CRITICAL: Don't reinitialize after logout
      lastAuthCheck: Date.now(), // Mark that we just determined no auth
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

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setInitializing: (initializing: boolean) => {
    set({ isInitializing: initializing });
  },

  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  clearError: () => {
    set({ error: null });
  },

  setOAuthInProgress: (inProgress: boolean) => {
    set({ oauthInProgress: inProgress });
  },

  // Auth operations - Updated to handle ApiService improvements
  login: async (
    emailOrUsername: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      set({ isLoading: true, error: null });

      // Input validation
      if (!emailOrUsername?.trim() || !password?.trim()) {
        const errorMsg = "Email/username and password are required";
        set({
          isLoading: false,
          error: errorMsg,
        });
        return { success: false, message: errorMsg };
      }

      const result = await AuthApiService.login(emailOrUsername, password);

      if (result.success && result.user) {

        // Set user data in store
        set({
          currentUser: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          lastAuthCheck: Date.now(),
        });

        console.log("✅ User state updated successfully");

        return {
          success: true,
          user: result.user,
          message: result.message || "Login successful",
        };
      } else {

        set({
          isLoading: false,
          error: result.message,
          isAuthenticated: false,
          currentUser: null,
        });

        return {
          success: false,
          message: result.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("🚨 Login action error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed - please try again";

      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        currentUser: null,
      });

      return { success: false, message: errorMessage };
    }
  },

  // Session management methods
  updateActivity: () => {
    const { currentUser } = get();
    if (currentUser) {
      set({
        lastAuthCheck: Date.now(),
        error: null,
      });
      console.log("🔄 User activity updated");
    }
  },

  isSessionValid: (): boolean => {
    const state = get();
    if (!state.currentUser || !state.isAuthenticated || !state.lastAuthCheck) {
      return false;
    }

    const sessionAge = Date.now() - state.lastAuthCheck;
    const isValid = sessionAge < AUTH_CACHE_DURATION;

    if (!isValid) {
      console.log("⚠️ Session expired");
    }

    return isValid;
  },

  extendSession: (): void => {
    const { currentUser } = get();
    if (currentUser) {
      console.log("🔄 Extending session...");
      set({
        lastAuthCheck: Date.now(),
        error: null,
      });
      console.log("✅ Session extended successfully");
    } else {
      console.log("❌ Cannot extend session - no current user");
    }
  },

  clearSession: () => {
    console.log("🧹 Clearing session data");
    get().removeAllUser();
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      set({ isLoading: true, error: null });

      // Input validation
      if (
        !userData.email?.trim() ||
        !userData.password?.trim() ||
        !userData.userName?.trim()
      ) {
        const errorMsg = "All required fields must be filled";
        set({
          isLoading: false,
          error: errorMsg,
        });
        return { success: false, message: errorMsg };
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
      } else {
        set({
          isLoading: false,
          error: result.message,
        });
      }

      return result;
    } catch (error) {
      console.error("❌ Registration error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed - please try again";
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });

      console.log("🚪 Starting logout process...");
      const result = await AuthApiService.logout();

      // Always clear user state regardless of API call result (as per ApiService design)
      console.log("🧹 Clearing user state after logout");
      get().removeAllUser(); // This will set isInitializing to false

      console.log("✅ Logout completed");
      return result;
    } catch (error) {
      // Even if logout API fails, clear the user state locally
      console.error("⚠️ Logout API error (clearing state anyway):", error);
      get().removeAllUser();
      return { success: true, message: "Logged out successfully" };
    }
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const state = get();

    // Enhanced cache logic
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

      console.log("🔍 Fetching current user from server...");
      const result = await AuthApiService.getCurrentUser();

      if (result.success && result.user) {
        console.log("✅ Current user fetched:", result.user.userName);
        set({
          currentUser: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          lastAuthCheck: Date.now(),
        });
      } else {
        // Handle "Not authenticated" response
        if (result.message === "Not authenticated") {
          console.log("🔓 User not authenticated, clearing state");
          set({
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            lastAuthCheck: Date.now(),
          });
        } else {
          // For other errors, don't clear user state (might be temporary server issue)
          console.log("⚠️ Get user error (keeping state):", result.message);
          set({
            isLoading: false,
            error: result.message,
          });
        }
      }

      return result;
    } catch (error) {
      console.error("❌ Get current user error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user data";

      // Enhanced error handling - only clear user state for authentication errors
      const isAuthError =
        errorMessage.includes("Not authenticated") ||
        errorMessage.includes("Authentication required") ||
        errorMessage.includes("401") ||
        errorMessage.includes("Access denied");

      if (isAuthError) {
        console.log("🔓 Auth error detected, clearing user state");
        set({
          currentUser: null,
          isAuthenticated: false,
          isLoading: false,
          error: errorMessage,
          lastAuthCheck: Date.now(),
        });
      } else {
        // For network/server errors, keep user state but show error
        console.log("⚠️ Network/server error, keeping user state");
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
      console.log("🔄 Attempting token refresh...");
      const result = await AuthApiService.refreshToken();

      if (result.success) {
        console.log("✅ Token refreshed, updating user data...");
        // After refresh, get current user to ensure state is updated
        await get().getCurrentUser();
      } else {
        console.log("❌ Token refresh failed, clearing auth state");
        // Clear auth state if refresh fails
        get().removeAllUser();
      }

      return result;
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Token refresh failed";

      // Enhanced error handling for token refresh
      const isAuthError =
        errorMessage.includes("401") ||
        errorMessage.includes("Authentication required") ||
        errorMessage.includes("Access denied");

      if (isAuthError) {
        console.log("🔓 Auth error during refresh, clearing state");
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
    if (!state.isInitializing) {
      console.log("⚠️ initializeAuth: Not in initializing state, skipping");
      return;
    }

    // Skip if already loading (prevents duplicate calls)
    if (state.isLoading) {
      console.log("⚠️ initializeAuth: Already loading, skipping");
      return;
    }

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
        console.log("✅ Using valid cached user data during initialization");
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

        if (result.success && result.user) {
          console.log("✅ Cached user verified with server");
        } else {
          console.log("❌ Cached user invalid, clearing...");
          state.removeAllUser();
        }
      } else {
        // No cached user, check with server
        console.log("🔍 No cached user, checking with server...");
        await state.getCurrentUser();
      }
    } catch (error) {
      // Clear auth state on initialization error
      state.removeAllUser();

      set({
        error:
          error instanceof Error
            ? error.message
            : "Authentication initialization failed",
      });
    } finally {
      // CRITICAL: Always set isInitializing to false
      console.log("✅ Auth initialization complete");
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
      if (!email?.trim()) {
        const errorMsg = "Email is required";
        set({ error: errorMsg });
        return { success: false, message: errorMsg };
      }

      set({ isLoading: true, error: null });
      console.log("📧 Requesting password reset for:", email);

      const result = await AuthApiService.forgotPassword(email);
      set({ isLoading: false });

      if (result.success) {
        console.log("✅ Password reset email sent");
      } else {
        console.log("❌ Password reset failed:", result.message);
        set({ error: result.message });
      }

      return result;
    } catch (error) {
      console.error("❌ Forgot password error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send reset email";
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      // Input validation
      if (!email?.trim() || !otp?.trim()) {
        const errorMsg = "Email and OTP are required";
        set({ error: errorMsg });
        return { success: false, message: errorMsg };
      }

      set({ isLoading: true, error: null });
      console.log("🔐 Verifying OTP for:", email);

      const result = await AuthApiService.verifyOTP(email, otp);
      set({ isLoading: false });

      if (result.success) {
        console.log("✅ OTP verified successfully");
      } else {
        console.log("❌ OTP verification failed:", result.message);
        set({ error: result.message });
      }

      return result;
    } catch (error) {
      console.error("❌ OTP verification error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "OTP verification failed";
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
        const errorMsg = "All fields are required for password reset";
        set({ error: errorMsg });
        return { success: false, message: errorMsg };
      }

      set({ isLoading: true, error: null });
      console.log("🔑 Resetting password for:", email);

      const result = await AuthApiService.resetPassword(
        email,
        resetToken,
        newPassword
      );
      set({ isLoading: false });

      if (result.success) {
        console.log("✅ Password reset successful");
      } else {
        console.log("❌ Password reset failed:", result.message);
        set({ error: result.message });
      }

      return result;
    } catch (error) {
      console.error("❌ Password reset error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Password reset failed";
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  resendOTP: async (email: string) => {
    try {
      // Input validation
      if (!email?.trim()) {
        const errorMsg = "Email is required to resend OTP";
        set({ error: errorMsg });
        return { success: false, message: errorMsg };
      }

      set({ isLoading: true, error: null });
      console.log("📧 Resending OTP for:", email);

      const result = await AuthApiService.resendOTP(email);
      set({ isLoading: false });

      if (result.success) {
        console.log("✅ OTP resent successfully");
      } else {
        console.log("❌ OTP resend failed:", result.message);
        set({ error: result.message });
      }

      return result;
    } catch (error) {
      console.error("❌ Resend OTP error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend OTP";
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // OAuth operations - Enhanced with better error handling
  startOAuth: (provider: string) => {
    try {
      if (!provider?.trim()) {
        set({ error: "OAuth provider is required" });
        return;
      }

      console.log(`🔗 Starting OAuth flow for ${provider}...`);
      set({ oauthInProgress: true, error: null });
      AuthApiService.startOAuth(provider);
    } catch (error) {
      console.error("❌ OAuth start error:", error);
      set({
        oauthInProgress: false,
        error: "Failed to start OAuth flow",
      });
    }
  },

  handleOAuthCallback: async () => {
    console.log("🔗 Handling OAuth callback...");

    try {
      set({
        isLoading: true,
        oauthInProgress: true,
        error: null,
        isInitializing: false,
      });

      // Wait for cookies to be properly set (increased from 1500ms based on potential timeout issues)
      console.log("⏳ Waiting for OAuth cookies to be set...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Attempt to get current user to verify OAuth success
      console.log("🔍 Verifying OAuth authentication...");
      const result = await get().getCurrentUser();

      if (result.success && result.user) {
        console.log(
          "✅ OAuth authentication successful:",
          result.user.userName
        );
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
        console.error("❌ OAuth verification failed:", result.message);
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
      const errorMessage =
        error instanceof Error ? error.message : "OAuth authentication error";
      console.error("❌ OAuth callback error:", error);

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
