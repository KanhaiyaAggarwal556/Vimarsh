// FIXED: useAutoViewTracking.tsx

import { useEffect, useRef, useCallback } from 'react';
import { useViewTracking } from './usePostInteractions';
import useAuthStore from '@/store/useAuthStore';

interface UseAutoViewTrackingOptions {
  minViewDuration?: number;
  isVisible?: boolean;
  referralSource?: 'direct' | 'feed' | 'search' | 'profile' | 'notification' | 'share';
  enabled?: boolean;
}

// FIXED: Simplified auto view tracking - no localStorage, server handles all deduplication
export const useAutoViewTracking = (
  postId: string,
  options: UseAutoViewTrackingOptions = {}
) => {
  const {
    minViewDuration = 1000,
    isVisible = true,
    referralSource = 'direct',
    enabled = true,
  } = options;

  const { trackPostView } = useViewTracking();
  const { currentUser } = useAuthStore();
  const viewStartTimeRef = useRef<number | null>(null);
  const hasAttemptedTrackingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startViewTracking = useCallback(() => {
    if (!enabled || !postId || !currentUser || hasAttemptedTrackingRef.current) {
      return;
    }
    
    viewStartTimeRef.current = Date.now();
    
    // Set timeout to track view after minimum duration
    timeoutRef.current = setTimeout(() => {
      if (viewStartTimeRef.current && !hasAttemptedTrackingRef.current) {
        const viewDuration = Date.now() - viewStartTimeRef.current;
        
        console.log(`Auto-tracking view for post ${postId}`, {
          viewDuration: Math.floor(viewDuration / 1000),
          referralSource,
          userId: currentUser._id
        });
        
        // Let server handle deduplication
        trackPostView(postId, {
          viewDuration: Math.floor(viewDuration / 1000),
          referralSource,
        });
        
        hasAttemptedTrackingRef.current = true;
      }
    }, minViewDuration);
  }, [enabled, postId, minViewDuration, referralSource, trackPostView, currentUser]);

  const stopViewTracking = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    viewStartTimeRef.current = null;
  }, []);

  // Track when post becomes visible/invisible
  useEffect(() => {
    if (isVisible && enabled && currentUser) {
      startViewTracking();
    } else {
      stopViewTracking();
    }

    return stopViewTracking;
  }, [isVisible, enabled, currentUser, startViewTracking, stopViewTracking]);

  // Reset tracking state when user changes
  useEffect(() => {
    hasAttemptedTrackingRef.current = false;
    viewStartTimeRef.current = null;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [currentUser?._id, postId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopViewTracking();
    };
  }, [stopViewTracking]);

  return {
    hasAttemptedTracking: hasAttemptedTrackingRef.current,
    isTracking: viewStartTimeRef.current !== null,
  };
};

// FIXED: Intersection observer hook
export const useIntersectionViewTracking = (
  postId: string,
  options: UseAutoViewTrackingOptions & {
    threshold?: number;
    rootMargin?: string;
  } = {}
) => {
  const {
    minViewDuration = 1000,
    threshold = 0.5,
    rootMargin = '0px',
    referralSource = 'feed',
    enabled = true,
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const { trackPostView } = useViewTracking();
  const { currentUser } = useAuthStore();
  const viewStartTimeRef = useRef<number | null>(null);
  const hasAttemptedTrackingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startViewTracking = useCallback(() => {
    if (!enabled || !postId || !currentUser || hasAttemptedTrackingRef.current) {
      return;
    }
    
    viewStartTimeRef.current = Date.now();
    
    timeoutRef.current = setTimeout(() => {
      if (viewStartTimeRef.current && !hasAttemptedTrackingRef.current) {
        const viewDuration = Date.now() - viewStartTimeRef.current;
        
        console.log(`Intersection tracking view for post ${postId}`, {
          viewDuration: Math.floor(viewDuration / 1000),
          referralSource,
          userId: currentUser._id
        });
        
        trackPostView(postId, {
          viewDuration: Math.floor(viewDuration / 1000),
          referralSource,
        });
        
        hasAttemptedTrackingRef.current = true;
      }
    }, minViewDuration);
  }, [enabled, postId, minViewDuration, referralSource, trackPostView, currentUser]);

  const stopViewTracking = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    viewStartTimeRef.current = null;
  }, []);

  // Set up intersection observer
  useEffect(() => {
    if (!enabled || !elementRef.current || !currentUser) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startViewTracking();
          } else {
            stopViewTracking();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
      stopViewTracking();
    };
  }, [enabled, threshold, rootMargin, startViewTracking, stopViewTracking, postId, currentUser]);

  // Reset state on user/post change
  useEffect(() => {
    hasAttemptedTrackingRef.current = false;
    stopViewTracking();
  }, [currentUser?._id, postId, stopViewTracking]);

  return {
    ref: elementRef,
    hasAttemptedTracking: hasAttemptedTrackingRef.current,
    isTracking: viewStartTimeRef.current !== null,
  };
};

// FIXED: Manual tracking hook
export const useManualViewTracking = (postId: string) => {
  const { trackPostView } = useViewTracking();
  const { currentUser } = useAuthStore();

  const trackView = useCallback((
    options: {
      viewDuration?: number;
      referralSource?: 'direct' | 'feed' | 'search' | 'profile' | 'notification' | 'share';
    } = {}
  ) => {
    if (!currentUser) {
      console.log("Manual view tracking skipped - user not authenticated");
      return false;
    }

    console.log(`Manual tracking view for post ${postId}`, {
      options,
      userId: currentUser._id
    });

    // Let server handle all deduplication
    trackPostView(postId, options);
    return true;
  }, [postId, trackPostView, currentUser]);

  return { trackView };
};

// FIXED: Debug hook to check tracking state
export const useViewTrackingDebug = (postId: string) => {
  const { currentUser } = useAuthStore();

  return {
    postId,
    userId: currentUser?._id,
    isAuthenticated: !!currentUser,
    timestamp: new Date().toISOString(),
  };
};