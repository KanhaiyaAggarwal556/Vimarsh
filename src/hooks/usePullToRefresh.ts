// hooks/usePullToRefresh.ts - Enhanced with visual pull-to-refresh indicators
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
  showIndicator: boolean;
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
    canRefresh: false,
    showIndicator: false
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(false);
  const velocityRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);
  const initialScrollRef = useRef<number>(0);
  const hasRefreshedRef = useRef<boolean>(false);

  // Enhanced mobile detection
  const isTouchDevice = useCallback(() => {
    return (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }, []);

  // Check if at top of scroll
  const isAtTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    
    const scrollingContainer = container.closest('.posts-container') as HTMLElement;
    if (scrollingContainer) {
      return scrollingContainer.scrollTop <= 5;
    }
    
    return container.scrollTop <= 5;
  }, []);

  // Enhanced update function with visual feedback
  const updatePullDistance = useCallback((distance: number, velocity: number = 0) => {
    const adjustedDistance = Math.max(0, distance / resistance);
    const canRefresh = adjustedDistance >= threshold;
    const showIndicator = adjustedDistance > 20; // Show indicator after 20px pull
    
    velocityRef.current = velocity;
    
    setState(prev => ({
      ...prev,
      pullDistance: adjustedDistance,
      canRefresh,
      isPulling: adjustedDistance > 0,
      showIndicator
    }));
  }, [resistance, threshold]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || !isTouchDevice() || refreshing) return;

    const touch = e.touches[0];
    if (!touch) return;

    startYRef.current = touch.clientY;
    currentYRef.current = startYRef.current;
    lastYRef.current = startYRef.current;
    lastTimeRef.current = Date.now();
    isActiveRef.current = false;
    velocityRef.current = 0;
    hasRefreshedRef.current = false;

    const container = containerRef.current?.closest('.posts-container') as HTMLElement;
    initialScrollRef.current = container ? container.scrollTop : 0;
  }, [enabled, isTouchDevice, refreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || refreshing || hasRefreshedRef.current) return;

    const touch = e.touches[0];
    if (!touch) return;

    const now = Date.now();
    const currentY = touch.clientY;
    const timeDiff = now - lastTimeRef.current;
    
    if (timeDiff > 0) {
      const newVelocity = (currentY - lastYRef.current) / timeDiff;
      velocityRef.current = newVelocity * 0.5 + velocityRef.current * 0.5;
    }
    
    currentYRef.current = currentY;
    lastYRef.current = currentY;
    lastTimeRef.current = now;
    
    const diff = currentYRef.current - startYRef.current;
    const isPullingDown = diff > 10;
    const isAtTopPosition = isAtTop();
    const startedFromTop = initialScrollRef.current <= 5;

    if (isPullingDown && isAtTopPosition && startedFromTop) {
      if (!isActiveRef.current) {
        isActiveRef.current = true;
      }
      
      // Prevent default scrolling when pulling
      if (diff > 15) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      updatePullDistance(diff, velocityRef.current);
    } else if (diff <= 0 || !isAtTopPosition) {
      if (isActiveRef.current) {
        isActiveRef.current = false;
        updatePullDistance(0, 0);
      }
    }
  }, [enabled, refreshing, isAtTop, updatePullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled) return;

    isActiveRef.current = false;
    
    // Check if should trigger refresh
    if (state.canRefresh && !hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      
      // Set refreshing state
      setState(prev => ({ 
        ...prev, 
        isRefreshing: true,
        isPulling: false,
        showIndicator: true,
        pullDistance: threshold // Keep indicator at threshold level during refresh
      }));
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        // Smooth hide animation
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            isPulling: false,
            pullDistance: 0,
            isRefreshing: false,
            canRefresh: false,
            showIndicator: false
          }));
        }, 300);
      }
    } else {
      // Quick reset with animation
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false,
        showIndicator: false
      }));
    }
  }, [enabled, state.canRefresh, onRefresh, threshold]);

  // Event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled || !isTouchDevice()) {
      return;
    }

    const passiveOptions: AddEventListenerOptions = { passive: true };
    const activeOptions: AddEventListenerOptions = { passive: false, capture: true };

    container.addEventListener('touchstart', handleTouchStart, passiveOptions);
    container.addEventListener('touchmove', handleTouchMove, activeOptions);
    container.addEventListener('touchend', handleTouchEnd, passiveOptions);
    container.addEventListener('touchcancel', handleTouchEnd, passiveOptions);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [enabled, isTouchDevice, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Auto-reset when refreshing prop changes
  useEffect(() => {
    if (!refreshing && state.isRefreshing) {
      setState(prev => ({
        ...prev,
        isRefreshing: false,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false,
        showIndicator: false
      }));
    }
  }, [refreshing, state.isRefreshing]);

  return {
    containerRef,
    ...state,
    threshold,
    isEnabled: enabled && isTouchDevice(),
    // Calculate progress for smooth animations
    progress: Math.min(state.pullDistance / threshold, 1),
    // Calculate transform for posts container
    postsTransform: state.showIndicator ? Math.min(state.pullDistance, threshold) : 0
  };
};