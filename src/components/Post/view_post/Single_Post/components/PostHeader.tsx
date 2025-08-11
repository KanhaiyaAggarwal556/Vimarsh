import React from "react";
import UserAvatar from "../UI/UserAvatar";
import PostDropdown from "./PostDropdown";
import "../style/PostHeader.css";

// Define the PostData interface locally since it's not exported
interface PostUser {
  _id: string;
  userName: string;
  fullName: string;
  profilepic: string;
  isFollowing?: boolean;
}

interface PostData {
  _id: string;
  user: PostUser;
  isPinned: boolean;
  createdAt: string;
  location?: string;
}

interface PostHeaderProps {
  post: PostData;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  onUserClick: () => void;
  onDelete: () => void;
  onPin: () => void;
  onFollow: () => void; // Added onFollow prop
  pinPending: boolean;
  deletePending: boolean;
  followPending?: boolean; // Added followPending prop
}

// Helper function to format time like YouTube with date fallback
function formatPostTime(timestamp: string): string {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - postTime.getTime()) / 1000);

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
    return `${diffInMonths}mo`;
  }

  // 6 months or more - show actual date
  const options: Intl.DateTimeFormatOptions = {
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
  onUserClick,
  onDelete,
  onPin,
  onFollow, // Added onFollow
  pinPending,
  deletePending,
  followPending = false, // Added followPending with default
}: PostHeaderProps) {
  const handleUserClick = (e: React.MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    // Close dropdown if open
    if (showDropdown) {
      setShowDropdown(false);
    }
    // Navigate to user profile page with userName in URL
    window.location.href = `/${post.user.userName}`;
    onUserClick();
  };

  const handleLocationClick = (e: React.MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    if (post.location) {
      // Open Google Maps with the location
      const googleMapsUrl = `${import.meta.env.VITE_GOOGLE_MAP_URL_KEY}?api=1&query=${encodeURIComponent(post.location)}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handlePostClick = (e: React.MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    // Close dropdown if open
    if (showDropdown) {
      setShowDropdown(false);
    }
    // Navigate to post page with userName/status/postId in URL
    window.location.href = `/p/${post._id}`;
  };

  // Close dropdown when clicking anywhere else in the header
  const handleHeaderClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Check if the clicked element is an interactive element or its child
    const target = e.target as HTMLElement;
    const isInteractiveElement =
      target.closest(".user-avatar-container") ||
      target.closest(".username") ||
      target.closest(".post-location") ||
      target.closest(".dropdown-trigger") ||
      target.closest(".post-dropdown") ||
      target.closest(".post-time");

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
              avatar: post.user.profilepic,
              name: post.user.fullName,
              id: post.user._id,
            }}
            size={44}
          />
        </div>

        <div className="post-user-details">
          <div className="post-user-name">
            <span className="username" onClick={handleUserClick}>
              {post.user.userName}
            </span>
            <span className="post-time-separator">•</span>
            <span className="post-time" onClick={(e) => e.stopPropagation()}>
              {formatPostTime(post.createdAt)}
            </span>
          </div>

          {post.location && (
            <div className="post-meta">
              <span className="post-location" onClick={handleLocationClick} title="Click to view on Google Maps">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="location-icon">
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
                {post.location}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="post-action">
        {post.isPinned && (
          <div className="pinned-indicator" title="Pinned post">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 12V4a1 1 0 00-1-1h-1V2a1 1 0 00-2 0v1h-2V2a1 1 0 00-2 0v1H7a1 1 0 00-1 1v8l-2 2v1h5v4l2 2v-6h2v6l2-2v-4h5v-1l-2-2z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
        
        <button
          className="dropdown-trigger"
          onClick={handleDropdownToggle}
          aria-label="Post options"
          type="button"
          disabled={deletePending}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="6" r="1.5" fill="currentColor" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </button>

        {showDropdown && (
          <PostDropdown
            show={showDropdown}
            setShow={setShowDropdown}
            post={post}
            onDelete={onDelete}
            onPin={onPin}
            onFollow={onFollow}
            pinPending={pinPending}
            deletePending={deletePending}
            followPending={followPending}
          />
        )}
      </div>
    </div>
  );
}