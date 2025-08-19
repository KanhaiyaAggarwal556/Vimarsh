// Header.tsx - Updated to pass refresh function to SectionToggle
import { HeaderProps } from '@/types';
import { createToggleClass } from '@/utils/classNames';
import SectionToggle from '../Sections/SectionToggle';
import "./Header.css"

interface ExtendedHeaderProps extends HeaderProps {
  onHomeRefresh?: () => Promise<void> | void;
}

const Header = ({ 
  isScrolled, 
  activeSection, 
  onSectionToggle, 
  onHomeRefresh 
}: ExtendedHeaderProps) => {
  return (
    <header className={createToggleClass('dynamic-header', isScrolled, 'scrolled')}>
      <div className="header-content">
        <h1 className="header-title">Social Feed</h1>
        <SectionToggle 
          activeSection={activeSection} 
          onSectionToggle={onSectionToggle}
          onHomeRefresh={onHomeRefresh}
        />
      </div>
    </header>
  );
};

export default Header;