// utils/cacheUtils.ts
import type { QueryClient } from '@tanstack/react-query';
import type { PostsResponse, Post } from '@/types/apiTypes';

export class CacheUtils {
  private static readonly POSTS_QUERY_KEY = ['posts'] as const;

  /**
   * Get posts data from cache
   */
  static getPostsFromCache(queryClient: QueryClient): PostsResponse | undefined {
    return queryClient.getQueryData(this.POSTS_QUERY_KEY);
  }

  /**
   * Update a specific post in the cache
   */
  static updatePostInCache(
    queryClient: QueryClient,
    postId: string,
    updater: (post: Post) => Post
  ): PostsResponse | undefined {
    const previousPosts = this.getPostsFromCache(queryClient);
    
    queryClient.setQueryData(this.POSTS_QUERY_KEY, (old: PostsResponse | undefined) => {
      if (!old?.data) return old;

      return {
        ...old,
        data: old.data.map((post) => 
          post._id === postId ? updater(post) : post
        ),
      };
    });

    return previousPosts;
  }

  /**
   * Update all posts by a specific user in the cache
   */
  static updateUserPostsInCache(
    queryClient: QueryClient,
    userId: string,
    updater: (post: Post) => Post
  ): PostsResponse | undefined {
    const previousPosts = this.getPostsFromCache(queryClient);
    
    queryClient.setQueryData(this.POSTS_QUERY_KEY, (old: PostsResponse | undefined) => {
      if (!old?.data) return old;

      return {
        ...old,
        data: old.data.map((post) => 
          post.user._id === userId ? updater(post) : post
        ),
      };
    });

    return previousPosts;
  }

  /**
   * Remove a post from the cache
   */
  static removePostFromCache(
    queryClient: QueryClient,
    postId: string
  ): PostsResponse | undefined {
    const previousPosts = this.getPostsFromCache(queryClient);
    
    queryClient.setQueryData(this.POSTS_QUERY_KEY, (old: PostsResponse | undefined) => {
      if (!old?.data) return old;

      return {
        ...old,
        data: old.data.filter((post) => post._id !== postId),
        pagination: {
          ...old.pagination,
          totalItems: Math.max(0, old.pagination.totalItems - 1),
        },
      };
    });

    return previousPosts;
  }

  /**
   * Cancel ongoing queries and get previous data
   */
  static async cancelQueriesAndGetPrevious(
    queryClient: QueryClient
  ): Promise<PostsResponse | undefined> {
    await queryClient.cancelQueries({ queryKey: this.POSTS_QUERY_KEY });
    return this.getPostsFromCache(queryClient);
  }

  /**
   * Restore previous posts data
   */
  static restorePreviousPosts(
    queryClient: QueryClient,
    previousPosts: PostsResponse | undefined
  ): void {
    if (previousPosts) {
      queryClient.setQueryData(this.POSTS_QUERY_KEY, previousPosts);
    }
  }

  /**
   * Invalidate posts queries
   */
  static invalidatePostsQueries(queryClient: QueryClient): void {
    queryClient.invalidateQueries({ queryKey: this.POSTS_QUERY_KEY });
  }
}