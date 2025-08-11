import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../style/PostComments.css";
import UserAvatar from "../UI/UserAvatar";
import useAuthStore from "@store/useAuthStore";

interface CommentReactions {
  likes: number;
  dislikes: number;
}

interface Comment {
  _id: string;
  id?: number;
  body: string;
  post: string;
  user: {
    _id: string;
    username?: string;
    userName?: string;
    fullName?: string;
    profilepic?: string;
    email?: string;
  };
  reactions: CommentReactions;
  timestamp?: string;
  createdAt: string;
  updatedAt: string;
  userReaction?: "like" | "dislike" | null;
}

interface CommentsResponse {
  success: boolean;
  data: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    hasNextPage: boolean;
    hasPrevious: boolean;
  };
}

interface PostCommentsProps {
  showComments: boolean;
  postId: string;
}

// API function to fetch comments with pagination
const fetchComments = async ({
  postId,
  pageParam = 1,
  userId,
}: {
  postId: string;
  pageParam?: number;
  userId?: string;
}): Promise<CommentsResponse> => {
  // Validate postId first
  if (!postId || postId === "undefined") {
    throw new Error("Invalid postId provided");
  }

  // Add userId to query params if available
  const queryParams = new URLSearchParams({
    page: pageParam.toString(),
    limit: "15",
    sortOrder: "desc",
  });

  if (userId) {
    queryParams.append("userId", userId);
  }

  const url = `${import.meta.env.VITE_API_BASE_URL}/comments/post/${postId}?${queryParams}`;
  // console.log('Fetching comments from:', url); // Debug log

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", response.status, errorText);
    throw new Error(
      `Failed to fetch comments: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  // console.log('Received comments data:', data); // Debug log
  return data;
};

// API function to post a new comment
const postComment = async ({
  postId,
  body,
  userId,
}: {
  postId: string;
  body: string;
  userId: string;
}) => {
  if (!postId || postId === "undefined") {
    throw new Error("Invalid postId provided");
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      postId: postId,
      body: body,
      userId: userId,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

// API function to react to a comment
const reactToComment = async ({
  commentId,
  reactionType,
  userId,
}: {
  commentId: string;
  reactionType: "like" | "dislike";
  userId: string;
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}/reactions`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: reactionType,
        userId: userId,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Reaction API Error:", response.status, errorText);
    throw new Error("Failed to react to comment");
  }

  return response.json();
};

