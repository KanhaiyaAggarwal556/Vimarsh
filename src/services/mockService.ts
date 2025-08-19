// services/mockService.ts
import { API_CONFIG } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiTypes";

export class MockService {
  /**
   * Simulates an API call with configurable delay and failure rate
   */
  static async simulateAPICall<T>(
    mockData: T,
    delay: number = API_CONFIG.MOCK_SETTINGS.delay,
    failureRate: number = API_CONFIG.MOCK_SETTINGS.failureRate
  ): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Simulate random failures for testing
    if (Math.random() < failureRate) {
      throw new Error("Mock API failure for testing");
    }

    return {
      success: true,
      data: mockData,
      message: "Operation completed successfully",
    };
  }

  /**
   * Mock data for different operations
   */
  static getMockData(operation: string, id?: string): any {
    const mockData: Record<string, any> = {
      follow: { userId: id, isFollowing: true },
      pin: { postId: id, isPinned: true },
      bookmark: { postId: id, isBookmarked: true },
      delete: { postId: id, deleted: true },
      reaction: { postId: id, updated: true },
    };

    return mockData[operation] || { id, operation };
  }
}
