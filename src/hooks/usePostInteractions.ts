// FIXED: usePostInteractions.tsx

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { postInteractionAPI } from "../services/postInteractionApi";
import { toast } from "react-hot-toast";
import type {
  PostInteraction,
  PostInteractionResponse,
  ViewTrackingResponse,
  ViewTrackingOptions,
} from "../types/postInteraction";
import useAuthStore from "@store/useAuthStore";
import { useEffect } from "react";

// FIXED: Add missing type definition
export interface UsePostInteractionOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
}

// Query Keys
export const postInteractionKeys = {
  all: ["postInteractions"] as const,
  user: (userId?: string) =>
    [...postInteractionKeys.all, "user", userId] as const,
  interaction: (postId: string, userId?: string) =>
    [...postInteractionKeys.user(userId), "interaction", postId] as const,
  batch: (postIds: string[], userId?: string) =>
    [...postInteractionKeys.user(userId), "batch", postIds?.sort?.()] as const,
};

// FIXED: View tracking hook with proper deduplication
export const useViewTracking = () => {
  const { currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  
  const trackViewMutation = useMutation({
    mutationFn: ({ 
      postId, 
      options = {} 
    }: { 
      postId: string; 
      options?: ViewTrackingOptions 
    }) => {
      return postInteractionAPI.trackPostView(postId, options);
    },
    onSuccess: (data: ViewTrackingResponse, { postId }) => {
      if (data.data.viewAdded) {
        // Update the specific post's view count in cache
        queryClient.setQueryData(["posts"], (oldData: any) => {
          if (!oldData?.pages) return oldData;
          
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts?.map((post: any) => 
                post._id === postId 
                  ? { ...post, views: data.data.totalViews }
                  : post
              ) || page.posts
            }))
          };
        });
        
        queryClient.setQueryData(["post", postId], (oldPost: any) => {
          if (!oldPost) return oldPost;
          return { ...oldPost, views: data.data.totalViews };
        });
        
        console.log(`✅ View count updated in cache: Post ${postId} now has ${data.data.totalViews} views`);
      }
    },
    onError: (error: Error, { postId }) => {
      // Only log unexpected errors
      if (!error.message.includes("already") && 
          !error.message.includes("Self-view") &&
          !error.message.includes("recent")) {
        console.error("Unexpected view tracking error:", error);
        toast.error("Failed to track view");
      } else {
        console.log(`View tracking: ${error.message} for post ${postId}`);
      }
    },
    retry: false, // Don't retry view tracking
  });

  // FIXED: Simplified view tracking with server-side deduplication
  const trackPostView = (
    postId: string, 
    options: ViewTrackingOptions = {}
  ) => {
    if (!postId || !currentUser) {
      console.log("View tracking skipped:", { postId: !!postId, authenticated: !!currentUser });
      return;
    }
    
    // FIXED: Remove localStorage checks - let server handle all deduplication
    console.log(`Attempting to track view for post ${postId}`, {
      userId: currentUser._id,
      options
    });
    
    trackViewMutation.mutate({ postId, options });
  };

  // Batch tracking (simplified)
  const trackMultipleViews = useMutation({
    mutationFn: (postViews: Array<{ postId: string; viewDuration?: number }>) => {
      if (!currentUser) {
        throw new Error("Authentication required");
      }
      return postInteractionAPI.trackMultiplePostViews(postViews);
    },
    onSuccess: (data) => {
      if (!data) return;
      
      const anyViewsAdded = data.data.results.some(({ viewAdded }) => viewAdded);
      if (anyViewsAdded) {
        queryClient.invalidateQueries({
          queryKey: ["posts"],
          refetchType: "none",
        });
        console.log(`✅ Batch tracking: ${data.data.results.filter(r => r.viewAdded).length} new views tracked`);
      }
    },
  });

  // FIXED: Clear cache on user change
  useEffect(() => {
    if (!currentUser) {
      // Clear all view-related queries when user logs out
      queryClient.removeQueries({
        queryKey: postInteractionKeys.all,
      });
    }
  }, [currentUser, queryClient]);

  return {
    trackPostView,
    trackMultiplePostViews: trackMultipleViews.mutate,
    isTracking: trackViewMutation.isPending || trackMultipleViews.isPending,
    // FIXED: Add hasTracked property that was missing
    hasTracked: trackViewMutation.isSuccess,
    clearCache: () => {
      queryClient.removeQueries({
        queryKey: postInteractionKeys.all,
      });
    }
  };
};

