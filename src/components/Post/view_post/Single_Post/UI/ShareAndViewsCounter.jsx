import PropTypes from 'prop-types';
import ViewsCounter from './ViewsCounter';
import "../style/ShareAndViewsCounter.css";

export default function ShareAndViewsCounter({ 
  views, 
  onShare, 
  post,
  shareCount,
  userShared 
}) {
  const handleShare = async () => {
    if (navigator.share) {
      // Use Web Share API if available
      try {
        await navigator.share({
          title: `Post by ${post.username || 'User'}`,
          text: post.content || 'Check out this post!',
          url: `${window.location.origin}/${post.userId}/status/${post.id}`,
        });
      } catch (err) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback to copying link to clipboard
      const url = `${window.location.origin}/${post.userId}/status/${post.id}`;
      try {
        await navigator.clipboard.writeText(url);
        // You might want to show a toast notification here
        alert('Link copied to clipboard!');
      } catch (err) {
        // Fallback if clipboard API fails
        console.log('Clipboard write failed:', err);
      }
    }
    
    // Call the onShare callback if provided
    if (onShare) {
      onShare();
    }
  };

  return (
    <div className="share-views-container">
      <ViewsCounter views={views} />
      
      <button 
        className={`post-action-btn share-btn ${userShared ? 'shared' : ''}`}
        onClick={handleShare}
        title="Share this post"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        {shareCount > 0 && <span>{shareCount}</span>}
      </button>
    </div>
  );
}

ShareAndViewsCounter.propTypes = {
  views: PropTypes.number,
  onShare: PropTypes.func,
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    username: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  shareCount: PropTypes.number,
  userShared: PropTypes.bool,
};

ShareAndViewsCounter.defaultProps = {
  views: 0,
  onShare: null,
  shareCount: 0,
  userShared: false,
};