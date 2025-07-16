import PropTypes from "prop-types";
import UserAvatar from "../UI/UserAvatar";
// import PostDropdown from "./PostDropdown";

import "../style/PostHeader.css";

// Helper function to format time like YouTube with date fallback
function formatPostTime(timestamp) {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - postTime) / 1000);

  // Less than 1 minute
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  // Less than 1 hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  // Less than 1 day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  // Less than 1 week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  // Less than 1 month (4 weeks)
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w`;
  }

  // Less than 6 months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 6) {
    return `${diffInMonths}m`;
  }

  // 6 months or more - show actual date
  const options = {
    month: "short",
    day: "numeric",
    year: postTime.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  };

  return postTime.toLocaleDateString("en-US", options);
}

export default function PostHeader({
  post,
  showDropdown,
  setShowDropdown,
  onDelete,
  currentUserId,
  onPostRemoved,
}) {
  const handleUserClick = (e) => {
    e.stopPropagation();
    // Close dropdown if open
    if (showDropdown) {
      setShowDropdown(false);
    }
    // Navigate to user profile page with userId in URL
    window.location.href = `/${post.userId}`;
  };

  const handleDropdownToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handlePostClick = (e) => {
    e.stopPropagation();
    // Close dropdown if open
    if (showDropdown) {
      setShowDropdown(false);
    }
    // Navigate to post page with userId/status/postId in URL
    window.location.href = `/${post.userId}/status/${post.id}`;
  };

  // Close dropdown when clicking anywhere else in the header
  const handleHeaderClick = (e) => {
    // Check if the clicked element is an interactive element or its child
    const isInteractiveElement =
      e.target.closest(".user-avatar-container") ||
      e.target.closest(".username") ||
      e.target.closest(".post-user-id") ||
      e.target.closest(".dropdown-trigger") ||
      e.target.closest(".post-dropdown") ||
      e.target.closest(".post-time");

    if (isInteractiveElement) {
      return; // Don't handle post click for interactive elements
    }

    // If dropdown is open, close it
    if (showDropdown) {
      setShowDropdown(false);
      return;
    }

    // Navigate to post page when clicking on blank space
    handlePostClick(e);
  };

  return (
    <div className="post-header" onClick={handleHeaderClick}>
      <div className="post-user-info">
        <div className="user-avatar-container" onClick={handleUserClick}>
          <UserAvatar
            user={{
              avatar: post.UsersProfilePic,
              name: post.username,
              id: post.userId,
            }}
            size={44}
          />
          <div className="user-status-indicator"></div>
        </div>

        <div className="post-user-details">
          <div className="post-user-name">
            <span className="username" onClick={handleUserClick}>
              {post.username}
            </span>
            <span className="verification-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="post-meta">
            <span className="post-user-id" onClick={handleUserClick}>
              @{post.userId}
            </span>
            <span className="post-time-separator">•</span>
            <span className="post-time" onClick={(e) => e.stopPropagation()}>
              {formatPostTime(post.createdAt || post.timestamp)}
            </span>
          </div>
        </div>
      </div>

      <div className="post-actions">
        <button
          className="dropdown-trigger"
          onClick={handleDropdownToggle}
          aria-label="Post options"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="6" r="1.5" fill="currentColor" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </button>

{/*         {showDropdown && (
          <PostDropdown
            show={showDropdown}
            setShow={setShowDropdown}
            post={post}
            currentUserId={currentUserId}
            onDelete={onDelete}
            onPostRemoved={onPostRemoved}
          />
        )} */}
      </div>
    </div>
  );
}

PostHeader.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    username: PropTypes.string.isRequired,
    UsersProfilePic: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    timestamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
  }).isRequired,
  showDropdown: PropTypes.bool.isRequired,
  setShowDropdown: PropTypes.func.isRequired,
  onUserClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onPostRemoved: PropTypes.func.isRequired,
};
