// SectionToggle.tsx - Optimized to prevent flash during transitions
import { useState, useRef, useCallback, useEffect } from 'react';
import { SectionToggleProps, SECTIONS } from '@/types';
import { SECTION_CONFIG } from '@/config/sections';
import { createToggleClass } from '@/utils/classNames';
import "./SectionToggle.css"

interface ExtendedSectionToggleProps extends SectionToggleProps {
  onHomeRefresh?: () => Promise<void> | void;
}

const SectionToggle = ({ 
  activeSection, 
  onSectionToggle,
  onHomeRefresh 
}: ExtendedSectionToggleProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const clickCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSectionClick = useCallback(async (section: typeof activeSection) => {
    // Prevent clicks during transition to avoid flash
    if (isTransitioning) return;
    
    // Handle double-tap refresh only when already on Home section
    if (section === SECTIONS.HOME && activeSection === SECTIONS.HOME) {
      clickCountRef.current += 1;
      
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // If this is the second click within time window, refresh
      if (clickCountRef.current >= 2 && onHomeRefresh && !isRefreshing) {
        clickCountRef.current = 0;
        setIsRefreshing(true);
        
        try {
          await onHomeRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setTimeout(() => setIsRefreshing(false), 1000);
        }
        return;
      }
      
      // Reset counter after 800ms
      timerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 800);
    } else if (section !== activeSection) {
      // Normal section switching - prevent multiple rapid clicks
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
      
      // Reset transition state after animation completes
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 400); // Match CSS transition duration
    }
  }, [activeSection, onSectionToggle, onHomeRefresh, isRefreshing, isTransitioning]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Reset states when section changes
  useEffect(() => {
    clickCountRef.current = 0;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Reset transition state when section actually changes
    const resetTimeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 50);
    
    return () => clearTimeout(resetTimeout);
  }, [activeSection]);

  return (
    <div className={`section-toggle ${isTransitioning ? 'transitioning' : ''}`}>
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
              // Ensure consistent styling during transitions
              transition: 'all 0.2s ease',
              opacity: isDisabled && !isActive ? 0.6 : 1
            }}
          >
            {SECTION_CONFIG.SECTION_LABELS[section as keyof typeof SECTION_CONFIG.SECTION_LABELS]}
            
            {/* Simple loading indicator */}
            {isHomeRefreshing && (
              <span style={{ marginLeft: '8px' }}>⟳</span>
            )}
          </button>
        );
      })}
      <div 
        className={`toggle-indicator ${activeSection} ${isTransitioning ? 'transitioning' : ''}`}
        style={{
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      />
    </div>
  );
};

export default SectionToggle;