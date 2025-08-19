// hooks/useInfiniteScroll.ts - Enhanced with better smoothness
import { useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  debounceMs?: number;
}

export const useInfiniteScroll = ({
  loading,
  hasNextPage,
  onLoadMore,
  threshold = 1000,
  rootMargin = '200px',
  enabled = true,
  debounceMs = 200, // Reduced for better responsiveness
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const lastTriggerTimeRef = useRef<number>(0);
  const observerRef = useRef<IntersectionObserver>();
  const rafRef = useRef<number>();

  // Optimized debounced load more function
  const debouncedLoadMore = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const now = Date.now();
      
      if (now - lastTriggerTimeRef.current < debounceMs) {
        return;
      }

      if (!enabled || !hasNextPage || loading) {
        return;
      }

      lastTriggerTimeRef.current = now;
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      onLoadMore();
      
      // Shorter cooldown for better UX
      loadingTimeoutRef.current = setTimeout(() => {
        // Cooldown complete
      }, debounceMs);
    });
  }, [enabled, hasNextPage, loading, onLoadMore, debounceMs]);

  // Enhanced scroll-based detection with smooth calculation
  const handleScroll = useCallback(() => {
    if (!enabled || loading || !hasNextPage) {
      return;
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;

      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom < threshold) {
        debouncedLoadMore();
      }
    });
  }, [enabled, loading, hasNextPage, threshold, debouncedLoadMore]);

  // Enhanced Intersection Observer setup
  useEffect(() => {
    if (!enabled || !sentinelRef.current) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const sentinel = sentinelRef.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage && !loading && enabled) {
            debouncedLoadMore();
          }
        });
      },
      {
        rootMargin,
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1], // More granular thresholds
      }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, hasNextPage, loading, rootMargin, debouncedLoadMore]);

  // Optimized scroll event listener with passive scrolling
  useEffect(() => {
    if (!enabled) return;

    let ticking = false;
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    const throttledScroll = () => {
      requestTick();
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, handleScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    sentinelRef,
    isLoading: loading,
    triggerLoadMore: debouncedLoadMore,
    resetCooldown: () => {
      lastTriggerTimeRef.current = 0;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    }
  };
};