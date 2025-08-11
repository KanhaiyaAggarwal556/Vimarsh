// types.ts (Updated)
export interface SocialStats {
  followers: number;
  following: number;
  posts?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  bookmarks?: number;
  profileViews?: number; // Added for profile analytics
}

export interface Board {
  _id?: string;
  coverPhoto?: string;
  bio?: string;
  website?: string;
  socialStats: SocialStats;
  interests?: string[];
  bookmarks?: string[];
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  profilepic?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostReactions {
  likes: number;
  dislikes: number;
  shares: number;
  saves: number;
  comments?: number;
}

export interface post {
  likes: number;
  _id: string;
  title: string;
  description: string;
  images: string[];
  videos: string[];
  tags: string[];
  location?: string;
  reactions: PostReactions;
  views: number;
  isPinned: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData extends User {
  board: Board;
}

// Analytics interfaces
export interface ActivityData {
  date: string;
  posts: number;
  likes: number;
  views: number;
  comments?: number;
  shares?: number;
}

export interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgViewsPerPost: number;
  avgLikesPerPost: number;
  profileViews: number;
  monthlyGrowth: number;
  chartData: ActivityData[];
}

export interface UserStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
  totalBookmarks: number;
  averageLikesPerPost: number;
  mostLikedPost?: post;
  recentPosts: post[];
  engagementRate: number;
  monthlyGrowth: number;
}

// Backend Analytics Response (for API endpoint)
export interface AnalyticsResponse {
  success: boolean;
  data: {
    overview: {
      totalViews: number;
      totalLikes: number;
      totalComments: number;
      totalShares: number;
      totalPosts: number;
      profileViews: number;
    };
    averages: {
      avgViewsPerPost: number;
      avgLikesPerPost: number;
      avgCommentsPerPost: number;
      engagementRate: number;
    };
    growth: {
      monthlyViewsGrowth: number;
      monthlyLikesGrowth: number;
      monthlyFollowersGrowth: number;
    };
    timeline: ActivityData[];
    topPosts: post[];
  };
}