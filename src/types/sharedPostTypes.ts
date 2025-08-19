// types/sharedPostTypes.ts
// This file ensures type consistency across all components

export interface PostUser {
  _id: string;
  userName: string;
  fullName: string;
  profilepic?: string;
  isFollowing: boolean;
}

export interface PostReactions {
  likes: number;
  dislikes: number;
  shares: number;
  saves: number;
}

export interface PostDataShared {
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
}

export interface PostsResponse {
  success: boolean;
  data: PostDataShared[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Handler function types
export type PostDeleteHandler = (postId: string) => Promise<void>;
export type PostPinHandler = (postId: string) => Promise<void>;
export type PostBookmarkHandler = (postId: string) => Promise<void>;
export type UserFollowHandler = (userId: string) => Promise<void>;
export type PostReactionHandler = (
  postId: string,
  type: "likes" | "dislikes" | "shares" | "saves",
  action: "increment" | "decrement"
) => Promise<void>;

// Props interface for components that need all handlers
export interface PostHandlersProps {
  onDelete?: PostDeleteHandler;
  onTogglePin?: PostPinHandler;
  onToggleBookmark?: PostBookmarkHandler;
  onToggleFollow?: UserFollowHandler;
  onReactionUpdate?: PostReactionHandler;
}