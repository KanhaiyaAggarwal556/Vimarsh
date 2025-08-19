// types/postTypes.ts - Updated for infinite scroll and backend integration

import { RefObject } from 'react';

// Media item interface for carousel/grid functionality
export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  key: string;
  imageIndex: number | null;
}

// User information interface
export interface PostUser {
  _id: string;
  userName: string;
  fullName: string;
  profilepic?: string;
  isFollowing?: boolean;
}

// Base reactions interface (for API responses)
export interface PostReactions {
  likes: number;
  dislikes: number;
  shares: number;
  saves: number;
  comments?: number;
}

// Extended reactions interface (for PostActions component)
export interface PostReactionsExtended {
  like: number;
  love: number;
  laugh: number;
  wow: number;
  sad: number;
  angry: number;
}

// User post interaction interface (from your backend)
export interface UserPostInteraction {
  liked: boolean;
  disliked: boolean;
  saved: boolean;
  viewed: boolean;
}

// PostActions component data interface (matching postActionsTypes.ts)
export interface PostActionsData {
  _id: string;
  views?: number;
  reactions?: {
    likes: number;
    dislikes: number;
  };
  title?: string;
  description?: string;
}

// Base post data interface (can be used for simpler components)
export interface PostData {
  _id: string;
  user: PostUser;
  content?: string;
  createdAt: string;
  updatedAt?: string;
  isPinned: boolean;
  isBookmarked: boolean;
  likes?: number;
  comments?: number;
  views?: number;
  location?: string;
}

// Extended Post interface from dropdownTypes (for components that need extended reactions)
export interface PostDataExtended {
  _id: string;
  title: string;
  description: string;
  images: string[];
  videos: string[];
  tags: string[];
  location: string;
  user: PostUser;
  reactions: PostReactionsExtended;
  views: number;
  isPinned: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
  userInteraction?: UserPostInteraction; // Optional user interaction data
}

// Base Post interface (matches your API response)
export interface Post {
  _id: string;
  title: string;
  description: string;
  images: string[];
  videos: string[];
  tags: string[];
  location: string;
  user: PostUser;
  reactions: PostReactions;
  views: number;
  isPinned: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
  userInteraction?: UserPostInteraction; // Optional user interaction data
}

// Enhanced Post interface with interactions (from your backend response)
export interface PostWithInteractions extends Post {
  userInteraction: UserPostInteraction;
}

// Standard pagination interface
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNext: boolean;
  hasPrev: boolean;
  batchSize?: number;
  loadedPosts?: number;
}

// Basic posts response interface
export interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination: Pagination;
}

// Infinite scroll parameters for your backend
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

// Infinite posts response (from your backend)
export interface InfinitePostsResponse {
  success: boolean;
  data: Post[];
  pagination: Pagination;
  hasNextPage: boolean;
  nextPage: number | null;
  seed?: string;
  isFirstLoad?: boolean;
  batchSize?: number;
}

// Cursor-based pagination response (alternative approach)
export interface CursorPostsResponse {
  success: boolean;
  data: Post[];
  hasNextPage: boolean;
  nextCursor: string | null;
  seed: string;
  isFirstLoad: boolean;
  batchSize: number;
}

// Main Post component props
export interface PostProps {
  showComments?: boolean;
  postId?: string;
  post: PostDataExtended;
  onDelete?: (postId: string) => void;
  onTogglePin?: (postId: string) => Promise<void>;
  onToggleFollow?: (userId: string) => Promise<void>;
  onToggleBookmark?: (postId: string) => Promise<void>;
  isDeleting?: boolean;
  onReactionUpdate?: (
    postId: string,
    type: "likes" | "dislikes" | "shares" | "saves",
    action: "increment" | "decrement"
  ) => void;
}

// Post Header component props
export interface PostHeaderProps {
  post: PostDataExtended;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  onUserClick: () => void;
  onDelete: () => void;
  onPin: () => void;
  onFollow: () => void;
  onBookmark: () => void;
  pinPending: boolean;
  deletePending: boolean;
  followPending?: boolean;
  bookmarkPending?: boolean;
}

// Post Content component props
export interface PostContentProps {
  post: PostDataExtended;
  className?: string;
}

// Post Comments component props
export interface PostCommentsProps {
  showComments: boolean;
  postId: string;
  className?: string;
}

// PostActions component props interface (from postActionsTypes.ts)
export interface PostActionsProps {
  post: PostActionsData;
  onPostUpdate?: (updatedPost: PostActionsData) => void;
  onComments: () => void;
  isOnPostPage?: boolean;
  referralSource?: 'direct' | 'feed' | 'search' | 'profile' | 'notification' | 'share';
  enableViewTracking?: boolean;
}

// HomeSection component props interface - Updated for infinite scroll
export interface HomeSectionProps {
  isActive: boolean;
  fetching: boolean;
  postList: PostDataExtended[];
  onRefetch: () => Promise<void>;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  sentinelRef?: RefObject<HTMLDivElement>;
  error?: Error | null;
}

// Extended HomeSectionProps with additional infinite scroll features
export interface ExtendedHomeSectionProps extends HomeSectionProps {
  totalPosts?: number;
  loadedCount?: number;
  remainingCount?: number;
  onLoadMore?: () => Promise<void>;
  isLoadingMore?: boolean;
  loadMoreError?: Error | null;
}

