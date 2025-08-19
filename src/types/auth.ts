// types/auth.ts - Enhanced types for 10-day persistent login system
export interface User {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  profilepic: string;
  isAdmin: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  fullName: string;
  userName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
  token?: string;
  refreshToken?: string;
}

export interface AuthState {
  // User data
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Loading states
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  oauthInProgress: boolean;
  
  // Session management for persistent login
  lastAuthCheck: number | null;
  lastActivity: number | null;
  sessionExpiry: number | null;
}

// types/auth.ts - Updated AuthActions interface to match AuthApiService implementation

export interface AuthActions {
  // State setters
  setCurrentUser: (user: User | null) => void;
  removeAllUser: () => void;
  updateCurrentUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setInitializing: (initializing: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setOAuthInProgress: (inProgress: boolean) => void;

  // Auth operations - Updated to match AuthApiService static methods
  login: (emailOrUsername: string, password: string) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
  getCurrentUser: () => Promise<AuthResponse>;
  refreshToken: () => Promise<AuthResponse>;
  initializeAuth: () => Promise<void>;
  
  // Password reset operations - Updated to match AuthApiService implementation
  forgotPassword: (email: string) => Promise<AuthResponse>;
  verifyOTP: (email: string, otp: string) => Promise<AuthResponse>;
  resetPassword: (email: string, resetToken: string, newPassword: string) => Promise<AuthResponse>;
  resendOTP: (email: string) => Promise<AuthResponse>;
  
  // OAuth operations - Updated to match AuthApiService
  startOAuth: (provider: string) => void; // This matches AuthApiService.startOAuth
  handleOAuthCallback: () => Promise<AuthResponse>; // This method is not in AuthApiService - needs implementation
  
  // Session management for persistent login
  updateActivity: () => void;
  isSessionValid: () => boolean;
  extendSession: () => void;
  clearSession: () => void;
  
  // Additional methods that might be needed based on AuthApiService capabilities
  sanitizeUser?: (user: any) => User; // Make this available if needed in store
  formatError?: (error: any) => string; // Make this available if needed in store
}

export interface AuthStore extends AuthState, AuthActions {}

// Session configuration interface
export interface SessionConfig {
  AUTH_CACHE_DURATION: number;
  SESSION_VALIDITY: number;
  ACTIVITY_UPDATE_THRESHOLD: number;
  REFRESH_THRESHOLD: number;
}

// Enhanced auth context type for providers
export interface AuthContextType extends AuthStore {
  // Additional helper methods for components
  getRemainingSessionTime: () => number;
  getSessionExpiryDate: () => Date | null;
  getDaysUntilExpiry: () => number;
  getHoursUntilExpiry: () => number;
  isSessionExpiringSoon: (threshold?: number) => boolean;
}

// OAuth provider types
export type OAuthProvider = 'google' | 'facebook' | 'linkedin';

export interface OAuthConfig {
  provider: OAuthProvider;
  clientId: string;
  redirectUri: string;
  scope: string[];
}

// Error types for better error handling
export interface AuthError {
  code: string;
  message: string;
  status?: number;
  timestamp: number;
  details?: any;
}

export type AuthErrorCode = 
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_FAILED'
  | 'SESSION_EXPIRED'
  | 'TOKEN_INVALID'
  | 'USER_NOT_FOUND'
  | 'OAUTH_ERROR'
  | 'RATE_LIMITED'
  | 'UNKNOWN_ERROR';

// Activity tracking types
export interface ActivityData {
  timestamp: number;
  type: 'page_view' | 'user_action' | 'api_call' | 'background';
  details?: string;
}

// Session info for display components
export interface SessionInfo {
  isActive: boolean;
  expiresAt: Date;
  lastActivity: Date;
  remainingTime: number;
  remainingDays: number;
  isExpiringSoon: boolean;
  canExtend: boolean;
}

// Local storage keys for consistency
export const AUTH_STORAGE_KEYS = {
  USER_DATA: 'auth-user-data',
  SESSION_INFO: 'auth-session-info',
  PREFERENCES: 'auth-preferences',
  ACTIVITY_LOG: 'auth-activity-log'
} as const;

// Auth events for event-driven architecture
export type AuthEvent = 
  | 'AUTH_INITIALIZED'
  | 'USER_LOGGED_IN'
  | 'USER_LOGGED_OUT'
  | 'SESSION_EXTENDED'
  | 'SESSION_EXPIRED'
  | 'ACTIVITY_DETECTED'
  | 'TOKEN_REFRESHED'
  | 'OAUTH_STARTED'
  | 'OAUTH_COMPLETED'
  | 'ERROR_OCCURRED';

export interface AuthEventData {
  type: AuthEvent;
  timestamp: number;
  user?: User;
  error?: AuthError;
  metadata?: Record<string, any>;
}

// Component prop types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  config?: Partial<SessionConfig>;
  onAuthEvent?: (event: AuthEventData) => void;
}

// API response wrapper types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => ValidationResult;
}

export interface FormValidation {
  [fieldName: string]: FieldValidation;
}

// Theme and styling types for auth components
export interface AuthTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      bold: number;
    };
  };
  borderRadius: {
    sm: string;
    base: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    base: string;
    lg: string;
  };
}

// Export utility type for component refs
export type AuthComponentRef = React.RefObject<HTMLDivElement>;

// Re-export commonly used React types
export type { ReactNode, FC, ComponentProps } from 'react';