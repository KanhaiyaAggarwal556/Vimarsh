// hooks/usePostMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/services/apiService";
import { CacheUtils } from "@/utils/cacheUtils";
import { API_CONFIG } from "@/config/apiConfig";
import type { ReactionPayload } from "@/types/apiTypes";

export const usePostMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Reaction mutation with optimistic updates
   */
  const reactionMutation = useMutation({
    mutationFn: ({ postId, type, action }: ReactionPayload) =>
      ApiService.updatePostReaction(postId, type, action),

    onMutate: async ({ postId, type, action }) => {
      const previousPosts = await CacheUtils.cancelQueriesAndGetPrevious(
        queryClient
      );

      CacheUtils.updatePostInCache(queryClient, postId, (post) => {
        const increment = action === "increment" ? 1 : -1;
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [type]: Math.max(0, post.reactions[type] + increment),
          },
        };
      });

      return { previousPosts };
    },

    onError: (_error, _variables, context) => {
      CacheUtils.restorePreviousPosts(queryClient, context?.previousPosts);
    },

    onSettled: () => {
      CacheUtils.invalidatePostsQueries(queryClient);
    },
  });

  /**
   * Pin mutation with optimistic updates
   */
  const pinMutation = useMutation({
    mutationFn: (postId: string) => ApiService.togglePostPin(postId),

    onMutate: async (postId) => {
      const previousPosts = await CacheUtils.cancelQueriesAndGetPrevious(
        queryClient
      );

      CacheUtils.updatePostInCache(queryClient, postId, (post) => ({
        ...post,
        isPinned: !post.isPinned,
      }));

      return { previousPosts };
    },

    onError: (_error, _postId, context) => {
      CacheUtils.restorePreviousPosts(queryClient, context?.previousPosts);
    },

    onSettled: () => {
      CacheUtils.invalidatePostsQueries(queryClient);
    },
  });

  /**
   * Bookmark mutation with optimistic updates
   */
  const bookmarkMutation = useMutation({
    mutationFn: (postId: string) => ApiService.togglePostBookmark(postId),

    onMutate: async (postId) => {
      const previousPosts = await CacheUtils.cancelQueriesAndGetPrevious(
        queryClient
      );

      CacheUtils.updatePostInCache(queryClient, postId, (post) => ({
        ...post,
        isBookmarked: !post.isBookmarked,
      }));

      return { previousPosts };
    },

    onError: (_error, _postId, context) => {
      CacheUtils.restorePreviousPosts(queryClient, context?.previousPosts);
    },

    onSettled: () => {
      CacheUtils.invalidatePostsQueries(queryClient);
    },
  });

  /**
   * Follow mutation with optimistic updates and proper mock handling
   */
  const followMutation = useMutation({
    mutationFn: (userId: string) => {
      console.log("🔄 Starting follow mutation for user:", userId);
      return ApiService.toggleUserFollow(userId);
    },

    onMutate: async (userId) => {
      console.log("🎯 Optimistically updating follow state for user:", userId);

      const previousPosts = await CacheUtils.cancelQueriesAndGetPrevious(
        queryClient
      );

      CacheUtils.updateUserPostsInCache(queryClient, userId, (post) => {
        const newFollowState = !post.user.isFollowing;
        console.log(
          `📝 Updating post ${post._id}: ${post.user.isFollowing} -> ${newFollowState}`
        );

        return {
          ...post,
          user: {
            ...post.user,
            isFollowing: newFollowState,
          },
        };
      });

      return { previousPosts, userId };
    },

    onSuccess: (_result, userId, context) => {
      console.log("✅ Follow mutation succeeded for user:", userId);

      // For mock API, ensure the optimistic update persists
      if (API_CONFIG.MOCK_FEATURES.follow && context) {
        console.log("🎭 Persisting optimistic update for mock API");

        CacheUtils.updateUserPostsInCache(queryClient, userId, (post) => {
          // Find the original follow state from previous data
          const previousPost = context.previousPosts?.data.find(
            (p) => p._id === post._id
          );
          const originalFollowState = previousPost?.user.isFollowing ?? false;

          return {
            ...post,
            user: {
              ...post.user,
              isFollowing: !originalFollowState,
            },
          };
        });
      }
    },

    onError: (error, userId, context) => {
      console.error(
        "❌ Follow mutation failed for user:",
        userId,
        "Error:",
        error
      );
      CacheUtils.restorePreviousPosts(queryClient, context?.previousPosts);
    },

    onSettled: (_result, _error, userId) => {
      console.log("🏁 Follow mutation completed for user:", userId);

      // Only invalidate queries if using real API
      if (!API_CONFIG.MOCK_FEATURES.follow) {
        CacheUtils.invalidatePostsQueries(queryClient);
      } else {
        console.log(
          "🎭 Skipping query invalidation for mock API to preserve state"
        );
      }
    },
  });

  /**
   * Delete mutation with optimistic updates
   */
  const deleteMutation = useMutation({
    mutationFn: (postId: string) => ApiService.deletePost(postId),

    onMutate: async (postId) => {
      const previousPosts = await CacheUtils.cancelQueriesAndGetPrevious(
        queryClient
      );
      CacheUtils.removePostFromCache(queryClient, postId);
      return { previousPosts };
    },

    onError: (_error, _postId, context) => {
      CacheUtils.restorePreviousPosts(queryClient, context?.previousPosts);
    },

    onSettled: () => {
      CacheUtils.invalidatePostsQueries(queryClient);
    },
  });

  return {
    // Mutation functions
    updateReaction: reactionMutation.mutate,
    togglePin: pinMutation.mutate,
    toggleBookmark: bookmarkMutation.mutate,
    toggleFollow: followMutation.mutate,
    deletePost: deleteMutation.mutate,

    // Loading states
    isUpdatingReaction: reactionMutation.isPending,
    isTogglingPin: pinMutation.isPending,
    isTogglingBookmark: bookmarkMutation.isPending,
    isTogglingFollow: followMutation.isPending,
    isDeletingPost: deleteMutation.isPending,

    // Error states
    reactionError: reactionMutation.error,
    pinError: pinMutation.error,
    bookmarkError: bookmarkMutation.error,
    followError: followMutation.error,
    deleteError: deleteMutation.error,

    // Success states
    reactionSuccess: reactionMutation.isSuccess,
    pinSuccess: pinMutation.isSuccess,
    bookmarkSuccess: bookmarkMutation.isSuccess,
    followSuccess: followMutation.isSuccess,
    deleteSuccess: deleteMutation.isSuccess,
  };
};
