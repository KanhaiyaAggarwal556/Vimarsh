import { useState, useCallback, useEffect } from "react";
import useAuthStore from "@store/useAuthStore";
import { 
  usePostInteraction, 
  useToggleLike, 
  useToggleDislike 
} from "@/hooks/usePostInteractions";
import { useIntersectionViewTracking } from "@/hooks/useAutoViewTracking";
import "../style/PostActions.css";

// Import separated types
import {
  PostActionsProps,
  ActionButtonProps,
  UserInteractionData,
  PostActionsState,
} from "@/types/postActionsTypes";
import { UseViewTrackingResult } from "@/types/hookTypes";

// Number formatter utility
const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
};

// Action Button Component
const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  count, 
  active = false, 
  onClick, 
  label, 
  showText = false,
  text,
  variant = "default",
  loading = false
}) => {
  const getButtonClasses = () => {
    let classes = "action-button";
    if (active) {
      classes += " active";
      if (variant === "like") classes += " like";
      if (variant === "dislike") classes += " dislike";
      if (variant === "share") classes += " share";
    }
    if (loading) classes += " loading";
    return classes;
  };

  return (
    <button
      className={getButtonClasses()}
      onClick={onClick}
      aria-label={label}
      type="button"
      disabled={loading}
    >
      <span className="action-button-icon">
        {loading ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
            <circle cx="12" cy="12" r="10" opacity="0.25"/>
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        ) : icon}
      </span>
      {count !== undefined && (
        <span className="action-button-count">
          {formatNumber(count)}
        </span>
      )}
      {showText && text && (
        <span className="action-button-text">
          {loading ? "Loading..." : text}
        </span>
      )}
    </button>
  );
};

