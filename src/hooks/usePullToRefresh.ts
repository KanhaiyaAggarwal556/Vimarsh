// hooks/usePullToRefresh.ts - Fixed version with better mobile support
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
  const scrollStartRef = useRef<number>(0);

  // Enhanced mobile/touch device detection
  const isTouchDevice = useCallback(() => {
    return (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }, []);

  // Fixed scroll position check - use the actual scrolling container
  const isAtTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    
    // Get the posts-container (the actual scrolling container)
    const scrollingContainer = container.closest('.posts-container') as HTMLElement;
    if (scrollingContainer) {
      return scrollingContainer.scrollTop <= 5;
    }
    
    // Fallback to container itself
    return container.scrollTop <= 5;
  }, []);

  // Optimized update function with better mobile handling
  const updatePullDistance = useCallback((distance: number, velocity: number = 0) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      // Enhanced resistance curve for natural mobile feel
      const resistanceCurve = (dist: number) => {
        const base = dist / resistance;
        const dampening = isTouchDevice() ? 1.3 : 1.0;
        return base - (base * base * dampening) / (threshold * 2.5);
      };
      
      const adjustedDistance = Math.max(0, resistanceCurve(distance));
      const canRefresh = adjustedDistance >= threshold;
      
      velocityRef.current = velocity;
      
      // Better minimum visibility on mobile
      const minVisibleDistance = isTouchDevice() && distance > 10 ? 8 : 0;
      const finalDistance = Math.max(adjustedDistance, distance > 0 ? minVisibleDistance : 0);
      
      setState(prev => ({
        ...prev,
        pullDistance: finalDistance,
        canRefresh,
        isPulling: finalDistance > 0
      }));
    });
  }, [resistance, threshold, isTouchDevice]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || !isTouchDevice() || refreshing) return;

    const touch = e.touches[0];
    if (!touch) return;

    // Store initial positions
    startYRef.current = touch.clientY;
    currentYRef.current = startYRef.current;
    lastYRef.current = startYRef.current;
    lastTimeRef.current = Date.now();
    isActiveRef.current = false;
    velocityRef.current = 0;

    // Store initial scroll position
    const container = containerRef.current?.closest('.posts-container') as HTMLElement;
    scrollStartRef.current = container ? container.scrollTop : 0;
  }, [enabled, isTouchDevice, refreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || refreshing) return;

    const touch = e.touches[0];
    if (!touch) return;

    const now = Date.now();
    const currentY = touch.clientY;
    const timeDiff = now - lastTimeRef.current;
    
    // Calculate velocity
    if (timeDiff > 0) {
      velocityRef.current = (currentY - lastYRef.current) / timeDiff;
    }
    
    currentYRef.current = currentY;
    lastYRef.current = currentY;
    lastTimeRef.current = now;
    
    const diff = currentYRef.current - startYRef.current;

    // Check if we're pulling down and at top
    const isPullingDown = diff > 10;
    const isAtTopPosition = isAtTop();
    
    // Additional check: ensure we started the pull from the top
    const startedFromTop = scrollStartRef.current <= 5;

    if (isPullingDown && isAtTopPosition && startedFromTop) {
      if (!isActiveRef.current) {
        isActiveRef.current = true;
        
        // Prevent body scroll more aggressively
        if (isTouchDevice()) {
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
        }
      }
      
      // Prevent default scrolling when pulling
      if (diff > 15) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      updatePullDistance(diff, velocityRef.current);
    } else if (diff <= 0 || !isAtTopPosition || !startedFromTop) {
      // Reset if conditions not met
      if (isActiveRef.current) {
        isActiveRef.current = false;
        
        // Restore body scroll
        if (isTouchDevice()) {
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
        }
        
        updatePullDistance(0, 0);
      }
    }
  }, [enabled, refreshing, isAtTop, updatePullDistance, isTouchDevice]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled) {
      // Restore body scroll
      if (isTouchDevice()) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
      return;
    }

    const wasActive = isActiveRef.current;
    const wasCanRefresh = state.canRefresh;
    const velocity = velocityRef.current;
    
    isActiveRef.current = false;
    
    // Restore body scroll
    if (isTouchDevice()) {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    // Enhanced refresh trigger with velocity consideration
    const velocityBoost = velocity > (isTouchDevice() ? 0.4 : 0.6) ? 20 : 0;
    const effectiveDistance = state.pullDistance + velocityBoost;
    const refreshThreshold = isTouchDevice() ? threshold * 0.6 : threshold * 0.8;
    
    if ((wasCanRefresh || effectiveDistance >= refreshThreshold) && !refreshing && wasActive) {
      setState(prev => ({ 
        ...prev, 
        isRefreshing: true,
        isPulling: false,
        pullDistance: threshold * 0.8 // Keep some distance during refresh
      }));
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        // Reset state after refresh with delay
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            isPulling: false,
            pullDistance: 0,
            isRefreshing: false,
            canRefresh: false
          }));
        }, 400);
      }
    } else if (wasActive) {
      // Animate back to original position
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false
      }));
    }
  }, [enabled, state.canRefresh, state.pullDistance, refreshing, onRefresh, threshold, isTouchDevice]);

  // Enhanced event listener setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled || !isTouchDevice()) {
      return;
    }

    // Add event listeners to the container
    const passiveOptions: AddEventListenerOptions = { passive: true };
    const activeOptions: AddEventListenerOptions = { passive: false };

    container.addEventListener('touchstart', handleTouchStart, passiveOptions);
    container.addEventListener('touchmove', handleTouchMove, activeOptions);
    container.addEventListener('touchend', handleTouchEnd, passiveOptions);
    container.addEventListener('touchcancel', handleTouchEnd, passiveOptions);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      
      // Cleanup body styles
      if (isTouchDevice()) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Restore body styles on unmount
      if (isTouchDevice()) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    };
  }, [isTouchDevice]);

  return {
    containerRef,
    ...state,
    threshold,
    isEnabled: enabled && isTouchDevice()
  };
};