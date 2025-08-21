// hooks/usePullToRefresh.ts - Ultra-smooth and responsive version
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
  threshold = 45, // Much lower threshold for easier triggering
  resistance = 1.5, // Less resistance for smoother feel
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
  const initialScrollRef = useRef<number>(0);

  // Enhanced mobile detection
  const isTouchDevice = useCallback(() => {
    return (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }, []);

  // Much more lenient scroll position check
  const isAtTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    
    // Check the actual scrolling container
    const scrollingContainer = container.closest('.posts-container') as HTMLElement;
    if (scrollingContainer) {
      return scrollingContainer.scrollTop <= 10; // More lenient
    }
    
    return container.scrollTop <= 10;
  }, []);

  // Ultra-smooth update function
  const updatePullDistance = useCallback((distance: number, velocity: number = 0) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      // Much smoother resistance curve
      const resistanceCurve = (dist: number) => {
        const base = dist / resistance;
        // Minimal dampening for ultra-smooth feel
        const dampening = isTouchDevice() ? 0.8 : 0.6;
        return base - (base * base * dampening) / (threshold * 3);
      };
      
      const adjustedDistance = Math.max(0, resistanceCurve(distance));
      const canRefresh = adjustedDistance >= threshold * 0.7; // Even easier to trigger
      
      velocityRef.current = velocity;
      
      setState(prev => ({
        ...prev,
        pullDistance: adjustedDistance,
        canRefresh,
        isPulling: adjustedDistance > 2 // Show immediately on any pull
      }));
    });
  }, [resistance, threshold, isTouchDevice]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || !isTouchDevice() || refreshing) return;

    const touch = e.touches[0];
    if (!touch) return;

    // Store all initial values
    startYRef.current = touch.clientY;
    currentYRef.current = startYRef.current;
    lastYRef.current = startYRef.current;
    lastTimeRef.current = Date.now();
    isActiveRef.current = false;
    velocityRef.current = 0;

    // Store initial scroll position
    const container = containerRef.current?.closest('.posts-container') as HTMLElement;
    initialScrollRef.current = container ? container.scrollTop : 0;
  }, [enabled, isTouchDevice, refreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || refreshing) return;

    const touch = e.touches[0];
    if (!touch) return;

    const now = Date.now();
    const currentY = touch.clientY;
    const timeDiff = now - lastTimeRef.current;
    
    // Enhanced velocity calculation
    if (timeDiff > 0) {
      const newVelocity = (currentY - lastYRef.current) / timeDiff;
      velocityRef.current = newVelocity * 0.3 + velocityRef.current * 0.7; // Smooth velocity
    }
    
    currentYRef.current = currentY;
    lastYRef.current = currentY;
    lastTimeRef.current = now;
    
    const diff = currentYRef.current - startYRef.current;

    // Much more responsive activation
    const isPullingDown = diff > 3; // Activate on tiny movement
    const isAtTopPosition = isAtTop();
    const startedFromTop = initialScrollRef.current <= 10;

    if (isPullingDown && isAtTopPosition && startedFromTop) {
      if (!isActiveRef.current) {
        isActiveRef.current = true;
        
        // Minimal body interference
        if (isTouchDevice()) {
          document.body.style.overscrollBehavior = 'none';
        }
      }
      
      // Prevent scrolling much earlier
      if (diff > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      updatePullDistance(diff, velocityRef.current);
    } else if (diff <= 0 || !isAtTopPosition) {
      // Quick reset
      if (isActiveRef.current) {
        isActiveRef.current = false;
        document.body.style.overscrollBehavior = '';
        updatePullDistance(0, 0);
      }
    }
  }, [enabled, refreshing, isAtTop, updatePullDistance, isTouchDevice]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled) {
      document.body.style.overscrollBehavior = '';
      return;
    }

    const wasActive = isActiveRef.current;
    const wasCanRefresh = state.canRefresh;
    const velocity = velocityRef.current;
    const distance = state.pullDistance;
    
    isActiveRef.current = false;
    document.body.style.overscrollBehavior = '';
    
    // Much more generous refresh triggering
    const velocityBoost = velocity > 0.2 ? 25 : 0; // Lower velocity threshold
    const effectiveDistance = distance + velocityBoost;
    const minRefreshDistance = threshold * 0.4; // Much lower requirement
    
    // Multiple ways to trigger refresh
    const shouldRefresh = (
      (wasCanRefresh && wasActive) ||
      (effectiveDistance >= minRefreshDistance && wasActive) ||
      (velocity > 0.5 && distance > 20 && wasActive) // Velocity-based trigger
    );
    
    if (shouldRefresh && !refreshing) {
      setState(prev => ({ 
        ...prev, 
        isRefreshing: true,
        isPulling: false,
        pullDistance: threshold * 0.6
      }));
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        // Quick reset
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            isPulling: false,
            pullDistance: 0,
            isRefreshing: false,
            canRefresh: false
          }));
        }, 200); // Faster reset
      }
    } else if (wasActive) {
      // Quick return animation
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false
      }));
    }
  }, [enabled, state.canRefresh, state.pullDistance, refreshing, onRefresh, threshold]);

  // Optimized event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled || !isTouchDevice()) {
      return;
    }

    // Ultra-responsive event options
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
      
      document.body.style.overscrollBehavior = '';
    };
  }, [enabled, isTouchDevice, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Auto-reset when refreshing changes
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

  // Cleanup
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