// Enhanced toast notification with login button
const showLoginWarning = (action: string): void => {
  const existingToast = document.querySelector('.auth-warning-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'auth-warning-toast';
  toast.innerHTML = `
    <div class="auth-modal-backdrop" onclick="if(event.target === this) this.remove()">
      <div class="auth-modal-content" onclick="event.stopPropagation()">
        <div class="auth-modal-header">
          <div class="auth-modal-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              <path d="M12 8v4m0 4h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
            </svg>
          </div>
          <div class="auth-modal-text">
            <div class="auth-modal-title">
              Login Required
            </div>
            <div class="auth-modal-message">
              You need to be logged in to ${action.toLowerCase()} this post. Please login to continue.
            </div>
          </div>
          <button class="auth-modal-close" onclick="this.closest('.auth-warning-toast').remove()" aria-label="Close modal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="auth-modal-actions">
          <button class="auth-modal-button auth-modal-button-cancel" onclick="this.closest('.auth-warning-toast').remove()">
            Cancel
          </button>
          <button class="auth-modal-button auth-modal-button-login" onclick="window.location.href='/i/account/login'">
            Login
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(toast);
  document.body.style.overflow = 'hidden';
  
  const autoRemoveTimer = setTimeout(() => {
    if (toast.parentNode) {
      document.body.style.overflow = 'unset';
      toast.remove();
    }
  }, 10000);
  
  const originalRemove = toast.remove;
  toast.remove = function() {
    document.body.style.overflow = 'unset';
    clearTimeout(autoRemoveTimer);
    originalRemove.call(this);
  };
};

// Main PostActions Component
const PostActions: React.FC<PostActionsProps> = ({
  post,
  onPostUpdate,
  onComments,
  isOnPostPage = false,
  referralSource = 'direct',
  enableViewTracking = true,
}) => {
  const { currentUser } = useAuthStore();
  
  // TanStack Query hooks
  const { data: userInteraction } = usePostInteraction(post._id, {
    enabled: !!currentUser && !!post._id
  });
  
  const toggleLikeMutation = useToggleLike();
  const toggleDislikeMutation = useToggleDislike();

  // View tracking hook with proper typing
  const { 
    ref: viewTrackingRef, 
    hasAttemptedTracking: hasViewBeenTracked,
    isTracking 
  }: UseViewTrackingResult = useIntersectionViewTracking(
    post._id,
    {
      enabled: enableViewTracking,
      referralSource,
      minViewDuration: isOnPostPage ? 2000 : 1000,
      threshold: 0.5,
      rootMargin: '0px',
    }
  );

  // Local state with proper typing - handle undefined views
  const [state, setState] = useState<PostActionsState>({
    reactions: {
      likes: post.reactions?.likes || 0,
      dislikes: post.reactions?.dislikes || 0,
    },
    viewCount: post.views ?? 0, // Use nullish coalescing to handle undefined
    isShareLoading: false, // Add missing property
  });

  // Extract user interaction status (only for authenticated users)
  const userInteractionData: UserInteractionData = {
    liked: userInteraction?.liked || false,
    disliked: userInteraction?.disliked || false,
  };

  // Sync reactions when post prop changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      reactions: {
        likes: post.reactions?.likes || 0,
        dislikes: post.reactions?.dislikes || 0,
      },
      viewCount: post.views ?? 0, // Handle undefined views
    }));
  }, [post.reactions, post.views]);

  // Update view count when tracking happens for any user
  useEffect(() => {
    if (hasViewBeenTracked && enableViewTracking && !isTracking) {
      console.log(`View tracked for post ${post._id}, updating local count`);
      setState(prev => ({
        ...prev,
        viewCount: prev.viewCount + 1,
      }));
    }
  }, [hasViewBeenTracked, enableViewTracking, isTracking, post._id]);

  // Authentication check wrapper - only for interactions, not views
  const withAuthCheck = (callback: () => void | Promise<void>, action: string) => {
    return async () => {
      if (!currentUser) {
        showLoginWarning(action);
        return;
      }
      await callback();
    };
  };

  // Handle like action with immediate UI updates
  const handleLike = useCallback(async () => {
    if (toggleLikeMutation.isPending) return;
    
    try {
      const wasLiked = userInteractionData.liked;
      const wasDisliked = userInteractionData.disliked;
      
      let newLikes = state.reactions.likes;
      let newDislikes = state.reactions.dislikes;
      
      if (wasLiked) {
        newLikes = Math.max(0, state.reactions.likes - 1);
      } else {
        newLikes = state.reactions.likes + 1;
        if (wasDisliked) {
          newDislikes = Math.max(0, state.reactions.dislikes - 1);
        }
      }

      setState(prev => ({
        ...prev,
        reactions: {
          likes: newLikes,
          dislikes: newDislikes,
        },
      }));
      
      await toggleLikeMutation.mutateAsync(post._id);
      
      onPostUpdate?.({
        ...post,
        views: state.viewCount, // This will be a number now
        reactions: {
          likes: newLikes,
          dislikes: newDislikes,
        },
      });
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        reactions: {
          likes: post.reactions?.likes || 0,
          dislikes: post.reactions?.dislikes || 0,
        },
      }));
      console.error("Failed to toggle like:", error);
    }
  }, [userInteractionData, state.reactions, post, state.viewCount, onPostUpdate, toggleLikeMutation]);

  // Handle dislike action with immediate UI updates
  const handleDislike = useCallback(async () => {
    if (toggleDislikeMutation.isPending) return;
    
    try {
      const wasLiked = userInteractionData.liked;
      const wasDisliked = userInteractionData.disliked;
      
      let newLikes = state.reactions.likes;
      let newDislikes = state.reactions.dislikes;
      
      if (wasDisliked) {
        newDislikes = Math.max(0, state.reactions.dislikes - 1);
      } else {
        newDislikes = state.reactions.dislikes + 1;
        if (wasLiked) {
          newLikes = Math.max(0, state.reactions.likes - 1);
        }
      }

      setState(prev => ({
        ...prev,
        reactions: {
          likes: newLikes,
          dislikes: newDislikes,
        },
      }));
      
      await toggleDislikeMutation.mutateAsync(post._id);
      
      onPostUpdate?.({
        ...post,
        views: state.viewCount, // This will be a number now
        reactions: {
          likes: newLikes,
          dislikes: newDislikes,
        },
      });
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        reactions: {
          likes: post.reactions?.likes || 0,
          dislikes: post.reactions?.dislikes || 0,
        },
      }));
      console.error("Failed to toggle dislike:", error);
    }
  }, [userInteractionData, state.reactions, post, state.viewCount, onPostUpdate, toggleDislikeMutation]);

  // Handle share action - UPDATED: No success toast
  const handleShare = useCallback(async () => {
    if (state.isShareLoading) return;
    
    setState(prev => ({ ...prev, isShareLoading: true }));
    
    try {
      const shareUrl = `${window.location.origin}/p/${post._id}`;
      
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: post.title || "Check out this post",
          text: post.description ? post.description.substring(0, 100) + "..." : undefined,
          url: shareUrl,
        };
        
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          // Removed: showSuccessToast("Post shared successfully!");
        } else {
          throw new Error("Share not supported");
        }
      } else {
        await navigator.clipboard.writeText(shareUrl);
        // Removed: showSuccessToast("Link copied to clipboard!");
      }
    } catch (error) {
      if (error !== 'AbortError') {
        console.error("Share failed:", error);
        try {
          const shareUrl = `${window.location.origin}/p/${post._id}`;
          await navigator.clipboard.writeText(shareUrl);
          // Removed: showSuccessToast("Link copied to clipboard!");
        } catch (clipboardError) {
          console.error("Clipboard fallback failed:", clipboardError);
          // Removed: showSuccessToast("Unable to share. Please copy the URL manually.");
        }
      }
    } finally {
      setState(prev => ({ ...prev, isShareLoading: false }));
    }
  }, [post._id, post.title, post.description, state.isShareLoading]);

  // Handle comments
  const handleComments = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isOnPostPage && post._id) {
      window.location.href = `/p/${post._id}`;
      return;
    }
    
    onComments();
  }, [isOnPostPage, post._id, onComments]);

  // Debug info in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`PostActions for ${post._id}:`, {
        enableViewTracking,
        hasViewBeenTracked,
        isTracking,
        currentViewCount: state.viewCount,
        originalViewCount: post.views,
        userAuthenticated: !!currentUser,
        referralSource
      });
    }
  }, [post._id, enableViewTracking, hasViewBeenTracked, isTracking, state.viewCount, post.views, currentUser, referralSource]);

  return (
    <div 
      className="post-actions-container" 
      ref={viewTrackingRef as React.RefObject<HTMLDivElement>}
    >
      <div className="post-actions-group">
        <ActionButton
          icon={
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
              <path 
                d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" 
                fill={userInteractionData.liked ? 'currentColor' : 'none'}
                stroke="currentColor"
              />
            </svg>
          }
          count={state.reactions.likes}
          active={userInteractionData.liked}
          onClick={withAuthCheck(handleLike, "Like")}
          label={userInteractionData.liked ? "Unlike" : "Like"}
          variant="like"
          loading={toggleLikeMutation.isPending}
        />
        
        <ActionButton
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
              <path 
                d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" 
                fill={userInteractionData.disliked ? 'currentColor' : 'none'}
                stroke="currentColor"
              />
            </svg>
          }
          count={state.reactions.dislikes}
          active={userInteractionData.disliked}
          onClick={withAuthCheck(handleDislike, "Dislike")}
          label={userInteractionData.disliked ? "Remove dislike" : "Dislike"}
          variant="dislike"
          loading={toggleDislikeMutation.isPending}
        />
        
        <ActionButton
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
          onClick={withAuthCheck(handleComments, "Comment")}
          label={isOnPostPage ? "Toggle comments" : "View comments"}
          showText={true}
          text="Comment"
        />
      </div>

      <div className="post-actions-group">
        <ActionButton
          icon={
            state.isShareLoading ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
                <circle cx="12" cy="12" r="10" opacity="0.25"/>
                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '100%', height: '100%' }}>
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            )
          }
          onClick={withAuthCheck(handleShare, "Share")}
          label="Share post"
          showText={true}
          text={state.isShareLoading ? "Sharing..." : "Share"}
          variant="share"
          loading={state.isShareLoading}
        />
        
        <div className="views-counter">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="views-counter-icon">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>{formatNumber(state.viewCount)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostActions;