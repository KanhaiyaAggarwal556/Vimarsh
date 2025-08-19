// services/postService.ts - Production Ready (Cleaned)
import { Post, PostsResponse, PostDataExtended, convertToPostDataExtended } from '@/types/postTypes';

export interface InfinitePostsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  seed?: string;
  tags?: string;
  location?: string;
  search?: string;
  isFirstLoad?: boolean;
}

export interface InfinitePostsResponse {
  success: boolean;
  data: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNext: boolean;
    hasPrev: boolean;
    batchSize: number;
    loadedPosts: number;
  };
  hasNextPage: boolean;
  nextPage: number | null;
  seed: string;
  isFirstLoad: boolean;
  message?: string; // Optional error message
}

export class PostService {
  private static instance: PostService;
  private readonly baseUrl = `${import.meta.env.VITE_API_BASE_URL}/posts`;
  private currentSeed: string | null = null;
  private abortController: AbortController | null = null;

  public static getInstance(): PostService {
    if (!PostService.instance) {
      PostService.instance = new PostService();
    }
    return PostService.instance;
  }

  constructor() {
    this.currentSeed = null;
  }

  private generateNumericSeed(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }

  private getSessionSeed(): string {
    if (!this.currentSeed) {
      this.currentSeed = this.generateNumericSeed();
    }
    return this.currentSeed;
  }

  public resetSeed(): void {
    this.currentSeed = null;
  }

  public forceNewSeed(): string {
    this.currentSeed = this.generateNumericSeed();
    return this.currentSeed;
  }

  async fetchInfinitePosts(params: InfinitePostsParams = {}): Promise<InfinitePostsResponse> {
    // Cancel previous request
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'random',
        sortOrder = 'desc',
        seed,
        isFirstLoad = false,
        ...otherParams
      } = params;

      const useSeed = seed || this.getSessionSeed();

      const queryParams = {
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        seed: useSeed,
        isFirstLoad: isFirstLoad.toString(),
        ...otherParams
      };

      const queryString = this.buildQueryParams(queryParams);
      const url = `${this.baseUrl}/infinite?${queryString}`;
      
      const response = await fetch(url, {
        credentials: 'include',
        signal: this.abortController.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: InfinitePostsResponse = await response.json();

      // Store the returned seed for consistency
      if (data.seed && data.seed !== 'undefined' && data.seed !== 'null') {
        this.currentSeed = data.seed;
      }

      if (!data.success) {
        throw new Error(`API Error: ${data.message || 'Unknown error'}`);
      }

      if (!Array.isArray(data.data)) {
        data.data = [];
      }

      return data;
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      throw error;
    } finally {
      this.abortController = null;
    }
  }

  async fetchInfinitePostsCursor(params: {
    limit?: number;
    cursor?: string;
    seed?: string;
    tags?: string;
    location?: string;
    search?: string;
    isFirstLoad?: boolean;
  } = {}): Promise<any> {
    try {
      const {
        limit = 10,
        cursor,
        seed,
        isFirstLoad = false,
        ...otherParams
      } = params;

      const useSeed = seed || this.getSessionSeed();

      const queryParams = {
        limit: limit.toString(),
        cursor: cursor || '',
        seed: useSeed,
        isFirstLoad: isFirstLoad.toString(),
        ...otherParams
      };

      const queryString = this.buildQueryParams(queryParams);
      const url = `${this.baseUrl}/infinite-cursor?${queryString}`;
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.seed) {
        this.currentSeed = data.seed;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchPureRandomPosts(params: {
    limit?: number;
    tags?: string;
    location?: string;
    search?: string;
  } = {}): Promise<any> {
    try {
      const queryString = this.buildQueryParams(params);
      const url = `${this.baseUrl}/random?${queryString}`;
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  private buildQueryParams(params?: Record<string, any>): string {
    if (!params) return '';
    
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return searchParams.toString();
  }

  private normalizePost(post: Post): Post {
    return {
      ...post,
      isBookmarked: post.isBookmarked ?? false,
      user: {
        ...post.user,
        isFollowing: post.user.isFollowing ?? false,
      }
    };
  }

  private convertPostsToExtended(posts: Post[]): PostDataExtended[] {
    return posts.map(post => {
      const normalizedPost = this.normalizePost(post);
      return convertToPostDataExtended(normalizedPost);
    });
  }

  // Regular methods
  async fetchPostsWithParams(queryParams?: Record<string, any>): Promise<PostsResponse> {
    try {
      const params = this.buildQueryParams(queryParams);
      const url = params ? `${this.baseUrl}?${params}` : this.baseUrl;
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async fetchPosts(): Promise<PostDataExtended[]> {
    try {
      const response = await this.fetchPostsWithParams();
      return this.convertPostsToExtended(response.data);
    } catch (error) {
      throw error;
    }
  }

  async createPost(postData: Partial<PostDataExtended>): Promise<PostDataExtended> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
      }

      const result = await response.json();
      
      // Invalidate cache by resetting seed
      this.resetSeed();
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updatePost(postId: string, postData: Partial<PostDataExtended>): Promise<PostDataExtended> {
    try {
      const response = await fetch(`${this.baseUrl}/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status}`);
      }
      
      // Invalidate cache
      this.resetSeed();
    } catch (error) {
      throw error;
    }
  }

  // Utility methods
  public getCurrentSeed(): string | null {
    return this.currentSeed;
  }

  public cancelRequests(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}