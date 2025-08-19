// Updated types/postActionsTypes.ts
export interface PostActionsData {
  _id: string;
  views?: number; // Made optional to match PostDataExtended
  reactions?: {   // Made optional to handle cases where reactions might be undefined
    likes: number;
    dislikes: number;
  };
  title?: string;
  description?: string;
}

export interface PostActionsProps {
  post: PostActionsData;
  onPostUpdate?: (updatedPost: PostActionsData) => void;
  onComments: () => void;
  isOnPostPage?: boolean;
  referralSource?: 'direct' | 'feed' | 'search' | 'profile' | 'notification' | 'share';
  enableViewTracking?: boolean;
}

export interface ActionButtonProps {
  icon: React.ReactNode;
  count?: number;
  active?: boolean;
  onClick: (e?: React.MouseEvent) => void;
  label: string;
  showText?: boolean;
  text?: string;
  variant?: "default" | "like" | "dislike" | "share";
  loading?: boolean;
}

export interface UserInteractionData {
  liked: boolean;
  disliked: boolean;
  saved?: boolean;
  bookmarked?: boolean;
}

export interface PostActionsState {
  reactions: {
    likes: number;
    dislikes: number;
  };
  viewCount: number;
  isShareLoading: boolean;
}