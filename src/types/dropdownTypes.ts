export type CopyStatus = "idle" | "copying" | "copied";
export type DropdownAction = "Edit" | "Pin" | "Unpin" | "Bookmark" | "Remove Bookmark" | "Copy Link" | "Delete" | "Block" | "Report";

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: DropdownAction;
  variant?: "default" | "danger";
  disabled?: boolean;
  dividerAfter?: boolean;
}

export interface PostDataExtended {
  _id: string;
  user: {
    _id: string;
    userName: string;
    fullName: string;
    profilepic?: string;
    isFollowing?: boolean;
  };
  content?: string;
  createdAt: string;
  updatedAt?: string;
  isPinned: boolean;
  isBookmarked: boolean;
  likes?: number;
  comments?: number;
  location?: string;
  views?: number;
  reactions?: {
    like: number;
    love: number;
    laugh: number;
    wow: number;
    sad: number;
    angry: number;
  };
}

export interface PostDropdownState {
  copyStatus: CopyStatus;
}

export interface PostDropdownProps {
  show: boolean;
  setShow: (show: boolean) => void;
  post: PostDataExtended;
  onDelete: () => void;
  onPin: () => void;
  onBookmark: () => void;
  pinPending: boolean;
  deletePending: boolean;
  bookmarkPending?: boolean;
  onEdit?: () => void;
  onBlock?: (userId: string) => void;
  onReport?: (postId: string) => void;
}