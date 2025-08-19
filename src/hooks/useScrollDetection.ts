// hooks/useScrollDetection.ts - Production Ready (Cleaned)
import { useState, useEffect, useCallback } from 'react';
import { getScrollPosition } from '@/utils/scroll';

interface UseScrollDetectionOptions {
  threshold?: number;
  throttleMs?: number;
}

export const useScrollDetection = (
  options: UseScrollDetectionOptions = {}
): boolean => {
  const { threshold = 50, throttleMs = 16 } = options;
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const scrolled = getScrollPosition() > threshold;
    setIsScrolled(scrolled);
  }, [threshold]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const throttledScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, throttleMs);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll, throttleMs]);

  return isScrolled;
};