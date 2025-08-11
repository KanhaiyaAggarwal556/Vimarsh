// hooks/useScroll.ts
import { useState, useEffect } from 'react';

const useScroll = (containerSelector: string = '.posts-container', threshold: number = 50): boolean => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (e: Event): void => {
      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      setIsScrolled(scrollTop > threshold);
    };

    const container = document.querySelector(containerSelector) as HTMLElement;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [containerSelector, threshold]);

  return isScrolled;
};

export default useScroll;