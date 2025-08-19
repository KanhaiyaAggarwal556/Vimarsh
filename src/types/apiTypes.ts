// types/apiTypes.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
  meta?: Record<string, any>;
}

// Post-specific types
export interface MutationContext<T = any> {
  previousPosts: T;
  userId?: string;
}

export type ReactionType = 'likes' | 'dislikes' | 'shares' | 'saves';
export type ReactionAction = 'increment' | 'decrement';

export interface ReactionPayload {
  postId: string;
  type: ReactionType;
  action: ReactionAction;
}

export interface PostReactions {
  likes: number;
  dislikes: number;
  shares: number;
  saves: number;
}

export interface User {
  _id: string;
  name: string;
  avatar?: string;
  isFollowing: boolean;
}

export interface Post {
  _id: string;
  user: User;
  content: string;
  reactions: PostReactions;
  isPinned: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Use the standard PaginatedResponse for posts
export type PostsResponse = PaginatedResponse<Post>;