import { BaseUser } from './baseTypes';

export interface CommentUser extends BaseUser {
  username?: string; // Alternative field name for backwards compatibility
  email?: string;
}

export interface CommentReactions {
  likes: number;
}

export interface Comment {
  _id: string;
  id?: number;
  body: string;
  post: string;
  user: CommentUser;
  reactions: CommentReactions;
  timestamp?: string;
  createdAt: string;
  updatedAt: string;
  userHasLiked?: boolean;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    orderType?: string;
  };
  meta?: {
    orderingStrategy: string;
    description: string;
  };
}

// PostComments Component Props
export interface PostCommentsProps {
  showComments: boolean;
  postId: string;
}

// API Function Parameter Types
export interface FetchCommentsParams {
  postId: string;
  pageParam?: number;
  userId?: string;
}

export interface PostCommentParams {
  postId: string;
  body: string;
  userId: string;
}

export interface LikeCommentParams {
  commentId: string;
  userId: string;
}

// Hook Return Types
export interface CommentMutationContext {
  commentId: string;
  previousLike: boolean;
  previousData: any;
}

export interface CommentFormState {
  newComment: string;
  isPosting: boolean;
}

export interface CommentInteractionState {
  userLikes: Record<string, boolean>;
  processingLikes: Set<string>;
}