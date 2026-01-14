// Debug version of the follow button handling in PostHeader
import React from "react";
import UserAvatar from "../UI/UserAvatar";
import PostDropdown from "./PostDropdown";
import useAuthStore from "@/store/useAuthStore";
import { usePostMutations } from "@/hooks/usePostMutations";
import { useFollowState } from "@/hooks/useFollowState";
import { PostHeaderProps } from "@/types/postTypes";
import { AuthUser } from "@/types/authTypes";
import "../style/PostHeader.css";

// Helper function to format time with mobile/desktop responsive formatting
function formatPostTime(timestamp: string): string {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - postTime.getTime()) / 1000);
  
  // Check if we're on mobile (simple viewport-based check)
  const isMobile = window.innerWidth <= 768;

  // Less than 1 minute - show "now"
  if (diffInSeconds < 60) {
    return "now";
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

  // Calculate months more accurately
  const diffInMonths = 
    (now.getFullYear() - postTime.getFullYear()) * 12 + 
    (now.getMonth() - postTime.getMonth());

  // Less than 12 months - show months with responsive formatting
  if (diffInMonths < 12) {
    // Handle edge case where it's been 4+ weeks but less than 1 full month
    if (diffInMonths === 0) {
      return `${diffInWeeks}w`;
    }
    
    if (isMobile) {
      return `${diffInMonths}M`; // Mobile: "1M", "6M"
    } else {
      return diffInMonths === 1 ? "1 month" : `${diffInMonths} months`; // Desktop: "1 month", "6 months"
    }
  }

  // 12 months or more - show actual date (same for both mobile and desktop)
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric" // Always show year for posts 1+ years old
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
  onFollow,
  onBookmark,
  pinPending,
  deletePending,
  followPending,
  bookmarkPending,
}: PostHeaderProps) {
  // Get current user from auth store
  const currentUser = useAuthStore((state) => state.currentUser) as AuthUser | null;
  const isOwnPost = currentUser && currentUser._id === post.user._id;


  // Use the centralized mutations hook for other functionality
  const {
    isTogglingPin,
    isTogglingBookmark,
    isDeletingPost,
  } = usePostMutations();

  // Use the follow state hook for follow functionality
  const { getFollowState, toggleFollow, isFollowPending } = useFollowState();

  // Get the current follow state (local state takes precedence)
  const currentFollowState = getFollowState(post.user._id, post.user.isFollowing ?? false);
  const followPendingState = isFollowPending(post.user._id);

  // Use parent pending states if provided, otherwise use hook states
  const actualPinPending = pinPending ?? isTogglingPin;
  const actualBookmarkPending = bookmarkPending ?? isTogglingBookmark;
  const actualFollowPending = followPending ?? followPendingState;
  const actualDeletePending = deletePending ?? isDeletingPost;


  const handleUserClick = (e: React.MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    // Close dropdown if open
    if (showDropdown) {
      setShowDropdown(false);
    }
    // Navigate to user profile page with userName in URL
    window.location.href = `/${post.user.userName}`;
    onUserClick?.();
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

  // ENHANCED FOLLOW BUTTON HANDLER WITH BETTER DEBUGGING
  const handleFollowClick = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚀 Follow button clicked!', {
      target: e.target,
      currentTarget: e.currentTarget,
      isPending: actualFollowPending,
      userId: post.user._id,
      currentFollowState,
      hasParentCallback: !!onFollow
    });
    
    // Prevent double clicks
    if (actualFollowPending) {
      console.log('⏳ Follow action already pending, skipping...');
      return;
    }

    // Check if user is authenticated
    if (!currentUser) {
      console.log('❌ No current user, cannot follow');
      return;
    }

    // Prevent self-follow
    if (isOwnPost) {
      console.log('❌ Cannot follow own post');
      return;
    }

    console.log('✅ Follow action starting:', {
      originalFollowState: post.user.isFollowing,
      currentFollowState: currentFollowState,
      userId: post.user._id,
      postId: post._id,
      willUseParentCallback: !!onFollow
    });
    
    try {
      // Use parent callback if provided, otherwise use local follow state
      if (onFollow) {
        console.log('📞 Using parent onFollow callback');
        await onFollow();
        console.log('✅ Parent onFollow callback completed');
      } else {
        console.log('🔄 Using local follow state management');
        const result = await toggleFollow(post.user._id, post.user.isFollowing ?? false);
        console.log('✅ Local toggleFollow completed:', result);
      }
    } catch (error) {
      console.error('❌ Error toggling follow:', error);
      // You might want to show a toast notification here
    }
  };

  // Simplified header click handler - no longer navigates to post page
  const handleHeaderClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Check if the clicked element is an interactive element or its child
    const target = e.target as HTMLElement;
    const isInteractiveElement =
      target.closest(".user-avatar-container") ||
      target.closest(".username") ||
      target.closest(".post-location") ||
      target.closest(".dropdown-trigger") ||
      target.closest(".post-dropdown") ||
      target.closest(".post-time") ||
      target.closest(".follow-button-inline");

    if (isInteractiveElement) {
      console.log('🚫 Clicked on interactive element, preventing header click');
      return; // Don't handle for interactive elements
    }

    console.log('📍 Header clicked on non-interactive area');

    // If dropdown is open, close it
    if (showDropdown) {
      setShowDropdown(false);
      return;
    }
  };

  // Determine current follow state and button text
  const isFollowing = currentFollowState;
  const followButtonText = actualFollowPending 
    ? "..." 
    : isFollowing 
      ? "Following" 
      : "Follow";

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
            {/* Follow Button - Only shown for other users' posts */}
            {!isOwnPost && (
              <>
                <span className="post-time-separator">•</span>
                <button
                  className={`follow-button-inline ${
                    isFollowing ? 'following' : 'not-following'
                  } ${actualFollowPending ? 'pending' : ''}`}
                  onClick={handleFollowClick}
                  disabled={actualFollowPending}
                  type="button"
                  style={{
                    // Temporary debug styles to make sure button is visible and clickable
                    border: '1px solid red',
                    minWidth: '60px',
                    minHeight: '24px'
                  }}
                >
                  {followButtonText}
                </button>
              </>
            )}
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
        {/* Only show pin icon if it's the current user's post and it's pinned */}
        {isOwnPost && post.isPinned && (
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
          disabled={actualDeletePending}
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
            onBookmark={onBookmark}
            pinPending={actualPinPending}
            deletePending={actualDeletePending}
            bookmarkPending={actualBookmarkPending}
          />
        )}
      </div>
    </div>
  );
}