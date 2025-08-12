// services/api.js
const API_BASE_URL =
   `${import.meta.env.VITE_API_BASE_URL}`;

// API service for post interactions
export const postAPI = {
  // Update post reaction (like/dislike/save)
  updateReaction: async (postId, type, action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/reaction`, {
        method: "POST",
        credentials: "include", // Important for cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update reaction");
      }

      return data;
    } catch (error) {
      console.error("API Error - updateReaction:", error);
      throw error;
    }
  },

  // Increment post views
  incrementViews: async (postId) => {
    try {
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

  // Get user interactions for a post
  getUserInteractions: async (postId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/posts/${postId}/interactions`,
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
        throw new Error(data.message || "Failed to fetch interactions");
      }

      return data;
    } catch (error) {
      console.error("API Error - getUserInteractions:", error);
      throw error;
    }
  },

  // Get single post with user interactions
  getPost: async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch post");
      }

      return data;
    } catch (error) {
      console.error("API Error - getPost:", error);
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
