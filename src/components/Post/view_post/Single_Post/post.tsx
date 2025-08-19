// components/Single_Post/post.tsx
import { useState } from "react";
import PostHeader from "./components/PostHeader";
import PostContent from "./components/PostContent";
import PostActions from "./components/PostActions";
import PostComments from "./components/PostComments";
import { PostProps, convertToPostActionsData } from "@/types/postTypes";
import { usePostMutations } from "@/hooks/usePostMutations";
import "./style/post.css";

export default function Post({
  showComments = false,
  postId,
  post,
  onDelete, // Optional parent callback
  isDeleting = false
}: PostProps) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showCommentsState, setShowCommentsState] = useState<boolean>(showComments);
  
  // Use the centralized mutations hook for any parent-level state management
  const {
    togglePin,
    toggleFollow,
    toggleBookmark,
    deletePost,
    isTogglingPin,
    isTogglingFollow,
    isTogglingBookmark,
    isDeletingPost,
  } = usePostMutations();

  // Early return if no post data
  if (!post) {
    console.error("Post component: No post data provided");
    return (
      <div className="post-card error">
        <div className="error-state">
          <span>Error: No post data available</span>
        </div>
      </div>
    );
  }

  // Use post._id if postId is not provided or is invalid
  const validPostId = postId && postId !== "undefined" ? postId : post?._id;

  // Early return if no valid post ID
  if (!validPostId) {
    console.error("Post component: No valid post ID available", {
      postId,
      post_id: post._id,
    });
    return (
      <div className="post-card error">
        <div className="error-state">
          <span>Error: Invalid post ID</span>
        </div>
      </div>
    );
  }

  // Fixed: Modified to use the deletePost mutation from the hook
  const handleDelete = (): void => {
    console.log('🗑️ Delete callback from parent');
    setShowDropdown(false);
    
    // Use the mutation from the hook
    try {
      deletePost(validPostId);
      // Call parent callback if provided for additional handling
      if (onDelete) {
        onDelete(validPostId);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handlePin = (): void => {
    console.log('📌 Pin/Unpin post:', validPostId);
    try {
      togglePin(validPostId);
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleFollow = (): void => {
    console.log('👥 Follow/Unfollow user:', post.user._id);
    try {
      toggleFollow(post.user._id);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleBookmark = (): void => {
    console.log('🔖 Bookmark/Unbookmark post:', validPostId);
    try {
      toggleBookmark(validPostId);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleUserClick = (): void => {
    console.log("👤 User clicked:", post.user._id);
  };

  // Convert PostDataExtended to PostActionsData for PostActions component
  const postActionsData = convertToPostActionsData(post);

  return (
    <div className={`post-card ${isDeleting ? "deleting" : ""}`}>
      <div className="post-card-body">
        {/* PostHeader - now includes all required props */}
        <PostHeader
          post={post}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          onUserClick={handleUserClick}
          onDelete={handleDelete}
          onPin={handlePin}
          onFollow={handleFollow}
          onBookmark={handleBookmark}
          pinPending={isTogglingPin}
          deletePending={isDeletingPost}
          followPending={isTogglingFollow}
          bookmarkPending={isTogglingBookmark}
        />

        <PostContent post={post} />

        {/* PostActions - handles reactions, removed onReactionUpdate prop */}
        <PostActions 
          post={postActionsData}
          enableViewTracking={true}
          referralSource="feed"
          onPostUpdate={(updated) => console.log('Updated:', updated)}
          onComments={() => setShowCommentsState(!showCommentsState)}
          // Removed onReactionUpdate since it's not in PostActionsProps interface
        />

        <PostComments showComments={showCommentsState} postId={validPostId} />
      </div>
    </div>
  );
}