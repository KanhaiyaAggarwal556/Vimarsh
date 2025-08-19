// PostComments.tsx - Updated with separated types
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

// Import separated types
import {
  Comment,
  CommentsResponse,
  PostCommentsProps,
  FetchCommentsParams,
  PostCommentParams,
  LikeCommentParams,
  CommentFormState,
  CommentInteractionState,
} from "@/types/commentsTypes";
import { ApiResponse } from "@/types/apiTypes";

// API function to fetch comments with pagination
const fetchComments = async ({
  postId,
  pageParam = 1,
  userId,
}: FetchCommentsParams): Promise<CommentsResponse> => {
  // Validate postId first
  if (!postId || postId === "undefined") {
    throw new Error("Invalid postId provided");
  }

  // Add userId to query params if available
  const queryParams = new URLSearchParams({
    page: pageParam.toString(),
    limit: "15",
    orderType: "smart", // Use smart ordering by default
  });

  if (userId) {
    queryParams.append("userId", userId);
  }

  const url = `${import.meta.env.VITE_API_BASE_URL}/comments/post/${postId}?${queryParams}`;

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
  return data;
};

// API function to post a new comment
const postComment = async ({
  postId,
  body,
  userId,
}: PostCommentParams): Promise<ApiResponse<Comment>> => {
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

// API function to handle comment likes
const likeComment = async ({
  commentId,
  userId,
}: LikeCommentParams): Promise<ApiResponse<{ userHasLiked: boolean; likes: number }>> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}/like`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId: userId,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Like API Error:", response.status, errorText);
    throw new Error("Failed to like/unlike comment");
  }

  return response.json();
};

const PostComments: React.FC<PostCommentsProps> = ({
  showComments,
  postId,
}) => {
  // Form state
  const [formState, setFormState] = useState<CommentFormState>({
    newComment: "",
    isPosting: false,
  });

  // Interaction state
  const [interactionState, setInteractionState] = useState<CommentInteractionState>({
    userLikes: {},
    processingLikes: new Set(),
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get current user from auth store
  const { currentUser } = useAuthStore();
  const isAuthenticated = !!currentUser;
  const currentUserId = currentUser?._id;

  // Debug log to check postId
  useEffect(() => {
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
    enabled: showComments && !!postId && postId !== "undefined",
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (error.message.includes("Invalid postId")) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  // Initialize user likes from fetched data
  useEffect(() => {
    if (data?.pages) {
      const likes: Record<string, boolean> = {};
      data.pages.forEach((page) => {
        page.data.forEach((comment) => {
          if (comment.userHasLiked !== undefined) {
            likes[comment._id] = comment.userHasLiked;
          }
        });
      });
      setInteractionState(prev => ({ 
        ...prev, 
        userLikes: { ...prev.userLikes, ...likes }
      }));
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
      setFormState(prev => ({ ...prev, newComment: "" }));
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error: any) => {
      console.error("Failed to post comment:", error);
      const errorMessage =
        error.message || "Failed to post comment. Please try again.";
      alert(errorMessage);
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: likeComment,
    onMutate: async ({ commentId }) => {
      // Prevent multiple simultaneous likes on same comment
      if (interactionState.processingLikes.has(commentId)) {
        throw new Error("Please wait for previous action to complete");
      }

      // Add to processing set
      setInteractionState(prev => ({
        ...prev,
        processingLikes: new Set(prev.processingLikes).add(commentId)
      }));

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      // Get current like status
      const currentLike = interactionState.userLikes[commentId] || false;
      const newLike = !currentLike; // Toggle like

      // Store previous state for rollback
      const previousLike = currentLike;
      const previousData = queryClient.getQueryData([
        "comments",
        postId,
        currentUserId,
      ]);

      // Update UI immediately for instant feedback
      setInteractionState(prev => ({
        ...prev,
        userLikes: {
          ...prev.userLikes,
          [commentId]: newLike,
        }
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

                  // Update like count based on toggle
                  if (newLike) {
                    newReactions.likes += 1;
                  } else {
                    newReactions.likes = Math.max(0, newReactions.likes - 1);
                  }

                  return {
                    ...comment,
                    reactions: newReactions,
                    userHasLiked: newLike,
                  };
                }
                return comment;
              }),
            })),
          };
        }
      );

      return { commentId, previousLike, previousData };
    },
    onSuccess: (responseData, variables) => {
      // Update user like state with server response
      if (responseData.success && responseData.data) {
        setInteractionState(prev => ({
          ...prev,
          userLikes: {
            ...prev.userLikes,
            [variables.commentId]: responseData.data.userHasLiked,
          }
        }));
      }
    },
    onError: (errorResponse, variables, context) => {
      console.error("Failed to like comment:", errorResponse);

      // Rollback optimistic updates
      if (context?.previousData) {
        queryClient.setQueryData(
          ["comments", postId, currentUserId],
          context.previousData
        );
      }
      if (context?.previousLike !== undefined) {
        setInteractionState(prev => ({
          ...prev,
          userLikes: {
            ...prev.userLikes,
            [variables.commentId]: context.previousLike,
          }
        }));
      }

      alert("Failed to update like. Please try again.");
    },
    onSettled: (_, __, variables) => {
      // Remove from processing set
      setInteractionState(prev => {
        const newSet = new Set(prev.processingLikes);
        newSet.delete(variables.commentId);
        return {
          ...prev,
          processingLikes: newSet
        };
      });
    },
  });

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.newComment.trim()) return;

    if (!isAuthenticated || !currentUserId) {
      alert("Please log in to post a comment");
      return;
    }

    if (!postId || postId === "undefined") {
      alert("Invalid post ID");
      return;
    }

    setFormState(prev => ({ ...prev, isPosting: true }));
    try {
      await postCommentMutation.mutateAsync({
        postId,
        body: formState.newComment.trim(),
        userId: currentUserId,
      });
    } catch (error) {
      console.error("Error in handlePostComment:", error);
    } finally {
      setFormState(prev => ({ ...prev, isPosting: false }));
    }
  };

  const handleLike = async (commentId: string) => {
    if (!isAuthenticated || !currentUserId) {
      alert("Please log in to like comments");
      return;
    }

    // Prevent multiple clicks on same comment
    if (interactionState.processingLikes.has(commentId)) {
      return;
    }

    try {
      await likeMutation.mutateAsync({
        commentId,
        userId: currentUserId,
      });
    } catch (error) {
      console.error("Like failed:", error);
    }
  };

  // Utility functions
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
    const reactions = comment.reactions || { likes: 0 };
    const currentUserLike = interactionState.userLikes[comment._id] || false;
    const isLastComment = index === allComments.length - 1;
    const isProcessing = interactionState.processingLikes.has(comment._id);

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
                  currentUserLike ? "active" : ""
                } ${isProcessing ? "processing" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLike(comment._id);
                }}
                disabled={isProcessing || !isAuthenticated}
                title={currentUserLike ? "Unlike comment" : "Like comment"}
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
                value={formState.newComment}
                onChange={(e) => setFormState(prev => ({ 
                  ...prev, 
                  newComment: e.target.value 
                }))}
                placeholder="Write a comment..."
                className="comment-input"
                rows={3}
                disabled={formState.isPosting}
              />
              <button
                type="submit"
                className="post-comment-btn"
                disabled={!formState.newComment.trim() || formState.isPosting}
              >
                {formState.isPosting ? (
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