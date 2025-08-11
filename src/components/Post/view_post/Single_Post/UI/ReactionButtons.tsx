import { useNavigate } from 'react-router-dom';
import { PostData } from '../post';
import '../style/ReactionButtons.css'; // Assuming you have a CSS file for styles
interface ReactionButtonsProps {
  currentLikes?: number;
  currentDislikes?: number;
  userLiked?: boolean;
  userDisliked?: boolean;
  likeAnimation?: boolean;
  dislikeAnimation?: boolean;
  likePending?: boolean;
  dislikePending?: boolean;
  onLike: () => void;
  onDislike: () => void;
  onComments?: () => void;
  post: PostData;
  compact?: boolean;
  formatCount?: (count: number) => string;
}

export default function ReactionButtons({
  currentLikes = 0,
  currentDislikes = 0,
  userLiked = false,
  userDisliked = false,
  likeAnimation = false,
  dislikeAnimation = false,
  likePending = false,
  dislikePending = false,
  onLike,
  onDislike,
  onComments,
  post,
  compact = false,
  formatCount = (count) => count.toString()
}: ReactionButtonsProps) {
  const navigate = useNavigate();

  const handleCommentClick = (): void => {
    navigate(`/p/${post._id}`);
    
    if (onComments) {
      onComments();
    }
  };

  const renderSpinner = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" className="spinner">
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
        fill="none" 
        strokeDasharray="31.416" 
        strokeDashoffset="31.416"
      >
        <animate 
          attributeName="stroke-dasharray" 
          dur="2s" 
          values="0 31.416;15.708 15.708;0 31.416" 
          repeatCount="indefinite"
        />
        <animate 
          attributeName="stroke-dashoffset" 
          dur="2s" 
          values="0;-15.708;-31.416" 
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );

  return (
    <div className="post-reactions" role="group" aria-label="Post reactions">
      {/* Like Button */}
      <button 
        className={`post-action-btn ${userLiked ? 'liked' : ''} ${likePending ? 'pending' : ''}`}
        onClick={onLike}
        disabled={likePending}
        aria-label={`${userLiked ? 'Unlike' : 'Like'} this post (${formatCount(currentLikes)} likes)`}
        aria-pressed={userLiked}
        type="button"
      >
        <span className={`post-action-icon ${likeAnimation ? 'animate-pulse' : ''}`}>
          {likePending ? renderSpinner() : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={userLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
          )}
        </span>
        {!compact && <span>{formatCount(currentLikes)}</span>}
        {compact && currentLikes > 0 && <span className="sr-only">{formatCount(currentLikes)} likes</span>}
      </button>

      {/* Dislike Button */}
      <button 
        className={`post-action-btn ${userDisliked ? 'disliked' : ''} ${dislikePending ? 'pending' : ''}`}
        onClick={onDislike}
        disabled={dislikePending}
        aria-label={`${userDisliked ? 'Remove dislike' : 'Dislike'} this post (${formatCount(currentDislikes)} dislikes)`}
        aria-pressed={userDisliked}
        type="button"
      >
        <span className={`post-action-icon ${dislikeAnimation ? 'animate-pulse' : ''}`}>
          {dislikePending ? renderSpinner() : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={userDisliked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
            </svg>
          )}
        </span>
        {!compact && <span>{formatCount(currentDislikes)}</span>}
        {compact && currentDislikes > 0 && <span className="sr-only">{formatCount(currentDislikes)} dislikes</span>}
      </button>

      {/* Comment Button */}
      <button 
        className="post-action-btn"
        onClick={handleCommentClick}
        aria-label="View comments for this post"
        type="button"
      >
        <span className="post-action-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
        {!compact && <span>Comment</span>}
      </button>
    </div>
  );
}