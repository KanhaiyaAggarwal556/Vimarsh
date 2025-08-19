// services/apiService.ts
import { API_CONFIG, getHeaders } from "@/config/apiConfig";
import { MockService } from "@/services/mockService";
import type {
  ApiResponse,
  ReactionType,
  ReactionAction,
} from "@/types/apiTypes";

export class ApiService {
  private static baseUrl = API_CONFIG.BASE_URL;

  /**
   * Generic fetch wrapper with error handling
   */
  private static async fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Update post reaction
   */
  static async updatePostReaction(
    postId: string,
    type: ReactionType,
    action: ReactionAction
  ): Promise<ApiResponse> {
    if (API_CONFIG.MOCK_FEATURES.reactions) {
      return MockService.simulateAPICall(
        MockService.getMockData("reaction", postId)
      );
    }

    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.POSTS}/${postId}/reactions`;
    return this.fetchWithErrorHandling(url, {
      method: "POST",
      body: JSON.stringify({ type, action }),
    });
  }

  /**
   * Toggle post pin status
   */
  static async togglePostPin(postId: string): Promise<ApiResponse> {
    if (API_CONFIG.MOCK_FEATURES.pin) {
      return MockService.simulateAPICall(
        MockService.getMockData("pin", postId)
      );
    }

    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.POSTS}/${postId}/pin`;
    return this.fetchWithErrorHandling(url, {
      method: "POST",
    });
  }

  /**
   * Toggle post bookmark status
   */
  static async togglePostBookmark(postId: string): Promise<ApiResponse> {
    if (API_CONFIG.MOCK_FEATURES.bookmark) {
      return MockService.simulateAPICall(
        MockService.getMockData("bookmark", postId)
      );
    }

    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.POSTS}/${postId}/bookmark`;
    return this.fetchWithErrorHandling(url, {
      method: "POST",
    });
  }

  /**
   * Toggle user follow status
   */
  static async toggleUserFollow(userId: string): Promise<ApiResponse> {
    console.log("🚀 Toggling follow for user:", userId);

    if (API_CONFIG.MOCK_FEATURES.follow) {
      console.log("🎭 Using mock follow API (backend not implemented yet)");
      const response = await MockService.simulateAPICall(
        MockService.getMockData("follow", userId)
      );
      console.log("✅ Mock API response:", response);
      return response;
    }

    // Real API implementation
    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS}/${userId}/follow`;
    const result = await this.fetchWithErrorHandling(url, {
      method: "POST",
    });

    console.log("✅ Real API response:", result);
    return result;
  }

  /**
   * Delete a post
   */
  static async deletePost(postId: string): Promise<ApiResponse> {
    if (API_CONFIG.MOCK_FEATURES.delete) {
      return MockService.simulateAPICall(
        MockService.getMockData("delete", postId)
      );
    }

    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.POSTS}/${postId}`;
    return this.fetchWithErrorHandling(url, {
      method: "DELETE",
    });
  }
}
