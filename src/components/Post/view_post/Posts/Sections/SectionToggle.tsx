// SectionToggle.tsx - Enhanced with scroll-aware compact behavior
import { useState, useRef, useCallback, useEffect } from 'react';
import { SectionToggleProps, SECTIONS } from '@/types';
import { SECTION_CONFIG } from '@/config/sections';
import { createToggleClass } from '@/utils/classNames';
import "./SectionToggle.css";

interface ScrollState {
  isScrolled: boolean;
  scrollY: number;
  scrollDirection: 'up' | 'down' | 'none';
  isScrollingFast: boolean;
  hasScrolledPast: (threshold: number) => boolean;
}

interface ExtendedSectionToggleProps extends SectionToggleProps {
  onHomeRefresh?: () => Promise<void> | void;
  isCompact?: boolean; // Direct compact prop from header
  scrollState?: ScrollState; // Full scroll state for advanced behavior
  scrollDirection?: 'up' | 'down' | 'none';
}

const SectionToggle = ({ 
  activeSection, 
  onSectionToggle,
  onHomeRefresh,
  isCompact = false,
  scrollState,
  scrollDirection = 'none'
}: ExtendedSectionToggleProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showRefreshNotification, setShowRefreshNotification] = useState(false);
  
  const clickCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  const notificationTimeoutRef = useRef<NodeJS.Timeout>();

  // Determine compact state from multiple sources
  const getCompactState = useCallback(() => {
    if (scrollState) {
      // Ultra-compact for fast scrolling or deep scrolling
      if (scrollState.isScrollingFast || scrollState.hasScrolledPast(300)) {
        return 'ultra-compact';
      }
      // Regular compact for basic scrolling
      if (scrollState.isScrolled) {
        return 'compact';
      }
    } else if (isCompact) {
      // Fallback to basic compact
      return 'compact';
    }
    return 'normal';
  }, [scrollState, isCompact]);

  // Enhanced section click handler with scroll awareness
  const handleSectionClick = useCallback(async (section: typeof activeSection) => {
    // Prevent clicks during transition or fast scrolling to avoid flash
    const currentScrollY = scrollState?.scrollY ?? 0;
    if (isTransitioning || (scrollState?.isScrollingFast && currentScrollY > 100)) {
      return;
    }
    
    // Handle multi-tap refresh only when already on Home section
    if (section === SECTIONS.HOME && activeSection === SECTIONS.HOME) {
      clickCountRef.current += 1;
      
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Adjust timing based on scroll state
      const tapTimeout = scrollState?.isScrolled ? 600 : 800; // Faster taps when scrolled
      
      // If this is the second/third click within time window, refresh
      if (clickCountRef.current >= 2 && onHomeRefresh && !isRefreshing) {
        clickCountRef.current = 0;
        
        // Show enhanced notification
        showRefreshNotificationBriefly();
        
        setIsRefreshing(true);
        
        try {
          await onHomeRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          // Longer refresh indication when compact for better UX
          const refreshDelay = getCompactState() !== 'normal' ? 1200 : 1000;
          setTimeout(() => setIsRefreshing(false), refreshDelay);
        }
        return;
      }
      
      // Reset counter after timeout
      timerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, tapTimeout);
      
    } else if (section !== activeSection) {
      // Normal section switching with enhanced transition handling
      clickCountRef.current = 0;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set transitioning state to prevent flash
      setIsTransitioning(true);
      
      // Clear any existing transition timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      
      // Call the section toggle immediately
      onSectionToggle(section);
      
      // Reset transition state - faster when compact for better responsiveness
      const transitionDuration = getCompactState() === 'ultra-compact' ? 300 : 400;
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);
    }
  }, [activeSection, onSectionToggle, onHomeRefresh, isRefreshing, isTransitioning, scrollState, getCompactState]);

  // Enhanced notification system
  const showRefreshNotificationBriefly = useCallback(() => {
    setShowRefreshNotification(true);
    
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    
    // Shorter notification duration when compact
    const notificationDuration = getCompactState() !== 'normal' ? 2000 : 2500;
    notificationTimeoutRef.current = setTimeout(() => {
      setShowRefreshNotification(false);
    }, notificationDuration);
  }, [getCompactState]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    };
  }, []);

  // Reset states when section changes
  useEffect(() => {
    clickCountRef.current = 0;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Faster reset when compact
    const resetDelay = getCompactState() === 'ultra-compact' ? 30 : 50;
    const resetTimeout = setTimeout(() => {
      setIsTransitioning(false);
    }, resetDelay);
    
    return () => clearTimeout(resetTimeout);
  }, [activeSection, getCompactState]);

  // Get CSS classes based on state
  const getSectionToggleClasses = () => {
    const classes = ['section-toggle'];
    
    const compactState = getCompactState();
    if (compactState === 'compact') classes.push('compact');
    if (compactState === 'ultra-compact') classes.push('ultra-compact');
    
    if (isTransitioning) classes.push('transitioning');
    if (scrollDirection === 'up' && (scrollState?.scrollY ?? 0) > 50) classes.push('scrolling-up');
    if (scrollDirection === 'down') classes.push('scrolling-down');
    
    return classes.join(' ');
  };

  // Enhanced refresh notification classes
  const getNotificationClasses = () => {
    const classes = ['refresh-notification'];
    
    const compactState = getCompactState();
    if (compactState === 'compact') classes.push('header-compact');
    if (compactState === 'ultra-compact') classes.push('header-ultra-compact');
    
    return classes.join(' ');
  };

  return (
    <>
      <div className={getSectionToggleClasses()}>
        {Object.values(SECTIONS).map((section) => {
          const typedSection = section as typeof activeSection;
          const isActive = activeSection === section;
          const isHomeRefreshing = isRefreshing && section === SECTIONS.HOME;
          const isDisabled = isHomeRefreshing || (isTransitioning && !isActive);
          
          return (
            <button
              key={section}
              className={createToggleClass(
                'toggle-btn', 
                isActive, 
                isHomeRefreshing ? 'refreshing' : isTransitioning ? 'transitioning' : ''
              )}
              onClick={() => handleSectionClick(typedSection)}
              disabled={isDisabled}
              style={{
                transition: getCompactState() === 'ultra-compact' 
                  ? 'all 0.15s ease' 
                  : 'all 0.2s ease',
                opacity: isDisabled && !isActive ? 0.6 : 1
              }}
              aria-label={`Switch to ${SECTION_CONFIG.SECTION_LABELS[section as keyof typeof SECTION_CONFIG.SECTION_LABELS]} section`}
            >
              {SECTION_CONFIG.SECTION_LABELS[section as keyof typeof SECTION_CONFIG.SECTION_LABELS]}
              
              {/* Enhanced loading indicator with size awareness */}
              {isHomeRefreshing && (
                <span className="refresh-spinner" aria-hidden="true" />
              )}
            </button>
          );
        })}
        
        {/* Enhanced toggle indicator */}
        <div 
          className={`toggle-indicator ${activeSection} ${isTransitioning ? 'transitioning' : ''}`}
          style={{
            transition: getCompactState() === 'ultra-compact'
              ? 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              : 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        />
        
        {/* Multi-click progress indicator for advanced users */}
        {clickCountRef.current > 0 && activeSection === SECTIONS.HOME && (
          <div className="multi-click-indicator">
            <div 
              className="progress-ring"
              style={{
                opacity: clickCountRef.current >= 2 ? 1 : 0.6,
                transform: `scale(${clickCountRef.current >= 2 ? 1.1 : 1})`
              }}
            />
          </div>
        )}
      </div>

      {/* Enhanced refresh notification with scroll awareness */}
      {showRefreshNotification && (
        <div className={getNotificationClasses()}>
          <div className="refresh-notification-content">
            <span className="refresh-spinner small" aria-hidden="true" />
            <span>
              {getCompactState() === 'ultra-compact' 
                ? 'Refreshing...' 
                : 'Refreshing feed...'}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default SectionToggle;