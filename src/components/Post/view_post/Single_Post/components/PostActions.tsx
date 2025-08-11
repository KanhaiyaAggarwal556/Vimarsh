import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@store/useAuthStore"; // Adjust path as needed
import { postAPI } from "../services/API"; // Adjust path as needed
import LoginModal from "./LoginModal"; // Adjust path as needed
import "../style/PostAction.css";

// PostData interface - Updated to fix userInteraction type
interface PostData {
  _id: string;
  views: number;
  reactions: {
    likes: number;
    dislikes: number;
  };
  title?: string;
  description?: string;
  userInteraction?: {
    liked?: boolean;
    disliked?: boolean;
    saved?: boolean;
    viewed?: boolean;
  };
}

interface PostActionsProps {
  post: PostData;
  onPostUpdate?: (updatedPost: PostData) => void;
  onComments: () => void;
  isOnPostPage?: boolean;
  enableCommentNavigation?: boolean;
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

// SaveShareViewsCounter component props interface
interface SaveShareViewsCounterProps {
  views?: number;
  userSaved?: boolean;
  saveAnimation?: boolean;
  shareAnimation?: boolean;
  onSave: () => void;
  onShare: () => void;
  post: PostData;
  compact?: boolean;
  formatCount?: (count: number) => string;
}

// Optimized ReactionButtons Component
function ReactionButtons({
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
  // Optimized click handlers with instant visual feedback only
  const handleLikeClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Only trigger visual feedback - no number changes until server confirms
      onLike();
    },
    [onLike]
  );

