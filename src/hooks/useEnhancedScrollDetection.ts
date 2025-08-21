// useEnhancedScrollDetection.ts - Enhanced scroll detection for compact header
import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollState {
  isScrolled: boolean;
  scrollY: number;
  scrollDirection: 'up' | 'down' | 'none';
  isScrollingFast: boolean;
  hasScrolledPast: (threshold: number) => boolean;
}

interface UseEnhancedScrollDetectionOptions {
  threshold?: number;
  container?: HTMLElement | null;
  fastScrollThreshold?: number;
  debounceMs?: number;
}

export const useEnhancedScrollDetection = (options: UseEnhancedScrollDetectionOptions = {}): ScrollState => {
  const {
    threshold = 50,
    container = null,
    fastScrollThreshold = 10,
    debounceMs = 16, // ~60fps
  } = options;

  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrolled: false,
    scrollY: 0,
    scrollDirection: 'none',
    isScrollingFast: false,
    hasScrolledPast: (threshold: number) => false,
  });

  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculateScrollState = useCallback((currentScrollY: number): ScrollState => {
    const now = Date.now();
    const timeDiff = now - lastScrollTime.current;
    const scrollDiff = Math.abs(currentScrollY - lastScrollY.current);
    
    // Ensure scrollY is never undefined
    const safeScrollY = Math.max(0, currentScrollY || 0);
    
    // Calculate scroll direction
    let direction: 'up' | 'down' | 'none' = 'none';
    if (safeScrollY > lastScrollY.current) {
      direction = 'down';
    } else if (safeScrollY < lastScrollY.current) {
      direction = 'up';
    }

    // Calculate if scrolling fast
    const scrollSpeed = timeDiff > 0 ? scrollDiff / timeDiff : 0;
    const isScrollingFast = scrollSpeed > fastScrollThreshold;

    // Update refs
    lastScrollY.current = safeScrollY;
    lastScrollTime.current = now;

    return {
      isScrolled: safeScrollY > threshold,
      scrollY: safeScrollY,
      scrollDirection: direction,
      isScrollingFast,
      hasScrolledPast: (checkThreshold: number) => safeScrollY > checkThreshold,
    };
  }, [threshold, fastScrollThreshold]);

  const handleScroll = useCallback(() => {
    const scrollElement = container || document.documentElement;
    const currentScrollY = Math.max(0, container ? container.scrollTop : window.pageYOffset || 0);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce scroll updates
    timeoutRef.current = setTimeout(() => {
      const newState = calculateScrollState(currentScrollY);
      setScrollState(newState);
    }, debounceMs);

    // Immediate update for threshold crossing
    const wasScrolled = scrollState.isScrolled;
    const isNowScrolled = currentScrollY > threshold;
    
    if (wasScrolled !== isNowScrolled) {
      const immediateState = calculateScrollState(currentScrollY);
      setScrollState(immediateState);
    }
  }, [container, calculateScrollState, debounceMs, threshold, scrollState.isScrolled]);

  useEffect(() => {
    const scrollElement = container || window;
    const eventOptions = { passive: true };

    // Add scroll listener
    scrollElement.addEventListener('scroll', handleScroll, eventOptions);

    // Initial calculation
    const initialScrollY = Math.max(0, container ? container.scrollTop : window.pageYOffset || 0);
    const initialState = calculateScrollState(initialScrollY);
    setScrollState(initialState);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [container, handleScroll, calculateScrollState]);

  return scrollState;
};

// Alternative hook for simple use cases (backwards compatible)
export const useScrollDetection = (threshold: number = 50, container?: HTMLElement | null): boolean => {
  const { isScrolled } = useEnhancedScrollDetection({ threshold, container });
  return isScrolled;
};