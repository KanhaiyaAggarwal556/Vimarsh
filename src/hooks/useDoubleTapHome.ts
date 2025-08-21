// hooks/useDoubleTapHome.ts
import { useCallback, useRef } from 'react';
import { scrollToTop } from '@/utils/scroll';

interface UseDoubleTapHomeOptions {
  onRefresh?: () => Promise<void> | void;
  doubleTapDelay?: number;
}

export const useDoubleTapHome = ({
  onRefresh,
  doubleTapDelay = 300
}: UseDoubleTapHomeOptions = {}) => {
  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout>();

  const handleHomeTap = useCallback(() => {
    tapCountRef.current += 1;

    if (tapCountRef.current === 1) {
      // First tap - scroll to top immediately for better UX
      scrollToTop('smooth');
      
      // Set timeout to reset tap count
      tapTimeoutRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, doubleTapDelay);
    } else if (tapCountRef.current >= 2) {
      // Second tap or more - trigger refresh
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      
      tapCountRef.current = 0;
      
      if (onRefresh) {
        onRefresh();
      }
    }
  }, [onRefresh, doubleTapDelay]);

  // Cleanup timeout on unmount
  const cleanup = useCallback(() => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    tapCountRef.current = 0;
  }, []);

  return {
    handleHomeTap,
    cleanup
  };
};