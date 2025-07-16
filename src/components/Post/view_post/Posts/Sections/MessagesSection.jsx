// components/Sections/MessagesSection.js
import PropTypes from 'prop-types';

const MessagesSection = ({ isActive }) => {
  return (
    <div className={`section messages-section ${isActive ? "active" : ""}`}>
      <div className="messages-placeholder">
        <h2>Messages</h2>
        <p>Your messages will appear here</p>
        {/* Add your messages content here */}
      </div>
    </div>
  );
};

MessagesSection.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default MessagesSection;