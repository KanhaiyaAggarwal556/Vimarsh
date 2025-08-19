// config/apiConfig.ts
export const API_CONFIG = {
  // Base URLs
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  
  // Endpoints
  ENDPOINTS: {
    POSTS: '/posts',
    USERS: '/users',
  },
  
  // Feature flags for mock APIs
  MOCK_FEATURES: {
    follow: true,      // Set to false when follow API is implemented
    pin: false,        // Set to true if you want to mock pin API
    bookmark: false,   // Set to true if you want to mock bookmark API
    reactions: false,  // Set to true if you want to mock reactions API
    delete: false,     // Set to true if you want to mock delete API
  },
  
  // Mock API settings
  MOCK_SETTINGS: {
    delay: 500, // Simulate network delay in milliseconds
    failureRate: 0, // 0-1, chance of API failure for testing error handling
  },
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper to get auth headers (implement based on your auth system)
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken'); // Adjust based on your auth implementation
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper to get full headers
export const getHeaders = (): Record<string, string> => ({
  ...API_CONFIG.DEFAULT_HEADERS,
  ...getAuthHeaders(),
});