// types/index.ts

// User related types
export interface User {
  _id: string;
  fullName: string;
  userName: string;
  profilepic: string;
}

export interface DetailedUser {
  userId: string;
  username: string;
  displayName: string;
  email: string;
  contactNumber: string;
  bio?: string;
  location?: string;
  website?: string;
  UsersProfilePic: string;
  coverPhoto: string;
  isVerified: boolean;
  isOnline: boolean;
  joinDate: string;
  lastSeen: string;
  socialStats: SocialStats;
  profilePrivacy: ProfilePrivacy;
  customization: Customization;
  interests: string[];
  posts: Post[];
}

// Reactions interface
export interface Reactions {
  likes: number;
  dislikes?: number; // Optional since not all components use it
  shares: number;
  saves: number;
}

// Main Post interface (unified)
export interface Post {
  _id: string;
  id?: string; // Optional for backward compatibility
  title: string;
  body?: string; // Optional, maps to description
  description: string;
  timestamp?: string; // Optional, maps to createdAt
  reactions: Reactions;
  tags: string[];
  images: string[];
  videos: string[];
  location: string | null;
  views: number;
  isPinned: boolean;
  user: User;
  __v?: number; // Optional backend versioning field
  createdAt: string;
  updatedAt: string;
}

// Social stats interface
export interface SocialStats {
  followers: number;
  following: number;
  posts: number;
}

// Profile privacy interface
export interface ProfilePrivacy {
  profileVisibility: string;
  contactVisible: boolean;
  postsVisible: string;
}

// Customization interface
export interface Customization {
  theme: string;
  accentColor: string;
  backgroundType: string;
}

// Context types
export interface PostContextType {
  postList: Post[];
  fetching: boolean;
  addPost: (
    userId: string,
    postTitle: string,
    postDescription: string,
    reactions: Reactions,
    tags: string[],
    images?: string[],
    videos?: string[],
    location?: string | null,
    isPinned?: boolean
  ) => void;
  deletePost: (postId: string) => void;
}

export interface UserListContextType {
  fetching: boolean;
  getUserById: (id: string) => DetailedUser | undefined;
}

// Action types
export type PostAction =
  | { type: "DELETE_POST"; payload: { postId: string } }
  | { type: "ADD_POST"; payload: Post }
  | { type: "ADD_INITIAL_POST"; payload: { posts: Post[] } };

// Component props
export interface PostsProviderProps {
  children: React.ReactNode;
}

export type TabType = "posts" | "followers" | "about" | "activity" | "interests";