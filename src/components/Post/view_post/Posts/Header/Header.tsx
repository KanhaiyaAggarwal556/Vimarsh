// Header.tsx - Enhanced compact header with scroll state awareness
import { HeaderProps } from '@/types';
import { createToggleClass } from '@/utils/classNames';
import SectionToggle from '../Sections/SectionToggle';
import "./Header.css";

interface ScrollState {
  isScrolled: boolean;
  scrollY: number;
  scrollDirection: 'up' | 'down' | 'none';
  isScrollingFast: boolean;
  hasScrolledPast: (threshold: number) => boolean;
}

interface ExtendedHeaderProps extends HeaderProps {
  onHomeRefresh?: () => Promise<void> | void;
  scrollState?: ScrollState;
}

const Header = ({ 
  isScrolled, 
  activeSection, 
  onSectionToggle, 
  onHomeRefresh,
  scrollState 
}: ExtendedHeaderProps) => {
  
  // Determine header state classes
  const getHeaderClasses = () => {
    const classes = ['dynamic-header'];
    
    if (isScrolled) classes.push('scrolled');
    if (scrollState?.isScrollingFast) classes.push('fast-scrolling');
    if (scrollState?.scrollDirection === 'up' && scrollState.scrollY > 100) classes.push('scrolling-up');
    if (scrollState?.scrollDirection === 'down') classes.push('scrolling-down');
    if (scrollState?.hasScrolledPast(200)) classes.push('deeply-scrolled');
    
    return classes.join(' ');
  };

  // Enhanced double-tap detection for refresh
  const handleTitleClick = () => {
    if (onHomeRefresh) {
      onHomeRefresh();
    }
  };

  // Get scroll progress for visual indicators
  const getScrollProgress = () => {
    if (!scrollState) return 0;
    return Math.min(scrollState.scrollY / 300, 1); // Max progress at 300px
  };

  return (
    <header className={getHeaderClasses()}>
      {/* Optional scroll progress indicator */}
      <div 
        className="scroll-progress-indicator"
        style={{ 
          transform: `scaleX(${getScrollProgress()})`,
          opacity: scrollState?.isScrolled ? 1 : 0
        }}
      />
      
      <div className="header-content">
        <h1 
          className="header-title"
          onClick={handleTitleClick}
          title="Double-click to refresh"
        >
          Social Feed
          {/* Optional scroll indicator dot */}
          {scrollState?.isScrolled && (
            <span className="scroll-indicator" />
          )}
        </h1>
        
        <SectionToggle 
          activeSection={activeSection} 
          onSectionToggle={onSectionToggle}
          onHomeRefresh={onHomeRefresh}
          isCompact={scrollState?.isScrolled}
          scrollState={scrollState}
          scrollDirection={scrollState?.scrollDirection}
        />
      </div>

      {/* Enhanced background blur effect based on scroll */}
      <div 
        className="header-backdrop"
        style={{
          backdropFilter: `blur(${scrollState?.isScrolled ? '15px' : '10px'})`,
          opacity: scrollState?.isScrolled ? 0.98 : 0.95
        }}
      />
    </header>
  );
};

export default Header;