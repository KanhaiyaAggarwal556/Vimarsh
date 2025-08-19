// hooks/usePullToRefresh.ts - Optimized with spinner UI and better mobile performance
import { useEffect, useCallback, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
  refreshing?: boolean;
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  canRefresh: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 60,
  resistance = 2.0,
  enabled = true,
  refreshing = false
}: UsePullToRefreshOptions) => {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
    canRefresh: false
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);

  // Check if device supports touch
  const isTouchDevice = useCallback(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Enhanced scroll position check
  const isAtTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    
    // Check multiple scroll positions for better accuracy
    const containerScrollTop = container.scrollTop;
    const documentScrollTop = document.documentElement.scrollTop;
    const bodyScrollTop = document.body.scrollTop;
    const windowScrollY = window.scrollY;
    
    // Allow small threshold for better UX
    const scrollThreshold = 2;
    
    return (
      containerScrollTop <= scrollThreshold &&
      documentScrollTop <= scrollThreshold &&
      bodyScrollTop <= scrollThreshold &&
      windowScrollY <= scrollThreshold
    );
  }, []);

  // Optimized update function with velocity tracking
  const updatePullDistance = useCallback((distance: number, velocity: number = 0) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      // Apply resistance curve for more natural feel
      const resistanceCurve = (dist: number) => {
        const base = dist / resistance;
        // Apply diminishing returns for smoother feel
        return base - (base * base) / (threshold * 2);
      };
      
      const adjustedDistance = Math.max(0, resistanceCurve(distance));
      const canRefresh = adjustedDistance >= threshold;
      
      // Store velocity for release calculations
      velocityRef.current = velocity;
      
      setState(prev => ({
        ...prev,
        pullDistance: adjustedDistance,
        canRefresh,
        isPulling: adjustedDistance > 0
      }));
    });
  }, [resistance, threshold]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || !isTouchDevice()) return;

    const touch = e.touches[0];
    if (!touch) return;

    startYRef.current = touch.clientY;
    currentYRef.current = startYRef.current;
    lastYRef.current = startYRef.current;
    lastTimeRef.current = Date.now();
    isActiveRef.current = false;
    velocityRef.current = 0;
  }, [enabled, isTouchDevice]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || refreshing) return;

    const touch = e.touches[0];
    if (!touch) return;

    const now = Date.now();
    const currentY = touch.clientY;
    const timeDiff = now - lastTimeRef.current;
    
    // Calculate velocity for smoother interactions
    if (timeDiff > 0) {
      velocityRef.current = (currentY - lastYRef.current) / timeDiff;
    }
    
    currentYRef.current = currentY;
    lastYRef.current = currentY;
    lastTimeRef.current = now;
    
    const diff = currentYRef.current - startYRef.current;

    // Only activate pull-to-refresh if we're pulling down and at the top
    if (diff > 8 && isAtTop()) {
      if (!isActiveRef.current) {
        isActiveRef.current = true;
        // Only prevent overscroll, don't disable all scrolling
        document.body.style.overscrollBehavior = 'none';
      }
      
      // Only prevent default for significant pull distances
      if (diff > 25) {
        e.preventDefault();
      }
      
      updatePullDistance(diff, velocityRef.current);
    } else if (diff <= 0) {
      // Reset if user starts scrolling up or scrolling normally
      if (isActiveRef.current) {
        isActiveRef.current = false;
        document.body.style.overscrollBehavior = '';
        updatePullDistance(0, 0);
      }
    } else if (diff > 0 && diff <= 8 && !isAtTop()) {
      // Allow normal scrolling when not at top
      if (isActiveRef.current) {
        isActiveRef.current = false;
        document.body.style.overscrollBehavior = '';
        updatePullDistance(0, 0);
      }
    }
  }, [enabled, refreshing, isAtTop, updatePullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isActiveRef.current) {
      document.body.style.overscrollBehavior = '';
      return;
    }

    const wasCanRefresh = state.canRefresh;
    const velocity = velocityRef.current;
    
    isActiveRef.current = false;
    document.body.style.overscrollBehavior = '';
    
    // Consider velocity for better UX - if user has high downward velocity, trigger refresh even if slightly under threshold
    const velocityBoost = velocity > 0.5 ? 10 : 0;
    const effectiveDistance = state.pullDistance + velocityBoost;
    
    if ((wasCanRefresh || effectiveDistance >= threshold * 0.8) && !refreshing) {
      setState(prev => ({ 
        ...prev, 
        isRefreshing: true,
        isPulling: false,
        pullDistance: threshold // Keep at threshold during refresh
      }));
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        // Reset state after refresh with smooth animation
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            isPulling: false,
            pullDistance: 0,
            isRefreshing: false,
            canRefresh: false
          }));
        }, 300);
      }
    } else {
      // Animate back to original position with elastic effect
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false
      }));
    }
  }, [enabled, state.canRefresh, state.pullDistance, refreshing, onRefresh, threshold]);

  // Improved event listener setup with better passive/active handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled || !isTouchDevice()) return;

    // Use passive for all events initially, only prevent default when necessary
    const passiveOptions: AddEventListenerOptions = { passive: true };
    // Only use active for touchmove when we actually need to prevent default
    const conditionalActiveOptions: AddEventListenerOptions = { passive: false };

    container.addEventListener('touchstart', handleTouchStart, passiveOptions);
    // Use passive for touchmove initially - we'll handle preventDefault conditionally
    container.addEventListener('touchmove', handleTouchMove, conditionalActiveOptions);
    container.addEventListener('touchend', handleTouchEnd, passiveOptions);
    container.addEventListener('touchcancel', handleTouchEnd, passiveOptions);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      
      // Cleanup any body styles
      document.body.style.overscrollBehavior = '';
    };
  }, [enabled, isTouchDevice, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Reset state when refreshing prop changes
  useEffect(() => {
    if (!refreshing && state.isRefreshing) {
      setState(prev => ({
        ...prev,
        isRefreshing: false,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false
      }));
    }
  }, [refreshing, state.isRefreshing]);

  // Cleanup animation frame and body styles on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.overscrollBehavior = '';
    };
  }, []);

  return {
    containerRef,
    ...state,
    threshold,
    isEnabled: enabled && isTouchDevice()
  };
};