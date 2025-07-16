import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import "../style/ReactionButtons.css";

export default function ReactionButtons({
  currentLikes,
  currentDislikes,
  userLiked,
  userDisliked,
  likeAnimation,
  dislikeAnimation,
  onLike,
  onDislike,
  onComments,
  onShare,
  post // Add post prop to access userId and id
}) {
  const navigate = useNavigate();

  const handleCommentClick = () => {
    // Navigate to the user's status page
    navigate(`/${post.userId}/status/${post.id}`);
    
    // Call the original onComments function if needed
    if (onComments) {
      onComments();
    }
  };

  return (
    <div className="post-reactions">
      {/* Like Button */}
      <button 
        className={`post-action-btn ${userLiked ? 'liked' : ''}`}
        onClick={onLike}
      >
        <span className={`post-action-icon ${likeAnimation ? 'animate-pulse' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={userLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
          </svg>
        </span>
        <span>{currentLikes}</span>
      </button>

      {/* Dislike Button */}
      <button 
        className={`post-action-btn ${userDisliked ? 'disliked' : ''}`}
        onClick={onDislike}
      >
        <span className={`post-action-icon ${dislikeAnimation ? 'animate-pulse' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={userDisliked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
          </svg>
        </span>
        <span>{currentDislikes}</span>
      </button>

      {/* Comment Button */}
      <button 
        className="post-action-btn"
        onClick={handleCommentClick}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Comment</span>
      </button>
    </div>
  );
}

ReactionButtons.propTypes = {
  currentLikes: PropTypes.number,
  currentDislikes: PropTypes.number,
  userLiked: PropTypes.bool,
  userDisliked: PropTypes.bool,
  likeAnimation: PropTypes.bool,
  dislikeAnimation: PropTypes.bool,
  onLike: PropTypes.func.isRequired,
  onDislike: PropTypes.func.isRequired,
  onComments: PropTypes.func,
  onShare: PropTypes.func,
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

ReactionButtons.defaultProps = {
  currentLikes: 0,
  currentDislikes: 0,
  userLiked: false,
  userDisliked: false,
  likeAnimation: false,
  dislikeAnimation: false,
  onComments: null,
  onShare: null,
};