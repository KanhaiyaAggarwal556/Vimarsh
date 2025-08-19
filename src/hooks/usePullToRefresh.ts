// hooks/usePullToRefresh.ts - Mobile-only production version
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
  threshold = 80,
  resistance = 2.5,
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

  // Check if device supports touch
  const isTouchDevice = useCallback(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Check if we're at the top of the page
  const isAtTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    
    const containerAtTop = container.scrollTop <= 5;
    const windowAtTop = window.scrollY <= 5;
    const documentAtTop = document.documentElement.scrollTop <= 5;
    
    return containerAtTop && windowAtTop && documentAtTop;
  }, []);

  const updatePullDistance = useCallback((distance: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const adjustedDistance = Math.max(0, distance / resistance);
      const canRefresh = adjustedDistance >= threshold;
      
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
    isActiveRef.current = false;
  }, [enabled, isTouchDevice]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || refreshing) return;

    const touch = e.touches[0];
    if (!touch) return;

    currentYRef.current = touch.clientY;
    const diff = currentYRef.current - startYRef.current;

    // Only activate pull-to-refresh if we're pulling down and at the top
    if (diff > 10 && isAtTop()) {
      if (!isActiveRef.current) {
        isActiveRef.current = true;
      }
      
      // Prevent default scrolling when pulling
      if (diff > 20) {
        e.preventDefault();
      }
      
      updatePullDistance(diff);
    } else if (diff <= 0) {
      // Reset if user starts scrolling up
      isActiveRef.current = false;
      updatePullDistance(0);
    }
  }, [enabled, refreshing, isAtTop, updatePullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isActiveRef.current) return;

    const wasCanRefresh = state.canRefresh;
    isActiveRef.current = false;
    
    if (wasCanRefresh && !refreshing) {
      setState(prev => ({ ...prev, isRefreshing: true }));
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        // Reset state after refresh
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
      // Animate back to original position
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false
      }));
    }
  }, [enabled, state.canRefresh, refreshing, onRefresh]);

  // Set up touch event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled || !isTouchDevice()) return;

    const passiveOptions: AddEventListenerOptions = { passive: true };
    const activeOptions: AddEventListenerOptions = { passive: false };

    container.addEventListener('touchstart', handleTouchStart, passiveOptions);
    container.addEventListener('touchmove', handleTouchMove, activeOptions);
    container.addEventListener('touchend', handleTouchEnd, passiveOptions);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
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

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    ...state,
    threshold,
    isEnabled: enabled && isTouchDevice()
  };
};