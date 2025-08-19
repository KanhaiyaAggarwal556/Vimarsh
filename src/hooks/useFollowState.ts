// hooks/useFollowState.ts
import { useState, useCallback } from 'react';

// Local state management for follow status
// This persists the follow state until the component unmounts or page reloads
const followStateMap = new Map<string, boolean>();

export const useFollowState = () => {
  const [pendingFollows, setPendingFollows] = useState<Set<string>>(new Set());

  // Get the current follow state for a user
  const getFollowState = useCallback((userId: string, originalState: boolean) => {
    // Return local state if it exists, otherwise return original state
    return followStateMap.has(userId) ? followStateMap.get(userId)! : originalState;
  }, []);

  // Toggle follow state
  const toggleFollow = useCallback(async (userId: string, originalState: boolean) => {
    // Set loading state
    setPendingFollows(prev => new Set(prev).add(userId));

    try {
      // Get current state (local or original)
      const currentState = getFollowState(userId, originalState);
      const newState = !currentState;

      // Update local state immediately
      followStateMap.set(userId, newState);

      console.log(`🔄 Toggling follow for ${userId}: ${currentState} -> ${newState}`);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log(`✅ Follow toggle completed for ${userId}`);

      return { success: true, newState };
    } catch (error) {
      // Revert local state on error
      followStateMap.delete(userId);
      console.error(`❌ Follow toggle failed for ${userId}:`, error);
      throw error;
    } finally {
      // Remove loading state
      setPendingFollows(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }, [getFollowState]);

  // Check if a follow operation is pending
  const isFollowPending = useCallback((userId: string) => {
    return pendingFollows.has(userId);
  }, [pendingFollows]);

  // Clear local state for a user (useful for testing or resetting)
  const clearFollowState = useCallback((userId: string) => {
    followStateMap.delete(userId);
  }, []);

  // Clear all local state (useful for logout)
  const clearAllFollowState = useCallback(() => {
    followStateMap.clear();
    setPendingFollows(new Set());
  }, []);

  return {
    getFollowState,
    toggleFollow,
    isFollowPending,
    clearFollowState,
    clearAllFollowState,
  };
};