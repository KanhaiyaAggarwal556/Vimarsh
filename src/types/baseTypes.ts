export interface BaseUser {
  _id: string;
  fullName: string;
  userName: string;
  profilepic: string;
}

export interface BaseReactions {
  likes: number;
  dislikes: number;
}

// Utility types
export type CopyStatus = "idle" | "copying" | "copied";
export type ReactionType = "likes" | "dislikes" | "shares" | "saves";
export type ReactionAction = "increment" | "decrement";