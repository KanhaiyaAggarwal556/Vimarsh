// hooks/useDoubleTapHome.ts - Fixed double-tap functionality
import { useCallback, useRef } from 'react';

interface UseDoubleTapHomeOptions {
  onRefresh?: () => Promise<void>;
  doubleTapDelay?: number;
  scrollContainer?: string;
}

interface UseDoubleTapHomeReturn {
  handleHomeTap: () => Promise<void>;
  cleanup: () => void;
}

export const useDoubleTapHome = ({
  onRefresh,
  doubleTapDelay = 400,
  scrollContainer = '.posts-container'
}: UseDoubleTapHomeOptions = {}): UseDoubleTapHomeReturn => {
  const lastTapTimeRef = useRef<number>(0);
  const tapCountRef = useRef(0);
  const isRefreshingRef = useRef(false);
  const resetTimerRef = useRef<NodeJS.Timeout>();

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    const container = document.querySelector(scrollContainer) as HTMLElement;
    
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [scrollContainer]);

  // Handle home tap with improved double-tap detection
  const handleHomeTap = useCallback(async (): Promise<void> => {
    // Prevent multiple rapid taps during refresh
    if (isRefreshingRef.current) return;

    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTimeRef.current;
    
    // Clear any existing reset timer
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    // If this tap is within the double-tap window
    if (timeSinceLastTap < doubleTapDelay) {
      tapCountRef.current += 1;
      
      // Double tap detected
      if (tapCountRef.current >= 2) {
        console.log('Double tap detected - refreshing');
        tapCountRef.current = 0;
        lastTapTimeRef.current = 0;
        
        if (onRefresh) {
          isRefreshingRef.current = true;
          
          try {
            await onRefresh();
            // Scroll to top after successful refresh
            setTimeout(() => scrollToTop(), 100);
          } catch (error) {
            console.error('Home refresh failed:', error);
            // Still scroll to top on error
            scrollToTop();
          } finally {
            setTimeout(() => {
              isRefreshingRef.current = false;
            }, 1000);
          }
        } else {
          // No refresh function, just scroll to top
          scrollToTop();
        }
        return;
      }
    } else {
      // Reset tap count for new tap sequence
      tapCountRef.current = 1;
    }

    // Update last tap time
    lastTapTimeRef.current = currentTime;
    
    // Single tap - scroll to top immediately
    scrollToTop();
    
    // Set timer to reset tap count after delay
    resetTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
      lastTapTimeRef.current = 0;
    }, doubleTapDelay);
    
  }, [onRefresh, doubleTapDelay, scrollToTop]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = undefined;
    }
    tapCountRef.current = 0;
    lastTapTimeRef.current = 0;
    isRefreshingRef.current = false;
  }, []);

  return {
    handleHomeTap,
    cleanup
  };
};