const PostComments: React.FC<PostCommentsProps> = ({
  showComments,
  postId,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [userReactions, setUserReactions] = useState<
    Record<string, "like" | "dislike" | null>
  >({});
  const [processingReactions, setProcessingReactions] = useState<Set<string>>(
    new Set()
  );

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get current user from auth store
  const { currentUser } = useAuthStore();
  const isAuthenticated = !!currentUser;
  const currentUserId = currentUser?._id;

  // Debug log to check postId
  useEffect(() => {
    // console.log('PostComments received postId:', postId);
    if (!postId || postId === "undefined") {
      console.error("PostComments: Invalid postId received");
    }
  }, [postId]);

  // Infinite query for comments
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["comments", postId, currentUserId],
    queryFn: ({ pageParam }) =>
      fetchComments({
        postId,
        pageParam,
        userId: currentUserId,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    enabled: showComments && !!postId && postId !== "undefined", // Only fetch when valid postId
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      // Don't retry if it's a validation error
      if (error.message.includes("Invalid postId")) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  // Initialize user reactions from fetched data
  useEffect(() => {
    if (data?.pages) {
      const reactions: Record<string, "like" | "dislike" | null> = {};
      data.pages.forEach((page) => {
        page.data.forEach((comment) => {
          if (comment.userReaction) {
            reactions[comment._id] = comment.userReaction;
          }
        });
      });
      setUserReactions((prev) => ({ ...prev, ...reactions }));
    }
  }, [data]);

  // Ref callback for infinite scrolling
  const lastCommentElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            setTimeout(() => {
              fetchNextPage();
            }, 300);
          }
        },
        {
          threshold: 0.3,
          rootMargin: "200px",
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Get all comments from all pages
  const allComments = data?.pages.flatMap((page) => page.data) || [];
  const totalComments = data?.pages[0]?.pagination.totalComments || 0;

  // Function to handle user profile navigation
  const handleUserClick = (user: Comment["user"]) => {
    const username = user.userName || user.username;
    if (username) {
      navigate(`/${username}`);
    }
  };

  // Mutation for posting new comment
  const postCommentMutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error: any) => {
      console.error("Failed to post comment:", error);
      const errorMessage =
        error.message || "Failed to post comment. Please try again.";
      alert(errorMessage);
    },
  });

  // FIXED: Improved reaction mutation with better state management
  const reactMutation = useMutation({
    mutationFn: reactToComment,
    onMutate: async ({ commentId, reactionType }) => {
      // Prevent multiple simultaneous reactions on same comment
      if (processingReactions.has(commentId)) {
        throw new Error("Please wait for previous reaction to complete");
      }

      // Add to processing set
      setProcessingReactions((prev) => new Set(prev).add(commentId));

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      // Get current reaction
      const currentReaction = userReactions[commentId] || null;

      // FIXED: Proper toggle logic - clicking same reaction removes it
      const newReaction =
        currentReaction === reactionType ? null : reactionType;

      // Store previous state for rollback
      const previousReaction = currentReaction;
      const previousData = queryClient.getQueryData([
        "comments",
        postId,
        currentUserId,
      ]);

      // Update UI immediately for instant feedback
      setUserReactions((prev) => ({
        ...prev,
        [commentId]: newReaction,
      }));

      // Optimistically update the query data for counts
      queryClient.setQueryData(
        ["comments", postId, currentUserId],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((comment: Comment) => {
                if (comment._id === commentId) {
                  const newReactions = { ...comment.reactions };

                  // Remove previous reaction count
                  if (currentReaction === "like") {
                    newReactions.likes = Math.max(0, newReactions.likes - 1);
                  } else if (currentReaction === "dislike") {
                    newReactions.dislikes = Math.max(
                      0,
                      newReactions.dislikes - 1
                    );
                  }

                  // Add new reaction count
                  if (newReaction === "like") {
                    newReactions.likes += 1;
                  } else if (newReaction === "dislike") {
                    newReactions.dislikes += 1;
                  }

                  return {
                    ...comment,
                    reactions: newReactions,
                    userReaction: newReaction,
                  };
                }
                return comment;
              }),
            })),
          };
        }
      );

      return { commentId, previousReaction, previousData };
    },
    onSuccess: (data, variables) => {
      // Update user reaction state with server response
      if (data.success && data.data) {
        setUserReactions((prev) => ({
          ...prev,
          [variables.commentId]: data.data.userReaction,
        }));
      }
    },
    onError: (err, variables, context) => {
      console.error("Failed to react to comment:", err);

      // Rollback optimistic updates
      if (context?.previousData) {
        queryClient.setQueryData(
          ["comments", postId, currentUserId],
          context.previousData
        );
      }
      if (context?.previousReaction !== undefined) {
        setUserReactions((prev) => ({
          ...prev,
          [variables.commentId]: context.previousReaction,
        }));
      }

      alert("Failed to update reaction. Please try again.");
    },
    onSettled: (variables) => {
      // Remove from processing set
      setProcessingReactions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(variables.commentId);
        return newSet;
      });
    },
  });

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated || !currentUserId) {
      alert("Please log in to post a comment");
      return;
    }

    if (!postId || postId === "undefined") {
      alert("Invalid post ID");
      return;
    }

    setIsPosting(true);
    try {
      await postCommentMutation.mutateAsync({
        postId,
        body: newComment.trim(),
        userId: currentUserId,
      });
    } catch (error) {
      console.error("Error in handlePostComment:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleReaction = async (
    commentId: string,
    reactionType: "like" | "dislike"
  ) => {
    if (!isAuthenticated || !currentUserId) {
      alert("Please log in to react to comments");
      return;
    }

    // Prevent multiple clicks on same comment
    if (processingReactions.has(commentId)) {
      return;
    }

    try {
      await reactMutation.mutateAsync({
        commentId,
        reactionType,
        userId: currentUserId,
      });
    } catch (error) {
      console.error("Reaction failed:", error);
    }
  };

  // Function to format numbers with K/M suffixes
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return count.toString();
  };

  const formatTimeAgo = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "unknown";

      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return "just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
      if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 86400)}d`;

      return date.toLocaleDateString();
    } catch {
      return "unknown";
    }
  };

  const renderComment = (comment: Comment, index: number) => {
    const reactions = comment.reactions || { likes: 0, dislikes: 0 };
    const currentUserReaction = userReactions[comment._id] || null;
    const isLastComment = index === allComments.length - 1;
    const isProcessing = processingReactions.has(comment._id);

    return (
      <div
        key={comment._id}
        className="comment-card"
        ref={isLastComment ? lastCommentElementRef : null}
      >
        <div className="comment-header">
          <div
            className="comment-avatar clickable"
            onClick={() => handleUserClick(comment.user)}
            style={{ cursor: "pointer" }}
          >
            <UserAvatar
              user={{
                avatar: comment.user.profilepic,
                name: comment.user.fullName,
                id: comment.user._id,
              }}
              size={35}
            />
          </div>

          <div className="comment-content">
            <div className="comment-meta">
              <span
                className="comment-username clickable"
                onClick={() => handleUserClick(comment.user)}
                style={{ cursor: "pointer" }}
              >
                {comment.user?.userName ||
                  comment.user?.username ||
                  "Anonymous"}
              </span>
              <span className="comment-timestamp">
                {formatTimeAgo(comment.timestamp || comment.createdAt || "")}
              </span>
            </div>
            <div className="comment-body">{comment.body}</div>
            <div className="comment-actions">
              <button
                className={`reaction-btn like-btn ${
                  currentUserReaction === "like" ? "active" : ""
                } ${isProcessing ? "processing" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleReaction(comment._id, "like");
                }}
                disabled={isProcessing || !isAuthenticated}
                title={
                  currentUserReaction === "like"
                    ? "Remove like"
                    : "Like comment"
                }
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span>{formatCount(reactions.likes)}</span>
              </button>
              <button
                className={`reaction-btn dislike-btn ${
                  currentUserReaction === "dislike" ? "active" : ""
                } ${isProcessing ? "processing" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleReaction(comment._id, "dislike");
                }}
                disabled={isProcessing || !isAuthenticated}
                title={
                  currentUserReaction === "dislike"
                    ? "Remove dislike"
                    : "Dislike comment"
                }
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a3 3 0 0 0-2.95 2.43L1.39 15.2A3 3 0 0 0 4.33 19H10zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                </svg>
                <span>{formatCount(reactions.dislikes)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Early return if invalid postId
  if (!postId || postId === "undefined") {
    return (
      <div className="comments-container">
        <div className="error-state">
          <span>Error: Invalid post ID</span>
        </div>
      </div>
    );
  }

  if (!showComments) {
    return null;
  }

  return (
    <div className="comments-container">
      <div className="comments-header">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Comments ({totalComments})</span>
      </div>

      {/* Comment Input Section */}
      {isAuthenticated ? (
        <div className="comment-input-section">
          <form onSubmit={handlePostComment} className="comment-form">
            <div className="comment-input-wrapper">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
                rows={3}
                disabled={isPosting}
              />
              <button
                type="submit"
                className="post-comment-btn"
                disabled={!newComment.trim() || isPosting}
              >
                {isPosting ? (
                  <div className="spinner-small"></div>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22,2 15,22 11,13 2,9 22,2" />
                    </svg>
                    Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="login-prompt">
          <p>Please log in to post a comment</p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Loading comments...</span>
        </div>
      ) : isError ? (
        <div className="error-state">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>Failed to load comments: {error?.message}</span>
          <button onClick={() => refetch()} className="retry-btn">
            Try Again
          </button>
        </div>
      ) : allComments.length === 0 ? (
        <div className="no-comments">
          <div className="no-comments-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p>No comments yet</p>
          <span>Be the first to comment on this post</span>
        </div>
      ) : (
        <>
          <div className="comments-list">
            {allComments.map((comment, index) => renderComment(comment, index))}
          </div>

          {isFetchingNextPage && (
            <div className="loading-more">
              <div className="spinner"></div>
              <span>Loading more comments...</span>
            </div>
          )}

          {!hasNextPage && allComments.length > 0 && (
            <div className="comments-end">
              <p>You've reached the end of comments</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostComments;