  const handleDislikeClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Only trigger visual feedback - no number changes until server confirms
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

// Optimized SaveShareViewsCounter Component
function SaveShareViewsCounter({
  views = 0,
  userSaved = false,
  saveAnimation = false,
  shareAnimation = false,
  onSave,
  onShare,
  compact = false,
  formatCount,
}: SaveShareViewsCounterProps) {
  const handleSaveClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Only trigger visual feedback
      if (onSave) {
        onSave();
      }
    },
    [onSave]
  );

  const handleShareClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Immediate UI feedback for share
      if (onShare) {
        onShare();
      }
    },
    [onShare]
  );

  const defaultFormatCount = useCallback((count: number) => {
    if (count === 0) return "0";
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  }, []);

  const displayFormat = formatCount || defaultFormatCount;

  return (
    <div className={`save-views-container ${compact ? "compact" : ""}`}>
      <div className="engagement-actions">
        {/* Save Button */}
        <div className="tooltip-container">
          <button
            className={`engagement-btn ${userSaved ? "saved" : ""}`}
            onClick={handleSaveClick}
            aria-label={`${userSaved ? "Remove from saved" : "Save"} this post`}
            aria-pressed={userSaved}
          >
            <span
              className={`engagement-icon ${
                saveAnimation ? "animate-scale" : ""
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={userSaved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </span>
            {!compact && <span className="action-text">Save</span>}
          </button>
          <div className="tooltip">
            {userSaved ? "Remove from saved" : "Save post"}
          </div>
        </div>

        {/* Share Button */}
        <div className="tooltip-container">
          <button
            className="engagement-btn"
            onClick={handleShareClick}
            aria-label="Share this post"
          >
            <span
              className={`engagement-icon ${
                shareAnimation ? "animate-wobble" : ""
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </span>
            {!compact && <span className="action-text">Share</span>}
          </button>
          <div className="tooltip">Share post</div>
        </div>

        {/* Views */}
        <div className="tooltip-container">
          <div className="engagement-item">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="engagement-count">{displayFormat(views)}</span>
          </div>
          <div className="tooltip">{displayFormat(views)} views</div>
        </div>
      </div>
    </div>
  );
}

// Define types for reaction data and user interaction
interface ReactionData {
  likes: number;
  dislikes: number;
}

interface UserInteractionData {
  liked: boolean;
  disliked: boolean;
  saved: boolean;
  viewed?: boolean;
}

// Main PostActions Component with FIXED state persistence
export default function PostActions({
  post,
  onPostUpdate,
  onComments,
  isOnPostPage = false,
  enableCommentNavigation = true,
}: PostActionsProps) {
  const { currentUser } = useAuthStore();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // FIXED: Proper initialization with fallback values and better state management
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [userSaved, setUserSaved] = useState(false);

  // Animation states for visual feedback
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [dislikeAnimation, setDislikeAnimation] = useState(false);
  const [saveAnimation, setSaveAnimation] = useState(false);
  const [shareAnimation, setShareAnimation] = useState(false);

  // Stable counts - only updated from server responses
  const [stableReactions, setStableReactions] = useState<ReactionData>({
    likes: post.reactions?.likes || 0,
    dislikes: post.reactions?.dislikes || 0,
  });
  const [stableViews, setStableViews] = useState(post.views || 0);

  // FIXED: Simplified and more reliable initialization logic
  useEffect(() => {
    console.log("PostActions Debug - Post data:", {
      postId: post._id,
      userInteraction: post.userInteraction,
      currentUser:
        currentUser?.id || (currentUser as any)?._id || "Not logged in",
    });

    // FIXED: Direct state setting without complex comparisons
    const interaction = post.userInteraction || {};

    // Initialize user interaction states directly
    setUserLiked(!!interaction.liked);
    setUserDisliked(!!interaction.disliked);
    setUserSaved(!!interaction.saved);

    // Update stable counts directly
    setStableReactions({
      likes: post.reactions?.likes || 0,
      dislikes: post.reactions?.dislikes || 0,
    });

    setStableViews(post.views || 0);

    console.log("PostActions Debug - Setting states:", {
      liked: !!interaction.liked,
      disliked: !!interaction.disliked,
      saved: !!interaction.saved,
      reactions: {
        likes: post.reactions?.likes || 0,
        dislikes: post.reactions?.dislikes || 0,
      },
      views: post.views || 0,
    });
  }, [post._id, post.userInteraction, post.reactions, post.views, currentUser]);

  // Debug logging for state changes
  useEffect(() => {
    console.log("PostActions Debug - User states updated:", {
      postId: post._id,
      userLiked,
      userDisliked,
      userSaved,
    });
  }, [userLiked, userDisliked, userSaved, post._id]);

  // Optimized view tracking
  useEffect(() => {
    if (post._id && !post.userInteraction?.viewed && currentUser) {
      const timer = setTimeout(async () => {
        try {
          const response = await postAPI.incrementViews(post._id);
          // Only update views from server response
          if (response?.data?.views !== undefined) {
            setStableViews(response.data.views);
          }
        } catch (error) {
          console.error("Failed to increment views:", error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [post._id, post.userInteraction?.viewed, currentUser]);

  // Optimized resize handler with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsSmallScreen(window.innerWidth <= 768);
      }, 100);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Memoized format function
  const formatCount = useCallback((count: number) => {
    if (count === 0) return "0";
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  }, []);

  // Check authentication before actions
  const requireAuth = useCallback(() => {
    if (!currentUser) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  }, [currentUser]);

  // Update post data and notify parent with current stable data
  const updatePostData = useCallback(
    (newReactions: ReactionData, userInteraction: UserInteractionData) => {
      const updatedPost: PostData = {
        ...post,
        reactions: newReactions,
        views: stableViews,
        userInteraction: {
          ...post.userInteraction,
          ...userInteraction,
          viewed: post.userInteraction?.viewed || false,
        },
      };

      if (onPostUpdate) {
        onPostUpdate(updatedPost);
      }
    },
    [post, stableViews, onPostUpdate]
  );

  // FIXED: Simplified like handler
  const handleLike = useCallback(async () => {
    if (!requireAuth()) return;

    const wasLiked = userLiked;
    const wasDisliked = userDisliked;

    console.log("PostActions Debug - Like clicked:", {
      postId: post._id,
      wasLiked,
      wasDisliked,
      currentUser: currentUser?.id || (currentUser as any)?._id,
    });

    // Instant visual feedback
    setUserLiked(!wasLiked);
    if (wasDisliked && !wasLiked) {
      setUserDisliked(false);
    }

    // Visual animation feedback
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 200);

    // Background API call
    try {
      // Handle dislike removal if user was previously disliked
      if (wasDisliked && !wasLiked) {
        await postAPI.updateReaction(post._id, "dislikes", "decrement");
      }

      const likeAction = wasLiked ? "decrement" : "increment";
      const response = await postAPI.updateReaction(
        post._id,
        "likes",
        likeAction
      );

      console.log("PostActions Debug - Like API response:", response.data);

      // Update stable counts from server response
      if (response.data?.post?.reactions) {
        const serverReactions = {
          likes: response.data.post.reactions.likes || 0,
          dislikes: response.data.post.reactions.dislikes || 0,
        };

        setStableReactions(serverReactions);

        // Update parent with server-confirmed data
        updatePostData(serverReactions, {
          liked: !wasLiked,
          disliked: wasDisliked && !wasLiked ? false : wasDisliked,
          saved: userSaved,
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);

      // Revert visual states on error
      setUserLiked(wasLiked);
      if (wasDisliked && !wasLiked) {
        setUserDisliked(true);
      }
    }
  }, [
    requireAuth,
    userLiked,
    userDisliked,
    userSaved,
    post._id,
    updatePostData,
    currentUser,
  ]);

  // FIXED: Simplified dislike handler
  const handleDislike = useCallback(async () => {
    if (!requireAuth()) return;

    const wasLiked = userLiked;
    const wasDisliked = userDisliked;

    console.log("PostActions Debug - Dislike clicked:", {
      postId: post._id,
      wasLiked,
      wasDisliked,
      currentUser: currentUser?.id || (currentUser as any)?._id,
    });

    // Instant visual feedback
    setUserDisliked(!wasDisliked);
    if (wasLiked && !wasDisliked) {
      setUserLiked(false);
    }

    // Visual animation feedback
    setDislikeAnimation(true);
    setTimeout(() => setDislikeAnimation(false), 200);

    // Background API call
    try {
      // Handle like removal if user previously liked
      if (wasLiked && !wasDisliked) {
        await postAPI.updateReaction(post._id, "likes", "decrement");
      }

      const dislikeAction = wasDisliked ? "decrement" : "increment";
      const response = await postAPI.updateReaction(
        post._id,
        "dislikes",
        dislikeAction
      );

      console.log("PostActions Debug - Dislike API response:", response.data);

      // Update stable counts from server response
      if (response.data?.post?.reactions) {
        const serverReactions = {
          likes: response.data.post.reactions.likes || 0,
          dislikes: response.data.post.reactions.dislikes || 0,
        };

        setStableReactions(serverReactions);

        // Update parent with server-confirmed data
        updatePostData(serverReactions, {
          liked: wasLiked && !wasDisliked ? false : wasLiked,
          disliked: !wasDisliked,
          saved: userSaved,
        });
      }
    } catch (error) {
      console.error("Error updating dislike:", error);

      // Revert visual states on error
      setUserDisliked(wasDisliked);
      if (wasLiked && !wasDisliked) {
        setUserLiked(true);
      }
    }
  }, [
    requireAuth,
    userLiked,
    userDisliked,
    userSaved,
    post._id,
    updatePostData,
    currentUser,
  ]);

  // FIXED: Optimized save handler with better error handling
  const handleSave = useCallback(async () => {
    if (!requireAuth()) return;

    const wasSaved = userSaved;

    console.log("PostActions Debug - Save clicked:", {
      postId: post._id,
      wasSaved,
      currentUser: currentUser?.id || (currentUser as any)?._id,
    });

    // Instant visual feedback
    setUserSaved(!wasSaved);
    setSaveAnimation(true);
    setTimeout(() => setSaveAnimation(false), 200);

    // Background API call
    try {
      const saveAction = wasSaved ? "decrement" : "increment";
      const response = await postAPI.updateReaction(
        post._id,
        "saves",
        saveAction
      );

      console.log("PostActions Debug - Save API response:", response.data);

      // Update parent with current stable data
      updatePostData(stableReactions, {
        liked: userLiked,
        disliked: userDisliked,
        saved: !wasSaved,
      });
    } catch (error) {
      console.error(
        "Error updating save:",
        error instanceof Error ? error.message : "Unknown error"
      );

      // Revert on error
      setUserSaved(wasSaved);

      // Optional: Show error feedback
      // showErrorToast('Failed to save post. Please try again.');
    }
  }, [
    requireAuth,
    userSaved,
    userLiked,
    userDisliked,
    post._id,
    updatePostData,
    stableReactions,
    currentUser,
  ]);

  // Share handler - no changes needed here
  const handleShare = useCallback(async () => {
    setShareAnimation(true);

    try {
      const shareUrl = `${window.location.origin}/p/${post._id}`;

      if (navigator.share) {
        await navigator.share({
          title: post.title || "Check out this post",
          text: post.description || "Interesting post to share",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error(
        "Error sharing post:",
        error instanceof Error ? error.message : "Unknown error"
      );
      if (error instanceof Error && error.name !== "AbortError") {
        alert("Failed to share post. Please try again.");
      }
    } finally {
      setTimeout(() => setShareAnimation(false), 300);
    }
  }, [post._id, post.title, post.description]);

  const handleLoginModalClose = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const handleLoginRedirect = useCallback(() => {
    setShowLoginModal(false);
    window.location.href = "/i/account/login";
  }, []);

  const showCompactView = isSmallScreen;

  return (
    <>
      <div
        className="post-actions"
        role="toolbar"
        aria-label="Post interaction options"
      >
        <ReactionButtons
          currentLikes={stableReactions.likes}
          currentDislikes={stableReactions.dislikes}
          userLiked={userLiked}
          userDisliked={userDisliked}
          likeAnimation={likeAnimation}
          dislikeAnimation={dislikeAnimation}
          onLike={handleLike}
          onDislike={handleDislike}
          onComments={onComments}
          post={post}
          compact={showCompactView}
          formatCount={formatCount}
          isOnPostPage={isOnPostPage}
          enableCommentNavigation={enableCommentNavigation}
        />

        <SaveShareViewsCounter
          views={stableViews}
          userSaved={userSaved}
          saveAnimation={saveAnimation}
          shareAnimation={shareAnimation}
          onSave={handleSave}
          onShare={handleShare}
          post={post}
          compact={showCompactView}
          formatCount={formatCount}
        />
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleLoginModalClose}
        onLogin={handleLoginRedirect}
      />
    </>
  );
}
