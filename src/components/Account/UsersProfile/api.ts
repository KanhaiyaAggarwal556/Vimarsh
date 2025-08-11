// api.ts
import { User, Board, post } from './types';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}`;

export const fetchUserByUsername = async (username: string): Promise<User> => {
  // console.log('API call - fetchUserByUsername:', username);
  const url = `${API_BASE}/users/username/${username}`;
  // console.log('Fetching URL:', url);
  
  try {
    const response = await fetch(url);
    // console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`User not found: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    // console.log('User data received:', result);
    
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const fetchUserBoard = async (userId: string): Promise<Board[]> => {
  // console.log('API call - fetchUserBoard:', userId);
  const url = `${API_BASE}/boards/user/${userId}`;
  // console.log('Fetching board URL:', url);
  
  try {
    const response = await fetch(url);
    // console.log('Board response status:', response.status);
    
    if (!response.ok) {
      console.warn('Board fetch failed, returning empty array');
      return [];
    }
    
    const result = await response.json();
    // console.log('Board data received:', result);
    
    if (result.success && result.data) {
      return Array.isArray(result.data) ? result.data : [result.data];
    } else if (Array.isArray(result)) {
      return result;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Board fetch error:', error);
    return [];
  }
};

export const fetchUserPosts = async (
  userId: string, 
  page: number = 1, 
  limit: number = 10
): Promise<{ posts: post[]; hasMore: boolean; totalCount: number }> => {
  // console.log('API call - fetchUserPosts:', { userId, page, limit });
  
  // Add a small delay for more elegant loading experience
  const minLoadingTime = page === 1 ? 800 : 500; // Longer for initial load, shorter for pagination
  const startTime = Date.now();
  
  // Your backend expects /posts/user/:userId based on getPostsByUserId function
  const url = `${API_BASE}/posts/user/${userId}?page=${page}&limit=${limit}`;
  // console.log('Fetching posts URL:', url);
  
  try {
    const response = await fetch(url);
    // console.log('Posts response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      if (response.status === 404) {
        // console.log('User posts not found, returning empty result');
        return { posts: [], hasMore: false, totalCount: 0 };
      }
      
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    // console.log('Posts data received:', result);
    // console.log('Raw result structure:', JSON.stringify(result, null, 2));
    
    // Ensure minimum loading time for better UX
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < minLoadingTime) {
      await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
    }
    
    // Your backend returns: { success: true, data: posts[], pagination: {...} }
    if (result.success && result.data && result.pagination) {
      const posts = Array.isArray(result.data) ? result.data : [];
      const pagination = result.pagination;
      
      // console.log('Backend pagination info:', {
      //   currentPage: pagination.currentPage,
      //   totalPages: pagination.totalPages,
      //   totalPosts: pagination.totalPosts,
      //   hasNext: pagination.hasNext,
      //   hasPrev: pagination.hasPrev,
      //   postsReceived: posts.length,
      //   requestedPage: page,
      //   requestedLimit: limit
      // });
      
      return { 
        posts, 
        hasMore: pagination.hasNext, 
        totalCount: pagination.totalPosts 
      };
    } else if (result.success && result.data) {
      // Fallback if pagination object is missing (shouldn't happen with your backend)
      const posts = Array.isArray(result.data) ? result.data : [];
      // console.log('No pagination object found, using fallback logic');
      
      // If we got less than the limit, assume no more posts
      const hasMore = posts.length === limit;
      
      return { 
        posts, 
        hasMore, 
        totalCount: posts.length 
      };
    } else {
      // console.log('Invalid response structure:', result);
      return { posts: [], hasMore: false, totalCount: 0 };
    }
  } catch (error) {
    console.error('Posts fetch error:', error);
    
    // Still apply minimum loading time even for errors
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < minLoadingTime) {
      await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
    }
    
    return { posts: [], hasMore: false, totalCount: 0 };
  }
};

export const updateBoardCover = async ({ boardId, coverPhoto }: { boardId: string; coverPhoto: string }): Promise<Board> => {
  const response = await fetch(`${API_BASE}/boards/${boardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coverPhoto })
  });
  if (!response.ok) throw new Error('Failed to update cover photo');
  
  const result = await response.json();
  return result.success && result.data ? result.data : result;
};

export const updateUserProfilePic = async ({ userId, profilepic }: { userId: string; profilepic: string }): Promise<User> => {
  const response = await fetch(`${API_BASE}/users/${userId}/profilepic`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profilepic })
  });
  if (!response.ok) throw new Error('Failed to update profile picture');
  
  const result = await response.json();
  return result.success && result.data ? result.data : result;
};


// api.ts - Add this function to your existing api.ts file

export const fetchUserAnalytics = async (userId: string): Promise<any> => {
  // console.log('API call - fetchUserAnalytics:', userId);
  const url = `${API_BASE}/posts/analytics/user/${userId}`;
  // console.log('Fetching analytics URL:', url);
  
  try {
    const response = await fetch(url);
    // console.log('Analytics response status:', response.status);
    
    if (!response.ok) {
      console.warn('Analytics fetch failed, returning empty data');
      return {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        avgViewsPerPost: 0,
        avgLikesPerPost: 0,
        totalPosts: 0,
        monthlyGrowth: 0,
        chartData: []
      };
    }
    
    const result = await response.json();
    // console.log('Analytics data received:', result);
    
    if (result.success && result.data) {
      return result.data;
    } else {
      return {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        avgViewsPerPost: 0,
        avgLikesPerPost: 0,
        totalPosts: 0,
        monthlyGrowth: 0,
        chartData: []
      };
    }
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      avgViewsPerPost: 0,
      avgLikesPerPost: 0,
      totalPosts: 0,
      monthlyGrowth: 0,
      chartData: []
    };
  }
};
