// hooks/useScrollDirection.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number;
  hideDelay?: number;
  showDelay?: number;
  containerRef?: React.RefObject<HTMLElement>;
}

interface UseScrollDirectionReturn {
  isVisible: boolean;
  scrollDirection: 'up' | 'down' | null;
  scrollY: number;
  isAtTop: boolean;
}

export const useScrollDirection = ({
  threshold = 10,
  hideDelay = 100,
  showDelay = 50,
  containerRef
}: UseScrollDirectionOptions = {}): UseScrollDirectionReturn => {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const showTimeoutRef = useRef<NodeJS.Timeout>();

  const updateScrollDirection = useCallback(() => {
    const element = containerRef?.current || window;
    const currentScrollY = containerRef?.current 
      ? containerRef.current.scrollTop 
      : window.pageYOffset || document.documentElement.scrollTop;

    setScrollY(currentScrollY);
    setIsAtTop(currentScrollY < 10);

    const scrollDelta = currentScrollY - lastScrollY.current;

    // Clear existing timeouts
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }

    // Determine scroll direction
    if (Math.abs(scrollDelta) > threshold) {
      if (scrollDelta > 0) {
        // Scrolling down
        setScrollDirection('down');
        
        // Hide header with delay only if not at top
        if (currentScrollY > 100) {
          hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, hideDelay);
        }
      } else {
        // Scrolling up
        setScrollDirection('up');
        
        // Show header immediately on upward scroll
        showTimeoutRef.current = setTimeout(() => {
          setIsVisible(true);
        }, showDelay);
      }
      
      lastScrollY.current = currentScrollY;
    }

    // Always show header when at top
    if (currentScrollY <= 10) {
      setIsVisible(true);
    }

    ticking.current = false;
  }, [threshold, hideDelay, showDelay, containerRef]);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateScrollDirection);
      ticking.current = true;
    }
  }, [updateScrollDirection]);

  useEffect(() => {
    const element = containerRef?.current || window;
    
    // Set initial scroll position
    const initialScrollY = containerRef?.current 
      ? containerRef.current.scrollTop 
      : window.pageYOffset || document.documentElement.scrollTop;
    
    setScrollY(initialScrollY);
    setIsAtTop(initialScrollY < 10);
    lastScrollY.current = initialScrollY;

    // Add event listener
    if (containerRef?.current) {
      containerRef.current.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      // Cleanup
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }

      // Remove event listener
      if (containerRef?.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll, containerRef]);

  // Reset visibility when scroll position is at top
  useEffect(() => {
    if (isAtTop) {
      setIsVisible(true);
    }
  }, [isAtTop]);

  return {
    isVisible,
    scrollDirection,
    scrollY,
    isAtTop
  };
};