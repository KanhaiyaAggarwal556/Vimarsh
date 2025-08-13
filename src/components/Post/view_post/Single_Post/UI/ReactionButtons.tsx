import { useCallback } from "react";

// PostData interface
interface PostData {
  _id: string;
  views: number;
  reactions: {
    likes: number;
    dislikes: number;
  };
  title?: string;
  description?: string;
}

// ReactionButtons component props interface
interface ReactionButtonsProps {
  currentLikes?: number;
  currentDislikes?: number;
  userLiked?: boolean;
  userDisliked?: boolean;
  likeAnimation?: boolean;
  dislikeAnimation?: boolean;
  onLike: () => void;
  onDislike: () => void;
  onComments: () => void;
  post: PostData;
  compact?: boolean;
  formatCount?: (count: number) => string;
  isOnPostPage?: boolean;
  enableCommentNavigation?: boolean;
}

// ReactionButtons Component
export default function ReactionButtons({
  currentLikes = 0,
  currentDislikes = 0,
  userLiked = false,
  userDisliked = false,
  likeAnimation = false,
  dislikeAnimation = false,
  onLike,
  onDislike,
  onComments,
  post,
  compact = false,
  formatCount = (count: number) => count.toString(),
  isOnPostPage = false,
  enableCommentNavigation = true,
}: ReactionButtonsProps) {
  
  // Optimized click handlers with instant visual feedback
  const handleLikeClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onLike();
    },
    [onLike]
  );

  const handleDislikeClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onDislike();
    },
    [onDislike]
  );

  const handleCommentClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (isOnPostPage) {
        if (onComments) {
          onComments();
        }
        return;
      }

      if (enableCommentNavigation && post?._id) {
        if (window.history && window.history.pushState) {
          window.history.pushState(null, "", `/p/${post._id}`);
          window.dispatchEvent(new PopStateEvent("popstate"));
        } else {
          window.location.href = `/p/${post._id}`;
        }
      }

      if (onComments) {
        onComments();
      }
    },
    [isOnPostPage, onComments, enableCommentNavigation, post?._id]
  );

  return (
    <div className="post-reactions" role="group" aria-label="Post reactions">
      {/* Like Button */}
      <button
        className={`post-action-btn ${userLiked ? "liked" : ""}`}
        onClick={handleLikeClick}
        aria-label={`${userLiked ? "Unlike" : "Like"} this post`}
        aria-pressed={userLiked}
        type="button"
      >
        <span
          className={`post-action-icon ${
            likeAnimation ? "animate-bounce" : ""
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={userLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
        </span>
        <span className="count-text">{formatCount(currentLikes)}</span>
      </button>

      {/* Dislike Button */}
      <button
        className={`post-action-btn ${userDisliked ? "disliked" : ""}`}
        onClick={handleDislikeClick}
        aria-label={`${userDisliked ? "Remove dislike" : "Dislike"} this post`}
        aria-pressed={userDisliked}
        type="button"
      >
        <span
          className={`post-action-icon ${
            dislikeAnimation ? "animate-bounce" : ""
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={userDisliked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
          </svg>
        </span>
        <span className="count-text">{formatCount(currentDislikes)}</span>
      </button>

      {/* Comment Button */}
      <div className="tooltip-container">
        <button
          className="post-action-btn"
          onClick={handleCommentClick}
          aria-label={
            isOnPostPage ? "Toggle comments" : "View comments for this post"
          }
          type="button"
        >
          <span className="post-action-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          {!compact && <span className="action-text">Comment</span>}
        </button>
        <div className="tooltip">
          {isOnPostPage ? "Toggle comments" : "View comments"}
        </div>
      </div>
    </div>
  );
}