// hooks/useRandomPosts.ts - Hook for random posts discovery
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostService, RandomPostsResponse } from "@/services/postService";
import { Post, PostDataExtended, convertToPostDataExtended } from "@/types/postTypes";

interface UseRandomPostsOptions {
  limit?: number;
  tags?: string;
  location?: string;
  search?: string;
  enabled?: boolean;
  staleTime?: number;
}

interface UseRandomPostsReturn {
  posts: PostDataExtended[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  generateNewPosts: () => void;
  isRefetching: boolean;
  totalPosts: number;
  returnedPosts: number;
}

export const useRandomPosts = ({
  limit = 10,
  tags,
  location,
  search,
  enabled = true,
  staleTime = 0, // No caching for random posts by default
}: UseRandomPostsOptions = {}): UseRandomPostsReturn => {
  const postService = PostService.getInstance();
  const queryClient = useQueryClient();

  // Create a unique query key that changes when we want new random posts
  const queryKey = ["random-posts", { limit, tags, location, search }];

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<RandomPostsResponse> => {
      console.log('🎲 Fetching random posts with params:', { limit, tags, location, search });
      
      const response = await postService.fetchRandomPosts({
        limit,
        tags,
        location,
        search,
      });
      
      console.log('🎯 Random posts received:', response);
      return response;
    },
    enabled,
    staleTime, // How long to consider data fresh
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time
    refetchOnWindowFocus: false,
    refetchOnReconnect: false, // Don't auto-refetch on reconnect for random posts
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Mutation for generating completely new random posts
  const generateNewPostsMutation = useMutation({
    mutationFn: async () => {
      console.log('🔄 Generating new random posts...');
      return postService.fetchRandomPosts({
        limit,
        tags,
        location,
        search,
      });
    },
    onSuccess: (newData) => {
      // Update the cache with new data
      queryClient.setQueryData(queryKey, newData);
      console.log('✅ New random posts generated and cached');
    },
    onError: (error) => {
      console.error('❌ Failed to generate new random posts:', error);
    },
  });

  // Convert posts to extended format
  const posts: PostDataExtended[] = (data?.data || []).map((post: Post) => {
    const normalizedPost: Post = {
      ...post,
      isBookmarked: post.isBookmarked ?? false,
      user: {
        ...post.user,
        isFollowing: post.user.isFollowing ?? false,
      },
    };
    return convertToPostDataExtended(normalizedPost);
  });

  // Function to generate completely new random posts
  const generateNewPosts = () => {
    generateNewPostsMutation.mutate();
  };

  return {
    posts,
    isLoading: isLoading || generateNewPostsMutation.isPending,
    error: error || generateNewPostsMutation.error,
    refetch,
    generateNewPosts,
    isRefetching: isRefetching || generateNewPostsMutation.isPending,
    totalPosts: data?.totalPosts || 0,
    returnedPosts: data?.returnedPosts || 0,
  };
};

// Hook for random post discovery widget/component
export const useRandomPostsWidget = (count: number = 5) => {
  return useRandomPosts({
    limit: count,
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2 minutes for widgets
  });
};