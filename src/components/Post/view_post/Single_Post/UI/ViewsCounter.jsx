import PropTypes from 'prop-types';
import "../style/ViewsCounter.css";

export default function ViewsCounter({ views }) {
  return (
    <div className="post-views">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      <small>{views}</small>
    </div>
  );
}

ViewsCounter.propTypes = {
  views: PropTypes.number
};

ViewsCounter.defaultProps = {
  views: 0
};