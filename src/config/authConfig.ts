// config/authConfig.ts - Authentication configuration and constants
export const AUTH_CONFIG = {
  // Cache settings (should match backend token expiry)
  CACHE_DURATION: 15 * 60 * 1000, // 15 minutes (matches backend access token expiry)
  
  // Session settings (should match backend inactivity period)
  MAX_INACTIVITY_DAYS: 10, // 10 days (matches backend)
  ACTIVITY_UPDATE_THRESHOLD: 30 * 60 * 1000, // 30 minutes
  
  // Retry settings
  MAX_RETRIES: 2,
  RETRY_DELAY: 2000, // 2 seconds
  
  // API settings
  API_TIMEOUT: 10000, // 10 seconds
  
  // Storage settings
  STORAGE_KEY: 'auth-storage',
  STORAGE_VERSION: 8,
  
  // OAuth settings
  OAUTH_SUCCESS_PATH: '/oauth-success',
  OAUTH_FAILURE_REDIRECT: '/login',
  
  // Debug mode (enable in development)
  DEBUG: import.meta.env.DEV || false,
} as const;

// Authentication event types for monitoring
export enum AuthEventType {
  LOGIN_ATTEMPT = 'login_attempt',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  LOGOUT = 'logout',
  TOKEN_REFRESH = 'token_refresh',
  SESSION_EXPIRED = 'session_expired',
  OAUTH_START = 'oauth_start',
  OAUTH_SUCCESS = 'oauth_success',
  OAUTH_FAILURE = 'oauth_failure',
  INIT_START = 'init_start',
  INIT_COMPLETE = 'init_complete',
  CACHE_HIT = 'cache_hit',
  CACHE_MISS = 'cache_miss',
}

// Auth event logger for debugging and monitoring
export class AuthLogger {
  private static logs: Array<{ timestamp: Date; event: AuthEventType; data?: any }> = [];

  static log(event: AuthEventType, data?: any) {
    const logEntry = {
      timestamp: new Date(),
      event,
      data,
    };

    this.logs.push(logEntry);
    
    // Keep only last 100 logs to prevent memory issues
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    // Console log in development
    if (AUTH_CONFIG.DEBUG) {
      console.log(`🔐 [${event}]`, data || '');
    }
  }

  static getLogs() {
    return [...this.logs];
  }

  static clearLogs() {
    this.logs = [];
  }

  static getLogsSummary() {
    const summary: Record<string, number> = {};
    
    this.logs.forEach(log => {
      summary[log.event] = (summary[log.event] || 0) + 1;
    });
    
    return summary;
  }
}

// Utility functions for auth validation
export const AuthValidation = {
  isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  isValidUsername(username: string): boolean {
    if (!username || typeof username !== 'string') return false;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username.trim());
  },

  isValidPassword(password: string): { isValid: boolean; message?: string } {
    if (!password || typeof password !== 'string') {
      return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (password.length > 128) {
      return { isValid: false, message: 'Password must be less than 128 characters' };
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;
    
    if (strength < 3) {
      return { 
        isValid: false, 
        message: 'Password must contain at least 3 of: uppercase, lowercase, number, special character' 
      };
    }
    
    return { isValid: true };
  },

  isSessionExpired(lastActivity: number | string | null): boolean {
    if (!lastActivity) return true;
    
    const lastActivityTime = typeof lastActivity === 'string' 
      ? new Date(lastActivity).getTime() 
      : lastActivity;
    
    if (isNaN(lastActivityTime)) return true;
    
    const maxAge = AUTH_CONFIG.MAX_INACTIVITY_DAYS * 24 * 60 * 60 * 1000;
    return Date.now() - lastActivityTime > maxAge;
  },

  shouldUpdateActivity(lastActivity: number | string | null): boolean {
    if (!lastActivity) return true;
    
    const lastActivityTime = typeof lastActivity === 'string' 
      ? new Date(lastActivity).getTime() 
      : lastActivity;
    
    if (isNaN(lastActivityTime)) return true;
    
    return Date.now() - lastActivityTime > AUTH_CONFIG.ACTIVITY_UPDATE_THRESHOLD;
  },
};

// Error types for better error handling
export enum AuthErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AuthError {
  type: AuthErrorType;
  message: string;
  status?: number;
  code?: string;
  retryable?: boolean;
}

export const createAuthError = (
  type: AuthErrorType,
  message: string,
  status?: number,
  code?: string
): AuthError => ({
  type,
  message,
  status,
  code,
  retryable: type === AuthErrorType.NETWORK_ERROR || type === AuthErrorType.SERVER_ERROR,
});

// Environment configuration
export const ENV_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  CLIENT_URL: import.meta.env.VITE_CLIENT_URL || 'http://localhost:3000',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  IS_PRODUCTION: import.meta.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: import.meta.env.NODE_ENV === 'development',
};

export default AUTH_CONFIG;