// Infinite scroll hook options
export interface UseInfiniteScrollOptions {
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

// Query key factory for React Query
export const postQueryKeys = {
  all: ['posts'] as const,
  infinite: (params?: InfinitePostsParams) => ['posts', 'infinite', params] as const,
  infiniteCursor: (params?: { cursor?: string; limit?: number }) => 
    ['posts', 'infinite-cursor', params] as const,
  byId: (id: string) => ['posts', id] as const,
  byUser: (userId: string) => ['posts', 'user', userId] as const,
  recent: (hours?: number) => ['posts', 'recent', hours] as const,
  trending: (timeFrame?: number) => ['posts', 'trending', timeFrame] as const,
  analytics: (userId: string) => ['posts', 'analytics', userId] as const,
  interactions: (postId: string) => ['posts', 'interactions', postId] as const,
};

// Error types
export interface PostError {
  success: false;
  message: string;
  error: string;
  debug?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Utility function to convert Post (API) to PostDataExtended (component)
export const convertToPostDataExtended = (post: Post): PostDataExtended => {
  return {
    ...post,
    reactions: {
      like: post.reactions.likes || 0,
      love: 0, // Default values since these aren't in your API
      laugh: 0,
      wow: 0,
      sad: 0,
      angry: post.reactions.dislikes || 0,
    },
    userInteraction: post.userInteraction || {
      liked: false,
      disliked: false,
      saved: false,
      viewed: false,
    },
  };
};

// Utility function to convert PostDataExtended to PostActionsData
export const convertToPostActionsData = (post: PostDataExtended): PostActionsData => {
  return {
    _id: post._id,
    views: post.views,
    reactions: {
      likes: post.reactions.like || 0,
      dislikes: post.reactions.angry || 0,
    },
    title: post.title,
    description: post.description,
  };
};

// Utility function to convert PostData to PostDataExtended
export const convertPostDataToExtended = (postData: PostData): PostDataExtended => {
  return {
    _id: postData._id,
    title: postData.content || '',
    description: postData.content || '',
    images: [],
    videos: [],
    tags: [],
    location: postData.location || '',
    user: {
      ...postData.user,
      isFollowing: postData.user.isFollowing ?? false,
    },
    reactions: {
      like: postData.likes || 0,
      love: 0,
      laugh: 0,
      wow: 0,
      sad: 0,
      angry: 0,
    },
    views: postData.views || 0,
    isPinned: postData.isPinned,
    isBookmarked: postData.isBookmarked,
    createdAt: postData.createdAt,
    updatedAt: postData.updatedAt || postData.createdAt,
    userInteraction: {
      liked: false,
      disliked: false,
      saved: false,
      viewed: false,
    },
  };
};

// Utility function to convert PostDataExtended back to Post (API format)
export const convertFromPostDataExtended = (postExtended: PostDataExtended): Post => {
  return {
    ...postExtended,
    user: {
      ...postExtended.user,
      isFollowing: postExtended.user.isFollowing ?? false,
    },
    reactions: {
      likes: postExtended.reactions.like,
      dislikes: postExtended.reactions.angry,
      shares: 0, // You'll need to maintain these separately or add to your backend
      saves: 0,
      comments: 0,
    },
    userInteraction: postExtended.userInteraction,
  };
};

// Utility function to normalize posts with default values
export const normalizePost = (post: Post): Post => {
  return {
    ...post,
    userInteraction: post.userInteraction || {
      liked: false,
      disliked: false,
      saved: false,
      viewed: false,
    },
    user: {
      ...post.user,
      isFollowing: post.user.isFollowing ?? false,
    },
    reactions: {
      likes: post.reactions.likes || 0,
      dislikes: post.reactions.dislikes || 0,
      shares: post.reactions.shares || 0,
      saves: post.reactions.saves || 0,
      comments: post.reactions.comments || 0,
    },
    views: post.views || 0,
    isPinned: post.isPinned || false,
    isBookmarked: post.isBookmarked || false,
  };
};

// Utility function to batch convert posts
export const convertPostsToExtended = (posts: Post[]): PostDataExtended[] => {
  return posts.map(post => convertToPostDataExtended(normalizePost(post)));
};

// Type guards
export const isPost = (obj: any): obj is Post => {
  return obj && typeof obj._id === 'string' && typeof obj.title === 'string';
};

export const isPostDataExtended = (obj: any): obj is PostDataExtended => {
  return obj && typeof obj._id === 'string' && typeof obj.reactions === 'object';
};

export const isInfinitePostsResponse = (obj: any): obj is InfinitePostsResponse => {
  return obj && 
         typeof obj.success === 'boolean' && 
         Array.isArray(obj.data) && 
         typeof obj.hasNextPage === 'boolean';
};

// Constants for infinite scroll
export const INFINITE_SCROLL_CONFIG = {
  INITIAL_LIMIT: 20,
  DEFAULT_LIMIT: 10,
  THRESHOLD: 800,
  ROOT_MARGIN: '200px',
  RETRY_ATTEMPTS: 3,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
} as const;

// Sort options for posts
export const POST_SORT_OPTIONS = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  VIEWS: 'views',
  LIKES: 'likes',
  RANDOM: 'random',
} as const;

export type PostSortOption = typeof POST_SORT_OPTIONS[keyof typeof POST_SORT_OPTIONS];

// Post interaction types
export type InteractionType = 'liked' | 'disliked' | 'saved' | 'viewed';
export type ReactionType = 'likes' | 'dislikes' | 'shares' | 'saves';

// Analytics interfaces (for future use)
export interface PostAnalytics {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgViewsPerPost: number;
  avgLikesPerPost: number;
  monthlyGrowth: number;
  chartData: Array<{
    date: string;
    posts: number;
    views: number;
    likes: number;
  }>;
}

export interface UserAnalyticsResponse {
  success: boolean;
  data: PostAnalytics;
}