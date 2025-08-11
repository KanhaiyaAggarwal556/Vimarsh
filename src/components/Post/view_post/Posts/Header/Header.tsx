// components/Header/Header.tsx
import SectionToggle from './SectionToggle';

interface HeaderProps {
  isScrolled: boolean;
  activeSection: string;
  onSectionToggle: (section: string) => void;
}

const Header = ({ isScrolled, activeSection, onSectionToggle }: HeaderProps) => {
  return (
    <header className={`dynamic-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-content">
        <h1 className="header-title">Social Feed</h1>
        <SectionToggle 
          activeSection={activeSection} 
          onSectionToggle={onSectionToggle} 
        />
      </div>
    </header>
  );
};

export default Header;