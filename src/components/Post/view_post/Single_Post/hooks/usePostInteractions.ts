// hooks/usePostInteractions.ts
import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { postInteractionAPI } from '../services/postInteractionApi';
import { toast } from 'react-hot-toast';
import type { PostInteraction, PostInteractionResponse, BatchInteractionResponse } from '../types/postInteraction';
import useAuthStore from '@store/useAuthStore';

// Query Keys - Include userId for user-specific caching
export const postInteractionKeys = {
  all: ['postInteractions'] as const,
  user: (userId?: string) => [...postInteractionKeys.all, 'user', userId] as const,
  interaction: (postId: string, userId?: string) => [...postInteractionKeys.user(userId), 'interaction', postId] as const,
  batch: (postIds: string[], userId?: string) => [...postInteractionKeys.user(userId), 'batch', postIds?.sort?.()] as const,
};

// Type for usePostInteraction options
type UsePostInteractionOptions = Omit<UseQueryOptions<PostInteractionResponse, Error, PostInteraction>, 'queryKey' | 'queryFn'>;

// Hook to get user's interaction status with a post
export const usePostInteraction = (postId: string, options: UsePostInteractionOptions = {}) => {
  const { currentUser } = useAuthStore();
  const userId = currentUser?._id; // Fixed: Only use _id

  return useQuery({
    queryKey: postInteractionKeys.interaction(postId, userId),
    queryFn: () => postInteractionAPI.getUserInteraction(postId),
    select: (data: PostInteractionResponse) => data?.data || data,
    staleTime: 30 * 1000, // 30 seconds - reduced for better real-time updates
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(postId && currentUser) && options.enabled !== false,
    retry: (failureCount: number, error: Error) => {
      // Don't retry on auth errors
      if (error?.message?.includes('Authentication') || error?.message?.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
    refetchOnMount: true, // Always refetch on mount
    ...options,
  });
};

// Type for batch interactions options
type UseBatchPostInteractionsOptions = Omit<UseQueryOptions<BatchInteractionResponse, Error, BatchInteractionResponse>, 'queryKey' | 'queryFn'>;

// Hook to get batch interactions for multiple posts
export const useBatchPostInteractions = (postIds: string[], options: UseBatchPostInteractionsOptions = {}) => {
  const { currentUser } = useAuthStore();
  const userId = currentUser?._id; // Fixed: Only use _id

  return useQuery({
    queryKey: postInteractionKeys.batch(postIds, userId),
    queryFn: () => postInteractionAPI.getBatchInteractions(postIds),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: Array.isArray(postIds) && postIds.length > 0 && Boolean(currentUser),
    retry: 1,
    ...options,
  });
};

// Context type for mutation operations
interface MutationContext {
  previousInteraction?: PostInteraction;
  postId: string;
  userId?: string;
}

// Hook to toggle like
export const useToggleLike = (options?: UseMutationOptions<PostInteractionResponse, Error, string, MutationContext>) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const userId = currentUser?._id; // Fixed: Only use _id

  return useMutation({
    mutationFn: (postId: string) => postInteractionAPI.toggleLike(postId),
    onMutate: async (postId: string): Promise<MutationContext> => {
      if (!postId || !currentUser) {
        throw new Error('Post ID and authentication are required');
      }

      const queryKey = postInteractionKeys.interaction(postId, userId);

      // Cancel any outgoing refetches for this specific post
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousInteraction = queryClient.getQueryData<PostInteraction>(queryKey);

      // Optimistically update the cache with simplified logic
      queryClient.setQueryData<PostInteraction>(queryKey, (old) => {
        // If no previous data, create default state
        if (!old) {
          return {
            liked: true,
            disliked: false,
            saved: false,
            viewed: false,
          };
        }
        
        // Simple toggle logic
        return {
          ...old,
          liked: !old.liked,
          // If user was disliking and now likes, remove dislike
          disliked: old.liked ? old.disliked : false,
        };
      });

      return { previousInteraction, postId, userId };
    },
    onError: (err: Error, postId: string, context?: MutationContext) => {
      // Rollback on error
      if (context?.previousInteraction && context?.userId) {
        queryClient.setQueryData(
          postInteractionKeys.interaction(postId, context.userId),
          context.previousInteraction
        );
      }
      
      // Show user-friendly error message
      console.error('Like toggle failed:', err);
      toast.error('Failed to update like. Please try again.');
    },
    onSuccess: (data: PostInteractionResponse, postId: string) => {
      // Update cache with server response to ensure consistency
      if (data?.data && userId) {
        queryClient.setQueryData<PostInteraction>(
          postInteractionKeys.interaction(postId, userId),
          data.data
        );
      }

      // Force refresh of all post-related data to sync counts
      queryClient.invalidateQueries({
        queryKey: ['posts']
      });

      // Invalidate batch queries that include this post for current user
      queryClient.invalidateQueries({
        queryKey: postInteractionKeys.user(userId),
        predicate: (query) => {
          if (query.queryKey.includes('batch')) {
            const batchPostIds = query.queryKey.find(key => Array.isArray(key)) as string[];
            return batchPostIds?.includes(postId);
          }
          return false;
        }
      });
    },
    onSettled: () => {
      // No need to invalidate here since onSuccess handles it
    },
    ...options,
  });
};

// Hook to toggle dislike
export const useToggleDislike = (options?: UseMutationOptions<PostInteractionResponse, Error, string, MutationContext>) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const userId = currentUser?._id; // Fixed: Only use _id

  return useMutation({
    mutationFn: (postId: string) => postInteractionAPI.toggleDislike(postId),
    onMutate: async (postId: string): Promise<MutationContext> => {
      if (!postId || !currentUser) {
        throw new Error('Post ID and authentication are required');
      }

      const queryKey = postInteractionKeys.interaction(postId, userId);

      await queryClient.cancelQueries({ queryKey });

      const previousInteraction = queryClient.getQueryData<PostInteraction>(queryKey);

      queryClient.setQueryData<PostInteraction>(queryKey, (old) => {
        // If no previous data, create default state
        if (!old) {
          return {
            liked: false,
            disliked: true,
            saved: false,
            viewed: false,
          };
        }
        
        // Simple toggle logic
        return {
          ...old,
          disliked: !old.disliked,
          // If user was liking and now dislikes, remove like
          liked: old.disliked ? old.liked : false,
        };
      });

      return { previousInteraction, postId, userId };
    },
    onError: (err: Error, postId: string, context?: MutationContext) => {
      if (context?.previousInteraction && context?.userId) {
        queryClient.setQueryData(
          postInteractionKeys.interaction(postId, context.userId),
          context.previousInteraction
        );
      }
      
      console.error('Dislike toggle failed:', err);
      toast.error('Failed to update dislike. Please try again.');
    },
    onSuccess: (data: PostInteractionResponse, postId: string) => {
      // Update cache with server response
      if (data?.data && userId) {
        queryClient.setQueryData<PostInteraction>(
          postInteractionKeys.interaction(postId, userId),
          data.data
        );
      }

      // Force refresh of all post-related data to sync counts
      queryClient.invalidateQueries({
        queryKey: ['posts']
      });

      // Invalidate batch queries for current user
      queryClient.invalidateQueries({
        queryKey: postInteractionKeys.user(userId),
        predicate: (query) => {
          if (query.queryKey.includes('batch')) {
            const batchPostIds = query.queryKey.find(key => Array.isArray(key)) as string[];
            return batchPostIds?.includes(postId);
          }
          return false;
        }
      });
    },
    ...options,
  });
};

// Utility hook to prefetch user interaction for better UX
export const usePrefetchPostInteraction = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const userId = currentUser?._id; // Fixed: Only use _id

  return (postId: string) => {
    if (!currentUser) return;
    
    queryClient.prefetchQuery({
      queryKey: postInteractionKeys.interaction(postId, userId),
      queryFn: () => postInteractionAPI.getUserInteraction(postId),
      staleTime: 30 * 1000,
    });
  };
};

// Utility hook to get interaction status without subscribing to changes
export const usePostInteractionSnapshot = (postId: string) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const userId = currentUser?._id; // Fixed: Only use _id
  
  return () => {
    if (!currentUser) return null;
    
    return queryClient.getQueryData<PostInteraction>(
      postInteractionKeys.interaction(postId, userId)
    );
  };
};

// Hook to clear all interaction cache for user logout
export const useClearInteractionCache = () => {
  const queryClient = useQueryClient();

  return (userId?: string) => {
    if (userId) {
      // Clear specific user's cache
      queryClient.removeQueries({
        queryKey: postInteractionKeys.user(userId)
      });
    } else {
      // Clear all interaction cache
      queryClient.removeQueries({
        queryKey: postInteractionKeys.all
      });
    }
  };
};