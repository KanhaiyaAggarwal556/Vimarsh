// services/authApi.ts
import { User, RegisterData, AuthResponse } from "../types/auth";
import { apiClient } from "./ApiClient";
import { BackendAuthResponse, BackendUserDTO } from "../types/backendAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function formatError(error: unknown): string {
  if (!error) return "An unknown error occurred";
  if (typeof error === "string") return error;

  if (error instanceof Error) {
    if (error instanceof TypeError || error.message?.includes("fetch")) {
      return "Network error. Please check your connection";
    }
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const apiError = error as Record<string, any>;
    if (typeof apiError.message === "string") return apiError.message;
    if (typeof apiError.status === "number") {
      const statusMessages: { [key: number]: string } = {
        400: "Invalid request data",
        401: "Authentication required",
        403: "Access denied",
        404: "Resource not found",
        409: "Resource already exists",
        429: "Too many requests. Please try again later",
        500: "Server error. Please try again later",
        503: "Service temporarily unavailable",
      };
      if (statusMessages[apiError.status]) return statusMessages[apiError.status];
    }
  }

  return "An unexpected error occurred";
}

function sanitizeUser(user: BackendUserDTO): User {
  if (!user) throw new Error("User data is required for sanitization");

  const sanitized: User = {
    _id: user._id || user.id || "",
    fullName: user.fullName || user.name || user.full_name || "",
    userName: user.userName || user.username || user.user_name || "",
    email: user.email || "",
    profilepic: user.profilepic || user.avatar || user.profilePicture || user.profile_picture || "",
    isAdmin: Boolean(user.isAdmin || user.admin || user.is_admin),
    lastLogin: user.lastLogin || user.lastLoginAt || user.last_login_at || "",
    createdAt: user.createdAt || user.created_at || "",
    updatedAt: user.updatedAt || user.updated_at || "",
  } as User;

  if (!sanitized._id || !sanitized.email || !sanitized.userName) {
    throw new Error("User data is missing required fields");
  }

  return sanitized;
}

export async function login(emailOrUsername: string, password: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<BackendAuthResponse>("/auth/login", {
      emailOrUsername: emailOrUsername.trim(),
      password,
    });

    if (response.success) {
      const userData = response.user || response.data?.user || response.data;
      if (userData && (userData._id || userData.id)) {
        const sanitizedUser = sanitizeUser(userData);
        return { success: true, user: sanitizedUser, message: response.message || "Login successful" };
      }

      try {
        const currentUserResponse = await getCurrentUser();
        if (currentUserResponse.success && currentUserResponse.user) {
          return { success: true, user: currentUserResponse.user, message: response.message || "Login successful" };
        }
      } catch {
        // fallback failed
      }

      return { success: false, message: "Login successful but user data not received. Please try logging in again." };
    }

    return { success: false, message: response.message || "Login failed" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function register(userData: RegisterData): Promise<AuthResponse> {
  try {
    const requestPayload = {
      ...userData,
      email: userData.email.trim().toLowerCase(),
      userName: userData.userName.trim(),
      fullName: userData.fullName.trim(),
    };

    if (!requestPayload.email || !requestPayload.userName || !requestPayload.fullName) {
      return { success: false, message: "Email, username, and full name are required" };
    }

    const response = await apiClient.post<BackendAuthResponse>("/auth/register", requestPayload);

    if (response.success) {
      const user = response.data?.user || response.user;
      if (user && (user._id || user.id)) {
        const sanitizedUser = sanitizeUser(user);
        return { success: true, user: sanitizedUser, message: response.message || "Registration successful" };
      }

      return { success: true, message: response.message || "Registration successful. Please check your email to verify your account." };
    }

    return { success: false, message: response.message || "Registration failed" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    const response = await apiClient.get<BackendAuthResponse>("/auth/me");

    if (response && response.success) {
      const possibleUserLocations = [response.user, response.data?.user, response.data, response];
      const userData = possibleUserLocations.find((location) => location && (location._id || location.id) && location.email);

      if (userData) {
        const sanitizedUser = sanitizeUser(userData);
        return { success: true, user: sanitizedUser, message: response.message || "User fetched successfully" };
      }

      return { success: false, message: "User data not found in response" };
    }

    return { success: false, message: response?.message || "Not authenticated" };
  } catch (error) {
    const apiError = error as { status?: number };
    if (apiError?.status === 401) return { success: false, message: "Not authenticated" };
    return { success: false, message: formatError(error) };
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<BackendAuthResponse>("/auth/logout");
    return { success: true, message: response.message || "Logged out successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function refreshToken(): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<BackendAuthResponse>("/auth/refresh");
    if (response.success) return { success: true, message: response.message || "Token refreshed successfully" };
    return { success: false, message: response.message || "Token refresh failed" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function forgotPassword(email: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<BackendAuthResponse>("/auth/forgot-password", { email: email.trim().toLowerCase() });
    return { success: response.success, message: response.message || (response.success ? "Reset email sent" : "Failed to send reset email") };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function verifyOTP(email: string, otp: string): Promise<AuthResponse & { resetToken?: string }> {
  try {
    const response = await apiClient.post<BackendAuthResponse>("/auth/verify-otp", { email: email.trim().toLowerCase(), otp: otp.trim() });
    if (response.success) {
      const resetToken = response.data?.resetToken || response.data?.token || response.resetToken || (response as any).token;
      return { success: true, message: response.message || "OTP verified successfully", resetToken };
    }
    return { success: false, message: response.message || "OTP verification failed" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function resetPassword(email: string, resetToken: string, newPassword: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<BackendAuthResponse>("/auth/reset-password", { email: email.trim().toLowerCase(), resetToken, newPassword });
    return { success: response.success, message: response.message || (response.success ? "Password reset successful" : "Password reset failed") };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function resendOTP(email: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<BackendAuthResponse>("/auth/resend-otp", { email: email.trim().toLowerCase() });
    return { success: response.success, message: response.message || (response.success ? "OTP resent" : "Failed to resend OTP") };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export function startOAuth(provider: string): void {
  if (!provider) throw new Error("OAuth provider is required");
  const oauthUrl = `${API_BASE_URL}/auth/${provider.toLowerCase()}`;
  const currentLocation = window.location.href;
  sessionStorage.setItem("oauth_return_url", currentLocation);
  const callbackUrl = `${window.location.origin}/auth/callback`;
  const fullOauthUrl = `${oauthUrl}?callback=${encodeURIComponent(callbackUrl)}`;
  window.location.href = fullOauthUrl;
}

export async function handleOAuthCallback(): Promise<AuthResponse> {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) return { success: false, message: urlParams.get("error_description") || "OAuth authentication failed" };

    const userResponse = await getCurrentUser();
    if (userResponse.success && userResponse.user) {
      const returnUrl = sessionStorage.getItem("oauth_return_url");
      if (returnUrl) {
        try {
          const url = new URL(returnUrl);
          if (url.origin === window.location.origin) {
            sessionStorage.removeItem("oauth_return_url");
            setTimeout(() => (window.location.href = returnUrl), 1000);
          }
        } catch {
          console.log("Invalid return URL, skipping redirect");
        }
      }
      return userResponse;
    }

    return { success: false, message: userResponse.message || "OAuth authentication failed. Please try again." };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const response = await apiClient.get<any>("/health");
    return { success: true, message: "Backend connection successful", details: response };
  } catch (error) {
    return { success: false, message: `Cannot connect to backend: ${formatError(error)}` };
  }
}

