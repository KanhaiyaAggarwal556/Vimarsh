// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const postAPI = {
  updateReaction: async (postId, type, action) => {
    try {
      // 🔧 Validate postId on frontend before sending
      if (!postId) {
        throw new Error("Post ID is required");
      }
      
      // Check if it looks like a MongoDB ObjectId (24 hex characters)
      if (!/^[0-9a-fA-F]{24}$/.test(postId)) {
        console.error("Invalid post ID format:", postId);
        throw new Error(`Invalid post ID format: ${postId}`);
      }

      console.log("Making API call:", {
        url: `${API_BASE_URL}/posts/${postId}/reaction`,
        postId,
        type,
        action
      });

      const response = await fetch(`${API_BASE_URL}/posts/${postId}/reaction`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, action }),
      });

      const data = await response.json();
      
      console.log("API Response:", {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: Failed to update reaction`);
      }

      return data;
    } catch (error) {
      console.error("API Error - updateReaction:", error);
      throw error;
    }
  },

  incrementViews: async (postId) => {
    try {
      if (!postId || !/^[0-9a-fA-F]{24}$/.test(postId)) {
        console.error("Invalid post ID for views:", postId);
        throw new Error(`Invalid post ID format: ${postId}`);
      }

      const response = await fetch(`${API_BASE_URL}/posts/${postId}/views`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update views");
      }

      return data;
    } catch (error) {
      console.error("API Error - incrementViews:", error);
      throw error;
    }
  },
};

// Auth API service
export const authAPI = {
  // Check authentication status
  checkAuth: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL.replace("/api", "")}/auth/user`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Not authenticated");
      }

      return data;
    } catch (error) {
      console.error("API Error - checkAuth:", error);
      throw error;
    }
  },
};
