// utils/postUtils.ts
// Utility functions for post data transformations

import { Post, PostDataExtended, PostActionsData } from "@/types/postTypes";

/**
 * Safely converts Post (API format) to PostDataExtended (component format)
 * Handles missing or undefined reaction values
 */
export const apiPostToExtended = (post: Post): PostDataExtended => {
  return {
    ...post,
    reactions: {
      like: post.reactions?.likes || 0,
      love: 0,
      laugh: 0,
      wow: 0,
      sad: 0,
      angry: post.reactions?.dislikes || 0,
    },
  };
};

/**
 * Safely converts PostDataExtended to PostActionsData
 * Only includes the minimal data that PostActions component needs
 */
export const extendedToActionsData = (post: PostDataExtended): PostActionsData => {
  return {
    _id: post._id,
    views: post.views || 0,
    reactions: {
      likes: post.reactions?.like || 0,
      dislikes: post.reactions?.angry || 0,
    },
    title: post.title,
    description: post.description,
  };
};

/**
 * Directly convert Post (API) to PostActionsData
 * Useful when you don't need the full extended format
 */
export const apiPostToActionsData = (post: Post): PostActionsData => {
  return {
    _id: post._id,
    views: post.views || 0,
    reactions: {
      likes: post.reactions?.likes || 0,
      dislikes: post.reactions?.dislikes || 0,
    },
    title: post.title,
    description: post.description,
  };
};

/**
 * Safe reaction access helper
 */
export const getReactionCount = (
  reactions: any, 
  type: 'likes' | 'dislikes' | 'like' | 'angry'
): number => {
  if (!reactions) return 0;
  return reactions[type] || 0;
};