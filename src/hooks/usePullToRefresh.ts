// hooks/usePullToRefresh.ts - Enhanced mobile visibility and better detection
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

  // Enhanced mobile/touch device detection
  const isTouchDevice = useCallback(() => {
    return (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore - DocumentTouch is legacy but still used in some browsers
      (typeof window.DocumentTouch !== 'undefined' && document instanceof window.DocumentTouch) ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }, []);

  // Enhanced scroll position check with multiple fallbacks
  const isAtTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    
    // Check multiple scroll positions for better accuracy across devices
    const containerScrollTop = container.scrollTop;
    const documentScrollTop = document.documentElement.scrollTop;
    const bodyScrollTop = document.body.scrollTop;
    const windowScrollY = window.scrollY;
    
    // More lenient threshold for mobile devices
    const scrollThreshold = isTouchDevice() ? 5 : 2;
    
    const isAtTopPosition = (
      containerScrollTop <= scrollThreshold &&
      documentScrollTop <= scrollThreshold &&
      bodyScrollTop <= scrollThreshold &&
      windowScrollY <= scrollThreshold
    );

    // Additional check for iOS Safari and Chrome mobile
    if (!isAtTopPosition && container.scrollTop === 0) {
      return true;
    }
    
    return isAtTopPosition;
  }, [isTouchDevice]);

  // Optimized update function with enhanced velocity tracking
  const updatePullDistance = useCallback((distance: number, velocity: number = 0) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      // Enhanced resistance curve for more natural mobile feel
      const resistanceCurve = (dist: number) => {
        const base = dist / resistance;
        // Apply smoother diminishing returns for better mobile UX
        const dampening = isTouchDevice() ? 1.2 : 1.0;
        return base - (base * base * dampening) / (threshold * 2);
      };
      
      const adjustedDistance = Math.max(0, resistanceCurve(distance));
      const canRefresh = adjustedDistance >= threshold;
      
      // Store velocity for release calculations
      velocityRef.current = velocity;
      
      // Ensure minimum visibility on mobile
      const minVisibleDistance = isTouchDevice() ? 5 : 0;
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
    if (!enabled || !isTouchDevice()) return;

    const touch = e.touches[0];
    if (!touch) return;

    // Enhanced start position tracking
    startYRef.current = touch.clientY;
    currentYRef.current = startYRef.current;
    lastYRef.current = startYRef.current;
    lastTimeRef.current = Date.now();
    isActiveRef.current = false;
    velocityRef.current = 0;

    // Debug log for mobile testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Touch start detected at:', touch.clientY);
    }
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

    // Enhanced activation logic for better mobile UX
    const activationThreshold = isTouchDevice() ? 5 : 8;
    const isScrollingDown = diff > activationThreshold;
    const isAtTopPosition = isAtTop();
    
    // Debug logs for mobile testing
    if (process.env.NODE_ENV === 'development' && diff > 0) {
      console.log('Pull distance:', diff, 'At top:', isAtTopPosition, 'Active:', isActiveRef.current);
    }

    // Only activate pull-to-refresh if we're pulling down and at the top
    if (isScrollingDown && isAtTopPosition) {
      if (!isActiveRef.current) {
        isActiveRef.current = true;
        // Prevent overscroll more aggressively on mobile
        document.body.style.overscrollBehavior = 'none';
        document.body.style.touchAction = 'pan-x pinch-zoom';
        
        // Debug log
        if (process.env.NODE_ENV === 'development') {
          console.log('Pull-to-refresh activated');
        }
      }
      
      // Prevent default for mobile browsers more aggressively
      const preventThreshold = isTouchDevice() ? 15 : 25;
      if (diff > preventThreshold) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      updatePullDistance(diff, velocityRef.current);
    } else if (diff <= 0 || !isAtTopPosition) {
      // Reset if user starts scrolling up or scrolling normally
      if (isActiveRef.current) {
        isActiveRef.current = false;
        document.body.style.overscrollBehavior = '';
        document.body.style.touchAction = '';
        updatePullDistance(0, 0);
        
        // Debug log
        if (process.env.NODE_ENV === 'development') {
          console.log('Pull-to-refresh deactivated');
        }
      }
    }
  }, [enabled, refreshing, isAtTop, updatePullDistance, isTouchDevice]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled) {
      document.body.style.overscrollBehavior = '';
      document.body.style.touchAction = '';
      return;
    }

    const wasActive = isActiveRef.current;
    const wasCanRefresh = state.canRefresh;
    const velocity = velocityRef.current;
    
    isActiveRef.current = false;
    document.body.style.overscrollBehavior = '';
    document.body.style.touchAction = '';
    
    // Debug log
    if (process.env.NODE_ENV === 'development' && wasActive) {
      console.log('Touch end - Can refresh:', wasCanRefresh, 'Distance:', state.pullDistance, 'Velocity:', velocity);
    }
    
    // Enhanced refresh trigger with velocity consideration for mobile
    const velocityBoost = velocity > (isTouchDevice() ? 0.3 : 0.5) ? 15 : 0;
    const effectiveDistance = state.pullDistance + velocityBoost;
    const refreshThreshold = isTouchDevice() ? threshold * 0.7 : threshold * 0.8;
    
    if ((wasCanRefresh || effectiveDistance >= refreshThreshold) && !refreshing && wasActive) {
      setState(prev => ({ 
        ...prev, 
        isRefreshing: true,
        isPulling: false,
        pullDistance: threshold // Keep at threshold during refresh
      }));
      
      // Debug log
      if (process.env.NODE_ENV === 'development') {
        console.log('Triggering refresh');
      }
      
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
    } else if (wasActive) {
      // Animate back to original position with elastic effect
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false
      }));
    }
  }, [enabled, state.canRefresh, state.pullDistance, refreshing, onRefresh, threshold, isTouchDevice]);

  // Enhanced event listener setup with better mobile support
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled || !isTouchDevice()) {
      return;
    }

    // More aggressive event listener options for mobile
    const passiveOptions: AddEventListenerOptions = { passive: true };
    const activeOptions: AddEventListenerOptions = { passive: false };

    // Add event listeners with enhanced mobile support
    container.addEventListener('touchstart', handleTouchStart, passiveOptions);
    container.addEventListener('touchmove', handleTouchMove, activeOptions);
    container.addEventListener('touchend', handleTouchEnd, passiveOptions);
    container.addEventListener('touchcancel', handleTouchEnd, passiveOptions);

    // Additional mobile-specific event listeners
    if (isTouchDevice()) {
      // Prevent pull-to-refresh on the document to avoid conflicts
      const preventDocumentPull = (e: TouchEvent) => {
        if (isActiveRef.current) {
          e.preventDefault();
        }
      };
      
      document.addEventListener('touchmove', preventDocumentPull, { passive: false });
      
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('touchcancel', handleTouchEnd);
        document.removeEventListener('touchmove', preventDocumentPull);
        
        // Cleanup any body styles
        document.body.style.overscrollBehavior = '';
        document.body.style.touchAction = '';
      };
    }

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      
      // Cleanup any body styles
      document.body.style.overscrollBehavior = '';
      document.body.style.touchAction = '';
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
      document.body.style.touchAction = '';
    };
  }, []);

  return {
    containerRef,
    ...state,
    threshold,
    isEnabled: enabled && isTouchDevice()
  };
};