// FIXED: PostInteraction hook with proper typing
export const usePostInteraction = (
  postId: string,
  options: UsePostInteractionOptions = {}
) => {
  const { currentUser } = useAuthStore();
  const userId = currentUser?._id;

  return useQuery({
    queryKey: postInteractionKeys.interaction(postId, userId),
    queryFn: () => postInteractionAPI.getUserInteraction(postId),
    select: (data: PostInteractionResponse) => data?.data || data,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: Boolean(postId && currentUser) && options.enabled !== false,
    retry: (failureCount: number, error: Error) => {
      if (error?.message?.includes("Authentication") || error?.message?.includes("401")) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  });
};

// FIXED: Like toggle hook with proper error handling
export const useToggleLike = (
  options?: UseMutationOptions<PostInteractionResponse, Error, string, any>
) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const userId = currentUser?._id;

  return useMutation({
    mutationFn: (postId: string) => postInteractionAPI.toggleLike(postId),
    onMutate: async (postId: string) => {
      if (!postId || !currentUser) {
        throw new Error("Post ID and authentication are required");
      }

      const queryKey = postInteractionKeys.interaction(postId, userId);
      await queryClient.cancelQueries({ queryKey });

      const previousInteraction = queryClient.getQueryData<PostInteraction>(queryKey);

      queryClient.setQueryData<PostInteraction>(queryKey, (old) => {
        // FIXED: Provide default values for undefined properties
        const currentInteraction = old || { liked: false, disliked: false, saved: false, viewed: false };
        return {
          ...currentInteraction,
          liked: !currentInteraction.liked,
          disliked: currentInteraction.liked ? currentInteraction.disliked : false,
        };
      });

      return { previousInteraction, postId, userId };
    },
    onError: (err: Error, postId: string, context?: any) => {
      if (context?.previousInteraction && context?.userId) {
        queryClient.setQueryData(
          postInteractionKeys.interaction(postId, context.userId),
          context.previousInteraction
        );
      }
      console.error("Like toggle failed:", err);
      toast.error("Failed to update like. Please try again.");
    },
    onSuccess: (data: PostInteractionResponse, postId: string) => {
      if (data?.data && userId) {
        queryClient.setQueryData<PostInteraction>(
          postInteractionKeys.interaction(postId, userId),
          data.data
        );
      }
      queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "none" });
    },
    ...options,
  });
};

// FIXED: Dislike toggle hook with proper error handling
export const useToggleDislike = (
  options?: UseMutationOptions<PostInteractionResponse, Error, string, any>
) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const userId = currentUser?._id;

  return useMutation({
    mutationFn: (postId: string) => postInteractionAPI.toggleDislike(postId),
    onMutate: async (postId: string) => {
      if (!postId || !currentUser) {
        throw new Error("Post ID and authentication are required");
      }

      const queryKey = postInteractionKeys.interaction(postId, userId);
      await queryClient.cancelQueries({ queryKey });

      const previousInteraction = queryClient.getQueryData<PostInteraction>(queryKey);

      queryClient.setQueryData<PostInteraction>(queryKey, (old) => {
        // FIXED: Provide default values for undefined properties
        const currentInteraction = old || { liked: false, disliked: false, saved: false, viewed: false };
        return {
          ...currentInteraction,
          disliked: !currentInteraction.disliked,
          liked: currentInteraction.disliked ? currentInteraction.liked : false,
        };
      });

      return { previousInteraction, postId, userId };
    },
    onError: (err: Error, postId: string, context?: any) => {
      if (context?.previousInteraction && context?.userId) {
        queryClient.setQueryData(
          postInteractionKeys.interaction(postId, context.userId),
          context.previousInteraction
        );
      }
      console.error("Dislike toggle failed:", err);
      toast.error("Failed to update dislike. Please try again.");
    },
    onSuccess: (data: PostInteractionResponse, postId: string) => {
      if (data?.data && userId) {
        queryClient.setQueryData<PostInteraction>(
          postInteractionKeys.interaction(postId, userId),
          data.data
        );
      }
      queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "none" });
    },
    ...options,
  });
};

// Clear cache utility
export const useClearInteractionCache = () => {
  const queryClient = useQueryClient();

  return (userId?: string) => {
    if (userId) {
      queryClient.removeQueries({ queryKey: postInteractionKeys.user(userId) });
    } else {
      queryClient.removeQueries({ queryKey: postInteractionKeys.all });
    }
  };
};