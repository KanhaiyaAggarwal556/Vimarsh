// services/AuthApiService.ts

import { User, RegisterData, AuthResponse } from "../types/auth";
import { apiClient } from "./ApiClient";
import { BackendAuthResponse, BackendUserDTO } from "../types/backendAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const API_TIMEOUT = 15000;

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class AuthApiService {
  /**
   * Login user with email/username and password
   */
  static async login(emailOrUsername: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<BackendAuthResponse>("/auth/login", {
        emailOrUsername: emailOrUsername.trim(),
        password,
      });

      if (response.success) {
        const userData = response.user || response.data?.user || response.data;

        if (userData && userData._id) {
          const sanitizedUser = this.sanitizeUser(userData);
          return {
            success: true,
            user: sanitizedUser,
            message: response.message || "Login successful",
          };
        } else {
          // Fallback: try to get current user
          try {
            const currentUserResponse = await this.getCurrentUser();
            if (currentUserResponse.success && currentUserResponse.user) {
              return {
                success: true,
                user: currentUserResponse.user,
                message: response.message || "Login successful",
              };
            }
          } catch (fallbackError) {
            // Fallback failed, continue with error
          }

          return {
            success: false,
            message: "Login successful but user data not received. Please try logging in again.",
          };
        }
      } else {
        return {
          success: false,
          message: response.message || "Login failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: this.formatError(error),
      };
    }
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const requestPayload = {
        ...userData,
        email: userData.email.trim().toLowerCase(),
        userName: userData.userName.trim(),
        fullName: userData.fullName.trim(),
      };
      if (!requestPayload.email || !requestPayload.userName || !requestPayload.fullName) {
        return {
          success: false,
          message: "Email, username, and full name are required"
        };
      }
      const response = await apiClient.post<BackendAuthResponse>("/auth/register", requestPayload);

      if (response.success) {
        const userDataFromResponse = response.data?.user || response.user;

        if (userDataFromResponse && userDataFromResponse._id) {
          const sanitizedUser = this.sanitizeUser(userDataFromResponse);
          return {
            success: true,
            user: sanitizedUser,
            message: response.message || "Registration successful",
          };
        } else {
          return {
            success: true,
            message: response.message || "Registration successful. Please check your email to verify your account.",
          };
        }
      } else {
        return {
          success: false,
          message: response.message || "Registration failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: this.formatError(error),
      };
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await apiClient.get<BackendAuthResponse>("/auth/me");
      
      if (response && response.success) {
        const possibleUserLocations = [
          response.user,
          response.data?.user,
          response.data,
          response,
        ];

        const userData = possibleUserLocations.find(location => 
          location && 
          (location._id || location.id) && 
          location.email
        );

        if (userData) {
          const sanitizedUser = this.sanitizeUser(userData);
          return {
            success: true,
            user: sanitizedUser,
            message: response.message || "User fetched successfully",
          };
        } else {
          return {
            success: false,
            message: "User data not found in response",
          };
        }
      } else {
        return {
          success: false,
          message: response?.message || "Not authenticated",
        };
      }
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.status === 401) {
        return {
          success: false,
          message: "Not authenticated",
        };
      }

      return {
        success: false,
        message: this.formatError(error),
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<BackendAuthResponse>("/auth/logout");
      return {
        success: true,
        message: response.message || "Logged out successfully",
      };
    } catch (error) {
      return {
        success: true,
        message: "Logged out successfully",
      };
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<BackendAuthResponse>("/auth/refresh");

      if (response.success) {
        return {
          success: true,
          message: response.message || "Token refreshed successfully",
        };
      }

      return {
        success: false,
        message: response.message || "Token refresh failed",
      };
    } catch (error) {
      return {
        success: false,
        message: this.formatError(error),
      };
    }
  }

  /**
   * Forgot password - request OTP
   */
  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<BackendAuthResponse>("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      return {
        success: response.success,
        message: response.message || (response.success ? "Reset email sent" : "Failed to send reset email"),
      };
    } catch (error) {
      return {
        success: false,
        message: this.formatError(error),
      };
    }
  }

  /**
   * Verify OTP for password reset
   */
  static async verifyOTP(email: string, otp: string): Promise<AuthResponse & { resetToken?: string }> {
    try {
      const response = await apiClient.post<BackendAuthResponse>("/auth/verify-otp", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      if (response.success) {
        const resetToken = response.data?.resetToken || 
                          response.data?.token || 
                          response.resetToken ||
                          (response as any).token;

        return {
          success: true,
          message: response.message || "OTP verified successfully",
          resetToken: resetToken,
        };
      } else {
        return {
          success: false,
          message: response.message || "OTP verification failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: this.formatError(error),
      };
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(email: string, resetToken: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<BackendAuthResponse>("/auth/reset-password", {
        email: email.trim().toLowerCase(),
        resetToken,
        newPassword,
      });

      return {
        success: response.success,
        message: response.message || (response.success ? "Password reset successful" : "Password reset failed"),
      };
    } catch (error) {
      return {
        success: false,
        message: this.formatError(error),
      };
    }
  }

  /**
   * Resend OTP
   */
  static async resendOTP(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<BackendAuthResponse>("/auth/resend-otp", {
        email: email.trim().toLowerCase(),
      });

      return {
        success: response.success,
        message: response.message || (response.success ? "OTP resent" : "Failed to resend OTP"),
      };
    } catch (error) {
      return {
        success: false,
        message: this.formatError(error),
      };
    }
  }

  /**
   * Start OAuth flow
   */
  static startOAuth(provider: string): void {
    try {
      if (!provider) {
        throw new Error("OAuth provider is required");
      }

      const oauthUrl = `${API_BASE_URL}/auth/${provider.toLowerCase()}`;
      const currentLocation = window.location.href;
      
      sessionStorage.setItem('oauth_return_url', currentLocation);
      
      const callbackUrl = `${window.location.origin}/auth/callback`;
      const fullOauthUrl = `${oauthUrl}?callback=${encodeURIComponent(callbackUrl)}`;
      
      window.location.href = fullOauthUrl;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle OAuth callback
   */
  static async handleOAuthCallback(): Promise<AuthResponse> {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      
      if (error) {
        const errorDescription = urlParams.get('error_description') || 'OAuth authentication failed';
        return {
          success: false,
          message: errorDescription
        };
      }

      const userResponse = await this.getCurrentUser();
      
      if (userResponse.success && userResponse.user) {
        const returnUrl = sessionStorage.getItem('oauth_return_url');
        if (returnUrl) {
          try {
            const url = new URL(returnUrl);
            if (url.origin === window.location.origin) {
              sessionStorage.removeItem('oauth_return_url');
              setTimeout(() => {
                window.location.href = returnUrl;
              }, 1000);
            }
          } catch {
            console.log("Invalid return URL, skipping redirect");
          }
        }
        
        return userResponse;
      } else {
        return {
          success: false,
          message: userResponse.message || "OAuth authentication failed. Please try again."
        };
      }
    } catch (error) {
      return {
        success: false,
        message: this.formatError(error)
      };
    }
  }

  /**
   * Test backend connectivity
   */
  static async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: "Backend connection successful",
          details: data
        };
      } else {
        return {
          success: false,
          message: `Backend responded with ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Cannot connect to backend: ${this.formatError(error)}`
      };
    }
  }

  /**
   * Debug: List all available methods in AuthApiService
   */
  static listAvailableMethods(): string[] {
    const methods = Object.getOwnPropertyNames(AuthApiService)
      .filter(prop => {
        const descriptor = Object.getOwnPropertyDescriptor(AuthApiService, prop);
        return descriptor && typeof descriptor.value === 'function';
      })
      .filter(prop => prop !== 'length' && prop !== 'name' && prop !== 'prototype');
    
    return methods;
  }

  /**
   * Sanitize user data to ensure consistent structure
   */
  private static sanitizeUser(user: BackendUserDTO): User {
    if (!user) {
      throw new Error("User data is required for sanitization");
    }

    const sanitized = {
      _id: user._id || user.id || "",
      fullName: user.fullName || user.name || user.full_name || "",
      userName: user.userName || user.username || user.user_name || "",
      email: user.email || "",
      profilepic: user.profilepic || user.avatar || user.profilePicture || user.profile_picture || "",
      isAdmin: Boolean(user.isAdmin || user.admin || user.is_admin),
      lastLogin: user.lastLogin || user.lastLoginAt || user.last_login_at || "",
      createdAt: user.createdAt || user.created_at || "",
      updatedAt: user.updatedAt || user.updated_at || "",
    };

    if (!sanitized._id || !sanitized.email || !sanitized.userName) {
      throw new Error("User data is missing required fields");
    }

    return sanitized;
  }

  /**
   * Format error messages for user display
   */
  private static formatError(error: unknown): string {
    if (!error) return "An unknown error occurred";
    
    if (typeof error === "string") return error;

    // Type guard for Error objects
    if (error instanceof Error) {
      // Check if it's a network/fetch error
      if (error instanceof TypeError || error.message?.includes("fetch")) {
        return "Network error. Please check your connection";
      }
      return error.message;
    }

    // Type guard for ApiError-like objects
    if (typeof error === "object" && error !== null) {
      const apiError = error as Record<string, any>;
      
      if (typeof apiError.message === "string") {
        return apiError.message;
      }

      // Status code specific messages
      if (typeof apiError.status === "number") {
        const statusMessages: { [key: number]: string } = {
          400: "Invalid request data",
          401: "Authentication required",
          403: "Access denied",
          404: "Resource not found",
          409: "Resource already exists",
          429: "Too many requests. Please try again later",
          500: "Server error. Please try again later",
          503: "Service temporarily unavailable"
        };

        if (statusMessages[apiError.status]) {
          return statusMessages[apiError.status];
        }
      }
    }

    return "An unexpected error occurred";
  }
}

export default AuthApiService;