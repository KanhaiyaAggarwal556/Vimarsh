// hooks/useScroll.js
import { useState, useEffect } from 'react';

const useScroll = (containerSelector = '.posts-container', threshold = 50) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      setIsScrolled(scrollTop > threshold);
    };

    const container = document.querySelector(containerSelector);
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [containerSelector, threshold]);

  return isScrolled;
};

export default useScroll;