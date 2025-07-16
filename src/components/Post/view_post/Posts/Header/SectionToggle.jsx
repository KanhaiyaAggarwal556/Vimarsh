// components/Header/SectionToggle.js
import PropTypes from 'prop-types';

const SectionToggle = ({ activeSection, onSectionToggle }) => {
  return (
    <div className="section-toggle">
      <button
        className={`toggle-btn ${activeSection === "home" ? "active" : ""}`}
        onClick={() => onSectionToggle("home")}
      >
        Home
      </button>
      <button
        className={`toggle-btn ${activeSection === "messages" ? "active" : ""}`}
        onClick={() => onSectionToggle("messages")}
      >
        Messages
      </button>
      <div className={`toggle-indicator ${activeSection}`}></div>
    </div>
  );
};

SectionToggle.propTypes = {
  activeSection: PropTypes.string.isRequired,
  onSectionToggle: PropTypes.func.isRequired,
};

export default SectionToggle;