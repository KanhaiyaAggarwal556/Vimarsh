import {
  PostInteractionResponse,
  BatchInteractionResponse,
  ViewTrackingResponse,
} from "../types/postInteraction";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

class PostInteractionAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/post-interactions`;
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle specific HTTP status codes
        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        if (response.status === 403) {
          throw new Error("Permission denied");
        }
        if (response.status >= 500) {
          throw new Error("Server error. Please try again later.");
        }

        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // Handle network errors
      if (
        error instanceof TypeError ||
        (error as Error).message.includes("Failed to fetch")
      ) {
        throw new Error("Network error. Please check your connection.");
      }
      throw error;
    }
  }

  async toggleLike(postId: string): Promise<PostInteractionResponse> {
    if (!postId) {
      throw new Error("Post ID is required");
    }
    return this.makeRequest<PostInteractionResponse>(
      `${this.baseURL}/${postId}/like`,
      {
        method: "POST",
      }
    );
  }

  async toggleDislike(postId: string): Promise<PostInteractionResponse> {
    if (!postId) {
      throw new Error("Post ID is required");
    }
    return this.makeRequest<PostInteractionResponse>(
      `${this.baseURL}/${postId}/dislike`,
      {
        method: "POST",
      }
    );
  }

  async getUserInteraction(postId: string): Promise<PostInteractionResponse> {
    if (!postId) {
      throw new Error("Post ID is required");
    }
    return this.makeRequest<PostInteractionResponse>(
      `${this.baseURL}/${postId}/status`
    );
  }

  async getBatchInteractions(
    postIds: string[]
  ): Promise<BatchInteractionResponse> {
    if (!Array.isArray(postIds) || postIds.length === 0) {
      return {};
    }

    // Filter out invalid postIds
    const validPostIds = postIds.filter((id) => id && typeof id === "string");

    if (validPostIds.length === 0) {
      return {};
    }

    const promises = validPostIds.map((id) =>
      this.getUserInteraction(id).catch((error: Error) => ({
        success: false,
        data: {
          error: error.message,
          liked: false,
          disliked: false,
          saved: false,
          viewed: false,
        },
      }))
    );

    const results = await Promise.allSettled(promises);

    return results.reduce((acc, result, index) => {
      const postId = validPostIds[index];
      if (result.status === "fulfilled") {
        acc[postId] = result.value.data || result.value;
      } else {
        acc[postId] = {
          liked: false,
          disliked: false,
          saved: false,
          viewed: false,
          error: (result.reason as Error)?.message || "Unknown error",
        };
      }
      return acc;
    }, {} as BatchInteractionResponse);
  }

  // NEW: Track post view
  async trackPostView(
    postId: string,
    options: {
      viewDuration?: number;
      referralSource?: 'direct' | 'feed' | 'search' | 'profile' | 'notification' | 'share';
    } = {}
  ): Promise<ViewTrackingResponse> {
    if (!postId) {
      throw new Error("Post ID is required");
    }

    return this.makeRequest<ViewTrackingResponse>(
      `${this.baseURL}/${postId}/view`,
      {
        method: "POST",
        body: JSON.stringify({
          viewDuration: options.viewDuration || 0,
          referralSource: options.referralSource || 'direct',
        }),
      }
    );
  }

  // NEW: Track multiple post views (for feed scenarios)
  async trackMultiplePostViews(
    postViews: Array<{
      postId: string;
      viewDuration?: number;
    }>
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      results: Array<{
        postId: string;
        viewAdded: boolean;
        reason?: string;
      }>;
      totalProcessed: number;
    };
  }> {
    if (!Array.isArray(postViews) || postViews.length === 0) {
      throw new Error("Post views array is required");
    }

    return this.makeRequest(
      `${this.baseURL}/batch-views`,
      {
        method: "POST",
        body: JSON.stringify({ postViews }),
      }
    );
  }

  // NEW: Get post analytics (for post owners)
  async getPostAnalytics(postId: string) {
    if (!postId) {
      throw new Error("Post ID is required");
    }

    return this.makeRequest(
      `${this.baseURL}/${postId}/analytics`
    );
  }
}

export const postInteractionAPI = new PostInteractionAPI();