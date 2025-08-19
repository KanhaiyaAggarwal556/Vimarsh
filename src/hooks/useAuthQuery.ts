// hooks/useAuthQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore, { User } from '@store/useAuthStore';
import { useCallback, useEffect } from 'react';

// Query keys for consistent cache management
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
} as const;

// Custom hook for authentication queries
export const useAuthQuery = () => {
  const queryClient = useQueryClient();
  const { 
    currentUser, 
    isAuthenticated,
    getCurrentUser,
    login,
    logout,
    setCurrentUser,
    removeAllUser,
    isInitializing,
    setInitializing
  } = useAuthStore();

  // Query for current user with automatic retries and caching
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User | null> => {
      console.log('TanStack Query: Fetching current user...');
      const result = await getCurrentUser();
      
      if (result.success && result.user) {
        return result.user;
      }
      
      // If user is not authenticated, return null instead of throwing
      if (result.message === "Not authenticated") {
        return null;
      }
      
      // For other errors, throw to trigger error state
      throw new Error(result.message || 'Failed to fetch user');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof Error && error.message === "Not authenticated") {
        return false;
      }
      // Retry network errors up to 3 times
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: true, // Always enabled for persistent checking
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  // Sync TanStack Query state with Zustand store
  useEffect(() => {
    if (user && !isUserLoading && !isUserError) {
      // Update Zustand store with query data
      if (!currentUser || currentUser._id !== user._id) {
        console.log('TanStack Query: Syncing user data to store');
        setCurrentUser(user);
      }
    } else if (!user && !isUserLoading && !isUserError) {
      // Clear user if query returns null (not authenticated)
      if (currentUser) {
        console.log('TanStack Query: Clearing user data from store');
        removeAllUser();
      }
    }
  }, [user, isUserLoading, isUserError, currentUser, setCurrentUser, removeAllUser]);

  // Update initialization state
  useEffect(() => {
    if (isInitializing && !isUserLoading) {
      console.log('TanStack Query: Authentication initialization completed');
      setInitializing(false);
    }
  }, [isInitializing, isUserLoading, setInitializing]);

  // Login mutation with automatic cache updates
  const loginMutation = useMutation({
    mutationFn: async ({ emailOrUsername, password }: { emailOrUsername: string; password: string }) => {
      const result = await login(emailOrUsername, password);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      console.log('TanStack Query: Login successful, updating cache');
      // Update the user query cache
      if (data.user) {
        queryClient.setQueryData(authKeys.user(), data.user);
      }
      // Invalidate and refetch to ensure fresh data
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      console.error('TanStack Query: Login failed:', error);
      // Clear any cached user data on login failure
      queryClient.setQueryData(authKeys.user(), null);
    },
  });

  // Logout mutation with cache clearing
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const result = await logout();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      console.log('TanStack Query: Logout successful, clearing cache');
      // Clear all auth-related cache
      queryClient.clear();
      // Set user query to null immediately
      queryClient.setQueryData(authKeys.user(), null);
    },
    onError: (error) => {
      console.error('TanStack Query: Logout failed:', error);
      // Still clear cache even on logout API failure
      queryClient.clear();
      queryClient.setQueryData(authKeys.user(), null);
    },
  });

  // Initialize authentication on mount
  const initializeAuth = useCallback(async () => {
    if (isInitializing) {
      console.log('TanStack Query: Initializing authentication...');
      // Trigger user query which will handle the authentication check
      await refetchUser();
    }
  }, [isInitializing, refetchUser]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Return consolidated auth state and methods
  return {
    // State
    user: user || currentUser, // Prioritize query data, fallback to store
    isLoading: isUserLoading || isInitializing,
    isAuthenticated: !!user || isAuthenticated,
    isError: isUserError,
    error: userError,
    isInitializing,
    
    // Methods
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    refetchUser,
    
    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };
};

// Hook for protected routes
export const useRequireAuth = () => {
  const { user, isLoading, isAuthenticated } = useAuthQuery();
  
  return {
    user,
    isLoading,
    isAuthenticated,
    requiresAuth: !isLoading && !isAuthenticated,
  };
};

// Hook for authentication status with automatic refresh
export const useAuthStatus = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading } = useAuthQuery();
  
  // Function to manually refresh authentication
  const refreshAuth = useCallback(async () => {
    console.log('Manually refreshing authentication...');
    await queryClient.invalidateQueries({ queryKey: authKeys.user() });
  }, [queryClient]);
  
  // Function to check if user session is still valid
  const validateSession = useCallback(async () => {
    const result = await queryClient.refetchQueries({ queryKey: authKeys.user() });
    return result.some(query => query.data !== null);
  }, [queryClient]);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    refreshAuth,
    validateSession,
  };
};

// Context for automatic auth refresh
export const useAuthRefresh = () => {
  const queryClient = useQueryClient();
  const { refreshToken } = useAuthStore();
  
  // Automatic token refresh when API returns 401
  const handleUnauthorized = useCallback(async () => {
    console.log('TanStack Query: Handling unauthorized response');
    
    try {
      const result = await refreshToken();
      
      if (result.success) {
        console.log('TanStack Query: Token refreshed, invalidating queries');
        // Refresh all auth queries after successful token refresh
        await queryClient.invalidateQueries({ queryKey: authKeys.all });
        return true;
      } else {
        console.log('TanStack Query: Token refresh failed, clearing auth');
        // Clear auth state if refresh fails
        queryClient.setQueryData(authKeys.user(), null);
        return false;
      }
    } catch (error) {
      console.error('TanStack Query: Token refresh error:', error);
      queryClient.setQueryData(authKeys.user(), null);
      return false;
    }
  }, [refreshToken, queryClient]);
  
  return { handleUnauthorized };
};