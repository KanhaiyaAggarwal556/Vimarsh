// components/Header/Header.js
import PropTypes from 'prop-types';
import SectionToggle from './SectionToggle';

const Header = ({ isScrolled, activeSection, onSectionToggle }) => {
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

Header.propTypes = {
  isScrolled: PropTypes.bool.isRequired,
  activeSection: PropTypes.string.isRequired,
  onSectionToggle: PropTypes.func.isRequired,
};

export default Header;