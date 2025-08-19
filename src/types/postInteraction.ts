// types/postInteraction.ts
export interface PostInteraction {
  liked: boolean;
  disliked: boolean;
  saved: boolean;
  viewed: boolean;
  viewCount?: number;
  totalViewDuration?: number;
  error?: string;
}

export interface PostInteractionResponse {
  success: boolean;
  message: string;
  data: PostInteraction & {
    post?: {
      _id: string;
      likes: number;
      dislikes: number;
    };
  };
}

export interface BatchInteractionResponse {
  [postId: string]: PostInteraction;
}

// NEW: View tracking specific types
export interface ViewTrackingResponse {
  success: boolean;
  message: string;
  data: {
    viewAdded: boolean;
    totalViews: number;
    userViewCount: number;
  };
}

export interface ViewTrackingOptions {
  viewDuration?: number;
  referralSource?: 'direct' | 'feed' | 'search' | 'profile' | 'notification' | 'share';
}

export interface BatchViewTrackingRequest {
  postViews: Array<{
    postId: string;
    viewDuration?: number;
  }>;
}

export interface BatchViewTrackingResponse {
  success: boolean;
  message: string;
  data: {
    results: Array<{
      postId: string;
      viewAdded: boolean;
      reason?: string;
    }>;
    totalProcessed: number;
  };
}