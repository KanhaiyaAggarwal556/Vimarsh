// utils/authUtils.ts
import { User } from '@store/useAuthStore';

// Types for authentication utilities
export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Error codes that should trigger logout
export const LOGOUT_ERROR_CODES = [
  'TOKEN_EXPIRED',
  'INVALID_TOKEN',
  'USER_NOT_FOUND',
  'SESSION_EXPIRED',
];

// Error codes that should trigger retry
export const RETRY_ERROR_CODES = [
  'NETWORK_ERROR',
  'SERVER_ERROR',
  'TIMEOUT',
];

// Utility functions for authentication
export const authUtils = {
  /**
   * Sanitize user data for frontend use
   */
  sanitizeUser: (user: any): User | null => {
    if (!user || typeof user !== 'object') {
      return null;
    }

    return {
      _id: user._id || user.id || '',
      fullName: user.fullName || user.name || '',
      userName: user.userName || user.username || '',
      email: user.email || '',
      profilepic: user.profilepic || user.avatar || user.profilePicture || '',
      isAdmin: Boolean(user.isAdmin || user.admin),
      lastLogin: user.lastLogin || user.lastLoginAt || '',
      createdAt: user.createdAt || user.created_at || '',
      updatedAt: user.updatedAt || user.updated_at || '',
    };
  },

  /**
   * Format authentication errors for user display
   */
  formatAuthError: (error: any): string => {
    if (!error) return 'An unknown error occurred';
    
    if (typeof error === 'string') return error;
    
    if (error.response?.data?.message) return error.response.data.message;
    if (error.message) return error.message;
    if (error.error) return error.error;
    
    // Default error messages based on status codes
    if (error.status === 401) return 'Invalid credentials or session expired';
    if (error.status === 403) return 'Access denied';
    if (error.status === 404) return 'User not found';
    if (error.status === 409) return 'User already exists';
    if (error.status === 429) return 'Too many requests. Please try again later';
    if (error.status >= 500) return 'Server error. Please try again later';
    
    return 'An unexpected error occurred';
  },

  /**
   * Check if error should trigger automatic logout
   */
  shouldLogout: (error: any): boolean => {
    if (!error) return false;
    
    const status = error.status || error.response?.status;
    const code = error.code || error.response?.data?.code;
    const message = error.message || error.response?.data?.message || '';
    
    // Check status codes
    if (status === 401 || status === 403) return true;
    
    // Check error codes
    if (code && LOGOUT_ERROR_CODES.includes(code)) return true;
    
    // Check error messages
    const logoutMessages = [
      'session expired',
      'token expired',
      'invalid token',
      'user not found',
      'unauthorized',
      'authentication required',
    ];
    
    return logoutMessages.some(msg => 
      message.toLowerCase().includes(msg)
    );
  },

  /**
   * Check if error is retryable
   */
  isRetryable: (error: any): boolean => {
    if (!error) return false;
    
    const status = error.status || error.response?.status;
    const code = error.code || error.response?.data?.code;
    
    // Network/server errors are retryable
    if (status >= 500 && status < 600) return true;
    if (status === 429) return true; // Rate limit
    if (code && RETRY_ERROR_CODES.includes(code)) return true;
    
    // Network errors
    if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') return true;
    if (error.message?.includes('fetch')) return true;
    
    return false;
  },

  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  /**
   * Validate username format
   */
  isValidUsername: (username: string): boolean => {
    if (!username || typeof username !== 'string') return false;
    
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username.trim());
  },

  /**
   * Validate password strength
   */
  validatePassword: (password: string): { isValid: boolean; message?: string } => {
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
        message: 'Password must contain at least 3 of: uppercase letter, lowercase letter, number, special character' 
      };
    }
    
    return { isValid: true };
  },

  /**
   * Generate a secure random string
   */
  generateSecureRandom: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  },

  /**
   * Check if user session is expired based on last activity
   */
  isSessionExpired: (lastActivity: number | string | null, maxAge: number = 15 * 24 * 60 * 60 * 1000): boolean => {
    if (!lastActivity) return true;
    
    const lastActivityTime = typeof lastActivity === 'string' 
      ? new Date(lastActivity).getTime() 
      : lastActivity;
    
    if (isNaN(lastActivityTime)) return true;
    
    return Date.now() - lastActivityTime > maxAge;
  },

  /**
   * Get user display name with fallbacks
   */
  getUserDisplayName: (user: User | null): string => {
    if (!user) return 'Guest';
    
    if (user.fullName?.trim()) return user.fullName.trim();
    if (user.userName?.trim()) return `@${user.userName.trim()}`;
    if (user.email?.trim()) return user.email.split('@')[0];
    
    return 'User';
  },

  /**
   * Get user initials for avatar
   */
  getUserInitials: (user: User | null): string => {
    if (!user) return 'G';
    
    const displayName = authUtils.getUserDisplayName(user);
    
    if (displayName === 'Guest' || displayName === 'User') return displayName[0];
    
    const parts = displayName.replace('@', '').split(' ').filter(Boolean);
    
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    
    return parts[0]?.[0]?.toUpperCase() || 'U';
  },

  /**
   * Debounce function for API calls
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Retry function with exponential backoff
   */
  retry: async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxAttempts) break;
        if (!authUtils.isRetryable(error)) break;
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  },
};

export default authUtils;