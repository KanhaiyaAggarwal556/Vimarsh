import { useState, useEffect, useCallback } from "react";
import ReactionButtons from "../UI/ReactionButtons";
import ShareAndViewCounter from "../UI/ShareAndViewsCounter";
import "../style/PostAction.css";

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
  userInteraction?: {
    liked?: boolean;
    disliked?: boolean;
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

// Main PostActions Component
export default function PostActions({
  post,
  onPostUpdate,
  onComments,
  isOnPostPage = false,
  enableCommentNavigation = true,
}: PostActionsProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Local state for user interactions (frontend only)
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  // Animation states for visual feedback
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [dislikeAnimation, setDislikeAnimation] = useState(false);
  const [shareAnimation, setShareAnimation] = useState(false);

  // Local counts that update immediately for better UX
  const [localReactions, setLocalReactions] = useState({
    likes: post.reactions?.likes || 0,
    dislikes: post.reactions?.dislikes || 0,
  });
  const [localViews, setLocalViews] = useState(post.views || 0);

  // Initialize from post data
  useEffect(() => {
    setUserLiked(!!post.userInteraction?.liked);
    setUserDisliked(!!post.userInteraction?.disliked);
    setLocalReactions({
      likes: post.reactions?.likes || 0,
      dislikes: post.reactions?.dislikes || 0,
    });
    setLocalViews(post.views || 0);
  }, [post._id, post.userInteraction, post.reactions, post.views]);

  // Responsive design handler
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

  // Update post data and notify parent
  const updatePostData = useCallback(
    (newReactions: { likes: number; dislikes: number }) => {
      const updatedPost: PostData = {
        ...post,
        reactions: newReactions,
        views: localViews,
        userInteraction: {
          ...post.userInteraction,
          liked: userLiked,
          disliked: userDisliked,
          viewed: post.userInteraction?.viewed || false,
        },
      };

      if (onPostUpdate) {
        onPostUpdate(updatedPost);
      }
    },
    [post, localViews, userLiked, userDisliked, onPostUpdate]
  );

  // Like handler (frontend only)
  const handleLike = useCallback(() => {
    const wasLiked = userLiked;
    const wasDisliked = userDisliked;

    // Update UI immediately
    setUserLiked(!wasLiked);
    
    // If user was disliked, remove dislike
    if (wasDisliked && !wasLiked) {
      setUserDisliked(false);
    }

    // Update counts immediately
    const newReactions = {
      likes: wasLiked 
        ? localReactions.likes - 1 
        : localReactions.likes + 1,
      dislikes: (wasDisliked && !wasLiked) 
        ? localReactions.dislikes - 1 
        : localReactions.dislikes,
    };

    setLocalReactions(newReactions);
    
    // Visual feedback
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 200);

    // Update parent component
    updatePostData(newReactions);
  }, [userLiked, userDisliked, localReactions, updatePostData]);

  // Dislike handler (frontend only)
  const handleDislike = useCallback(() => {
    const wasLiked = userLiked;
    const wasDisliked = userDisliked;

    // Update UI immediately
    setUserDisliked(!wasDisliked);
    
    // If user was liked, remove like
    if (wasLiked && !wasDisliked) {
      setUserLiked(false);
    }

    // Update counts immediately
    const newReactions = {
      likes: (wasLiked && !wasDisliked) 
        ? localReactions.likes - 1 
        : localReactions.likes,
      dislikes: wasDisliked 
        ? localReactions.dislikes - 1 
        : localReactions.dislikes + 1,
    };

    setLocalReactions(newReactions);
    
    // Visual feedback
    setDislikeAnimation(true);
    setTimeout(() => setDislikeAnimation(false), 200);

    // Update parent component
    updatePostData(newReactions);
  }, [userLiked, userDisliked, localReactions, updatePostData]);

  // Share handler (frontend only)
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
      console.error("Error sharing post:", error);
      if (error instanceof Error && error.name !== "AbortError") {
        alert("Failed to share post. Please try again.");
      }
    } finally {
      setTimeout(() => setShareAnimation(false), 300);
    }
  }, [post._id, post.title, post.description]);

  const showCompactView = isSmallScreen;

  return (
    <div
      className="post-actions"
      role="toolbar"
      aria-label="Post interaction options"
    >
      <ReactionButtons
        currentLikes={localReactions.likes}
        currentDislikes={localReactions.dislikes}
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

      <ShareAndViewCounter
        views={localViews}
        shareAnimation={shareAnimation}
        onShare={handleShare}
        compact={showCompactView}
        formatCount={formatCount}
      />
    </div>
  );
}