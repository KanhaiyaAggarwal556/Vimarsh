import React from 'react';

const ScrollToTopButton = ({ 
  threshold = 300, 
  className = '',
  variant = 'default',
  hideDelay = 2000
}: {
  threshold?: number;
  className?: string;
  variant?: 'default' | 'small' | 'large';
  hideDelay?: number;
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  
  const hideTimerRef = React.useRef<NodeJS.Timeout>();
  const scrollTimerRef = React.useRef<NodeJS.Timeout>();
  const scrollContainerRef = React.useRef<HTMLElement | null>(null);
  const listenerAttachedRef = React.useRef(false);

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Find scroll container and set up listener - only once
  React.useEffect(() => {
    const setupScrollListener = () => {
      const container = document.querySelector('.posts-container') as HTMLElement;
      if (!container || listenerAttachedRef.current) {
        return;
      }

      scrollContainerRef.current = container;
      listenerAttachedRef.current = true;

      const handleScroll = () => {
        const scrollTop = container.scrollTop;
        const shouldShow = scrollTop > threshold;
        
        // Clear existing timers
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
          hideTimerRef.current = undefined;
        }
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current);
          scrollTimerRef.current = undefined;
        }

        if (shouldShow) {
          // Show button immediately
          setIsVisible(true);
          setIsScrolling(true);

          // Set timer to detect when scrolling stops
          scrollTimerRef.current = setTimeout(() => {
            setIsScrolling(false);
            
            // After scrolling stops, wait for hideDelay then hide button
            hideTimerRef.current = setTimeout(() => {
              setIsVisible(false);
            }, hideDelay);
          }, 150);

        } else {
          // Below threshold - hide immediately
          setIsVisible(false);
          setIsScrolling(false);
        }
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
      
      // Initial check
      handleScroll();

      // Return cleanup function
      return () => {
        container.removeEventListener('scroll', handleScroll);
        listenerAttachedRef.current = false;
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
          hideTimerRef.current = undefined;
        }
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current);
          scrollTimerRef.current = undefined;
        }
      };
    };

    const cleanup = setupScrollListener();
    
    // If container not found immediately, try again after delay
    if (!scrollContainerRef.current) {
      const timer = setTimeout(() => {
        const delayedCleanup = setupScrollListener();
        if (delayedCleanup) {
          // Replace the cleanup function
          return delayedCleanup;
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
        if (cleanup) cleanup();
      };
    }

    return cleanup;
  }, [threshold, hideDelay]); // Only re-run if these change

  // Scroll to top function
  const scrollToTop = React.useCallback(() => {
    const container = scrollContainerRef.current;
    
    if (container) {
      // Clear any pending timers
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = undefined;
      }
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = undefined;
      }
      
      setIsScrolling(true);
      
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Hide button after scroll animation completes
      setTimeout(() => {
        setIsVisible(false);
        setIsScrolling(false);
      }, 800);
    }
  }, []);

  // Calculate positioning
  const getSize = () => {
    const baseSize = (() => {
      switch (variant) {
        case 'small': return { width: 42, height: 42, iconSize: 20 };
        case 'large': return { width: 56, height: 56, iconSize: 28 };
        default: return { width: 48, height: 48, iconSize: 24 };
      }
    })();
    
    if (isMobile) {
      return {
        width: Math.max(baseSize.width - 4, 40),
        height: Math.max(baseSize.height - 4, 40),
        iconSize: Math.max(baseSize.iconSize - 2, 18)
      };
    }
    
    return baseSize;
  };

  const size = getSize();
  const bottomPosition = isMobile ? (isVisible ? 25 : 5) : (isVisible ? 30 : 10);

  return (
    <button
      className={`scroll-to-top ${variant} ${isVisible ? 'visible' : ''} ${isScrolling ? 'scrolling' : ''} ${className}`.trim()}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
      style={{
        position: 'fixed',
        bottom: `${bottomPosition}px`,
        left: '50%',
        transform: `translateX(-50%) translateY(${isVisible ? 0 : 25}px) scale(${isVisible ? 1 : 0.8}) ${isScrolling ? 'rotate(5deg)' : 'rotate(0deg)'}`,
        zIndex: 9999,
        width: `${size.width}px`,
        height: `${size.height}px`,
        background: isScrolling 
          ? 'rgba(255, 255, 255, 0.15)' 
          : 'rgba(255, 255, 255, 0.08)',
        color: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isVisible 
          ? '0 8px 25px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.6)' 
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        opacity: isVisible ? (isScrolling ? 1 : 0.8) : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: `
          all 0.4s cubic-bezier(0.4, 0, 0.2, 1),
          transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
          box-shadow 0.3s ease,
          bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)
        `,
        willChange: 'transform, opacity, bottom',
        filter: isScrolling ? 'brightness(1.2)' : 'brightness(1)',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = `translateX(-50%) translateY(-3px) scale(1.08) rotate(0deg)`;
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5), 0 6px 16px rgba(0, 0, 0, 0.7)';
          e.currentTarget.style.filter = 'brightness(1.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.background = isScrolling ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.transform = `translateX(-50%) translateY(${isVisible ? 0 : 25}px) scale(${isVisible ? 1 : 0.8}) ${isScrolling ? 'rotate(5deg)' : 'rotate(0deg)'}`;
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.6)';
          e.currentTarget.style.filter = isScrolling ? 'brightness(1.2)' : 'brightness(1)';
        }
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = `translateX(-50%) translateY(1px) scale(0.95) rotate(0deg)`;
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = `translateX(-50%) translateY(${isVisible ? 0 : 25}px) scale(${isVisible ? 1 : 0.8}) ${isScrolling ? 'rotate(5deg)' : 'rotate(0deg)'}`;
      }}
    >
      <svg
        width={size.iconSize}
        height={size.iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isScrolling ? 'translateY(-2px) scale(1.1)' : 'translateY(0) scale(1)',
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
        }}
      >
        <path d="m18 15-6-6-6 6"/>
      </svg>
      
      {/* Ripple effect overlay */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: isScrolling ? '120%' : '0%',
          height: isScrolling ? '120%' : '0%',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.3s ease, height 0.3s ease',
          pointerEvents: 'none'
        }}
      />
    </button>
  );
};

export default ScrollToTopButton;