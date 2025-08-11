import { useState, useEffect } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import PostHeader from "./components/PostHeader";
import PostContent from "./components/PostContent";
import PostActions from "./components/PostActions";
import PostComments from "./components/PostComments";
import "./style/UserPost.css";

// Type definitions based on your actual MongoDB schema
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
  images: string[];
  videos: string[];
  tags: string[];
  location: string;
  views: number;
  isPinned: boolean;
  reactions: Reactions;
  user: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
    username: string;
    email?: string;
  };
  reactions: CommentReactions;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentsResponse {
  success: boolean;
  data: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// API function to fetch post by ID
const fetchPostById = async (postId: string): Promise<PostData> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Post not found");
    }
    throw new Error("Failed to fetch post");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch post");
  }

  return data.data;
};

// API function to fetch comments by post ID with pagination
const fetchCommentsByPost = async ({
  postId,
  pageParam = 1,
}: {
  postId: string;
  pageParam?: number;
}): Promise<CommentsResponse> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/comments/post/${postId}?page=${pageParam}&limit=10&sortOrder=desc`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch comments");
  }

  return data;
};

export default function UserPost(): JSX.Element {
  // Get post ID from URL (/p/:postId)
  const pathSegments: string[] = window.location.pathname
    .split("/")
    .filter((segment: string) => segment !== "");
  const postId: string = pathSegments[1];

  // TanStack Query to fetch post data
  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
    refetch: refetchPost,
  } = useQuery<PostData, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
    retry: (failureCount, error) => {
      if (error?.message === "Post not found") {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // Changed from cacheTime to gcTime
  });

  // Infinite query for comments
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
    refetch: refetchComments,
  } = useInfiniteQuery<CommentsResponse, Error>({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) =>
      fetchCommentsByPost({ postId, pageParam: pageParam as number }),
    getNextPageParam: (lastPage: CommentsResponse) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    enabled: !!postId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000, // Changed from cacheTime to gcTime
    initialPageParam: 1, // Add this required property for newer versions
  });

  // Basic UI states
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(true);

  // State for managing post actions
  const [currentLikes, setCurrentLikes] = useState<number>(0);
  const [currentDislikes, setCurrentDislikes] = useState<number>(0);
  const [currentShares, setCurrentShares] = useState<number>(0);
  const [currentSaves, setCurrentSaves] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [userDisliked, setUserDisliked] = useState<boolean>(false);
  const [userSaved, setUserSaved] = useState<boolean>(false);

  // Animation states
  const [likeAnimation, setLikeAnimation] = useState<boolean>(false);
  const [dislikeAnimation, setDislikeAnimation] = useState<boolean>(false);
  const [shareAnimation, setShareAnimation] = useState<boolean>(false);
  const [saveAnimation, setSaveAnimation] = useState<boolean>(false);

  // Action pending states
  const [likePending, setLikePending] = useState<boolean>(false);
  const [dislikePending, setDislikePending] = useState<boolean>(false);
  const [sharePending, setSharePending] = useState<boolean>(false);
  const [savePending, setSavePending] = useState<boolean>(false);

  // Flatten comments from all pages
  const allComments = commentsData?.pages.flatMap((page) => page.data) || [];

  // Initialize action states when post data is loaded
  useEffect(() => {
    if (post) {
      setCurrentLikes(post.reactions.likes);
      setCurrentDislikes(post.reactions.dislikes);
      setCurrentShares(post.reactions.shares);
      setCurrentSaves(post.reactions.saves);
    }
  }, [post]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Handle cross button click - navigate back properly
  const handleGoHome = (): void => {
    // Check if there's history to go back to
    if (window.history.length > 1 && document.referrer) {
      window.history.back();
    } else {
      // Fallback to home page if no history
      window.location.href = "/";
    }
  };

  // Handle retry for failed requests
  const handleRetry = (): void => {
    refetchPost();
    refetchComments();
  };

  // Action handlers
  const handleLike = async (): Promise<void> => {
    if (likePending || !post) return;

    setLikePending(true);
    setLikeAnimation(true);

    try {
      // Optimistic update
      if (userLiked) {
        setCurrentLikes((prev) => prev - 1);
        setUserLiked(false);
      } else {
        setCurrentLikes((prev) => prev + 1);
        setUserLiked(true);
        // Remove dislike if it was active
        if (userDisliked) {
          setCurrentDislikes((prev) => prev - 1);
          setUserDisliked(false);
        }
      }

      // TODO: Add actual API call here
      // await likePost(post._id);
    } catch (error) {
      // Revert optimistic update on error
      if (userLiked) {
        setCurrentLikes((prev) => prev + 1);
        setUserLiked(true);
      } else {
        setCurrentLikes((prev) => prev - 1);
        setUserLiked(false);
      }
      console.error("Error liking post:", error);
    } finally {
      setLikePending(false);
      setTimeout(() => setLikeAnimation(false), 300);
    }
  };

  const handleDislike = async (): Promise<void> => {
    if (dislikePending || !post) return;

    setDislikePending(true);
    setDislikeAnimation(true);

    try {
      // Optimistic update
      if (userDisliked) {
        setCurrentDislikes((prev) => prev - 1);
        setUserDisliked(false);
      } else {
        setCurrentDislikes((prev) => prev + 1);
        setUserDisliked(true);
        // Remove like if it was active
        if (userLiked) {
          setCurrentLikes((prev) => prev - 1);
          setUserLiked(false);
        }
      }

      // TODO: Add actual API call here
      // await dislikePost(post._id);
    } catch (error) {
      // Revert optimistic update on error
      if (userDisliked) {
        setCurrentDislikes((prev) => prev + 1);
        setUserDisliked(true);
      } else {
        setCurrentDislikes((prev) => prev - 1);
        setUserDisliked(false);
      }
      console.error("Error disliking post:", error);
    } finally {
      setDislikePending(false);
      setTimeout(() => setDislikeAnimation(false), 300);
    }
  };

  const handleShare = async (): Promise<void> => {
    if (sharePending || !post) return;

    setSharePending(true);
    setShareAnimation(true);

    try {
      // Optimistic update
      setCurrentShares((prev) => prev + 1);

      // TODO: Add actual API call here
      // await sharePost(post._id);

      // You might want to show a share dialog or copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
    } catch (error) {
      // Revert optimistic update on error
      setCurrentShares((prev) => prev - 1);
      console.error("Error sharing post:", error);
    } finally {
      setSharePending(false);
      setTimeout(() => setShareAnimation(false), 300);
    }
  };

  const handleSave = async (): Promise<void> => {
    if (savePending || !post) return;

    setSavePending(true);
    setSaveAnimation(true);

    try {
      // Optimistic update
      if (userSaved) {
        setCurrentSaves((prev) => prev - 1);
        setUserSaved(false);
      } else {
        setCurrentSaves((prev) => prev + 1);
        setUserSaved(true);
      }

      // TODO: Add actual API call here
      // await savePost(post._id);
    } catch (error) {
      // Revert optimistic update on error
      if (userSaved) {
        setCurrentSaves((prev) => prev + 1);
        setUserSaved(true);
      } else {
        setCurrentSaves((prev) => prev - 1);
        setUserSaved(false);
      }
      console.error("Error saving post:", error);
    } finally {
      setSavePending(false);
      setTimeout(() => setSaveAnimation(false), 300);
    }
  };

  // Loading state
  if (isPostLoading) {
    return (
      <div className="post">
        <button
          className="cross-button"
          onClick={handleGoHome}
          aria-label="Go to Home"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="post-page">
          <div className="post-card">
            <div className="post-card-body">
              <div className="loading-spinner"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isPostError) {
    const isNotFound = postError?.message === "Post not found";

    return (
      <div className="post">
        <button
          className="cross-button"
          onClick={handleGoHome}
          aria-label="Go to Home"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="post-page">
          <div className="post-card">
            <div className="post-card-body">
              <div className="error-message">
                <h3>{isNotFound ? "Post not found" : "Error loading post"}</h3>
                <p>
                  {isNotFound
                    ? "The post you're looking for doesn't exist or has been deleted."
                    : "Something went wrong while loading the post. Please try again."}
                </p>
                <div className="error-actions">
                  {!isNotFound && (
                    <button onClick={handleRetry} className="retry-button">
                      Try Again
                    </button>
                  )}
                  <button onClick={handleGoHome}>Go to Home</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main render - return empty div instead of null to satisfy JSX.Element return type
  if (!post) {
    return <div></div>;
  }

  return (
    <div className="post">
      <button
        className="cross-button"
        onClick={handleGoHome}
        aria-label="Go to Home"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="post-page">
        <div className="post-card">
          <div className="post-card-body">
            <PostHeader
              post={post}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              onUserClick={() => {}} // Add missing prop - you can implement user click handler
              onDelete={() => {}} // Add missing prop - you can implement delete handler
              onPin={() => {}} // Add missing prop - you can implement pin handler
              pinPending={false} // Add missing prop - you can manage pin state
              deletePending={false} // Add missing prop - you can manage delete state
            />

            <PostContent post={post} />

            <PostActions
              post={post}
              currentLikes={currentLikes}
              currentDislikes={currentDislikes}
              currentShares={currentShares}
              currentSaves={currentSaves}
              userLiked={userLiked}
              userDisliked={userDisliked}
              userSaved={userSaved}
              likeAnimation={likeAnimation}
              dislikeAnimation={dislikeAnimation}
              shareAnimation={shareAnimation}
              saveAnimation={saveAnimation}
              likePending={likePending}
              dislikePending={dislikePending}
              sharePending={sharePending}
              savePending={savePending}
              onLike={handleLike}
              onDislike={handleDislike}
              onShare={handleShare}
              onSave={handleSave}
              onComments={() => setShowComments(!showComments)}
            />

            {/* Comments Section */}
            <PostComments
              showComments={showComments}
              comments={allComments}
              postId={postId}
              isLoading={isCommentsLoading}
              isError={isCommentsError}
              error={commentsError}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onRetry={() => refetchComments()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
