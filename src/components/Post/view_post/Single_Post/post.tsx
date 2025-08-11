import { useState } from "react";
import PostHeader from "./components/PostHeader";
import PostContent from "./components/PostContent";
import PostActions from "./components/PostActions";
import PostComments from "./components/PostComments";
import "./style/post.css";

// Type definitions
interface CommentReactions {
  likes: number;
  dislikes: number;
}

interface CommentUser {
  _id: string;
  username: string;
  email?: string;
}

interface Comment {
  _id: string;
  id?: number;
  body: string;
  post: string;
  user: CommentUser;
  reactions: CommentReactions;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  fullName: string;
  userName: string;
  profilepic: string;
}

interface Reactions {
  likes: number;
  dislikes: number;
  shares: number;
  saves: number;
}

interface PostData {
  _id: string;
  title: string;
  description: string;
  reactions: Reactions;
  images?: string[];
  videos?: string[];
  tags?: string[];
  location?: string;
  views: number;
  isPinned: boolean;
  user: User;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface PostProps {
  showComments?: boolean; // Made optional with default
  comments?: Comment[]; // Made optional as PostComments will fetch its own data
  postId?: string; // Made optional, will use post._id if not provided
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onRetry?: () => void;
  post: PostData;
  onDelete?: (postId: string) => void;
  onReactionUpdate?: (
    postId: string,
    type: "likes" | "dislikes" | "shares" | "saves",
    action: "increment" | "decrement"
  ) => Promise<any>;
  onTogglePin?: (postId: string) => Promise<any>;
  isDeleting?: boolean;
  // New props for user interaction states (optional - PostActions will manage if not provided)
  initialUserLiked?: boolean;
  initialUserDisliked?: boolean;
  initialUserSaved?: boolean;
}

export default function Post({
  showComments = false, // Default value
  comments = [],
  postId, // Will use post._id if not provided
  isLoading = false,
  isError = false,
  error = null,
  hasNextPage = false,
  isFetchingNextPage = false,
  onRetry,
  post,
  onDelete,
  onReactionUpdate,
  onTogglePin,
  isDeleting = false,
  initialUserLiked = false,
  initialUserDisliked = false,
  initialUserSaved = false,
}: PostProps) {
  // Only keep states that are specific to Post component functionality
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showCommentsState, setShowCommentsState] =
    useState<boolean>(showComments);
  const [pinPending, setPinPending] = useState<boolean>(false);

  // FIXED: Use post._id if postId is not provided or is invalid
  const validPostId = postId && postId !== "undefined" ? postId : post?._id;

  // Debug log
  // console.log('Post component - postId:', postId, 'post._id:', post?._id, 'validPostId:', validPostId);

  // Event handlers for Post-specific actions
  const handlePin = async (): Promise<void> => {
    if (pinPending || !onTogglePin) return;

    setPinPending(true);
    setShowDropdown(false);

    try {
      await onTogglePin(post._id);
    } catch (error) {
      console.error("Error toggling pin:", error);
    } finally {
      setPinPending(false);
    }
  };

  const handleDelete = (): void => {
    setShowDropdown(false);
    if (onDelete) {
      onDelete(post._id);
    }
  };

  const handleComments = (): void => {
    setShowCommentsState(!showCommentsState);
  };

  const handleUserClick = (): void => {
    // console.log("User clicked:", post.user._id);
    // Example: navigate(`/profile/${post.user._id}`);
  };

  // const handleRetry = (): void => {
  //   if (onRetry) {
  //     onRetry();
  //   } else {
  //     console.log('No retry handler provided');
  //   }
  // };

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

  return (
    <div className={`post-card ${isDeleting ? "deleting" : ""}`}>
      <div className="post-card-body">
        <PostHeader
          post={post}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          onUserClick={handleUserClick}
          onDelete={handleDelete}
          onPin={handlePin}
          pinPending={pinPending}
          deletePending={isDeleting}
        />

        <PostContent post={post} />

        {/* PostActions now handles all reaction logic internally */}
        <PostActions
          post={post}
          onReactionUpdate={onReactionUpdate}
          onComments={handleComments}
          // Pass initial user states if available
          initialUserLiked={initialUserLiked}
          initialUserDisliked={initialUserDisliked}
          initialUserSaved={initialUserSaved}
        />

        {/* FIXED: Pass the correct postId to PostComments */}
        <PostComments showComments={showCommentsState} postId={validPostId} />
      </div>
    </div>
  );
}

export type { PostData, User, Reactions, PostProps };
