// utils/postConversion.ts
import { PostActionsData } from "@/types/postActionsTypes";

/**
 * Safely converts PostDataExtended to PostActionsData
 * Handles undefined values and provides defaults
 */
export function convertToPostActionsData(post: any): PostActionsData {
  return {
    _id: post._id,
    views: post.views ?? 0, // Convert undefined to 0
    reactions: {
      likes: post.reactions?.likes ?? 0,
      dislikes: post.reactions?.dislikes ?? 0,
    },
    title: post.title,
    description: post.description,
  };
}

// Alternative: Type assertion with runtime safety check
export function safePostActionsData(post: any): PostActionsData {
  if (!post._id) {
    throw new Error('Post must have an _id');
  }
  
  return {
    ...post,
    views: post.views ?? 0,
    reactions: post.reactions ?? { likes: 0, dislikes: 0 },
  };
}