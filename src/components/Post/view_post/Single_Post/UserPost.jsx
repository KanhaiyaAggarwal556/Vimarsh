import { useContext, useState, useEffect } from "react";
import { PostList as PostListData } from "@store/post-list-store";
import PostHeader from "./components/PostHeader";
import PostContent from "./components/PostContent";
import PostActions from "./components/PostActions";
import PostComments from "./components/PostComments";
import "./style/UserPost.css";

export default function UserPost() {
  const { postList } = useContext(PostListData);

  // Get post ID from URL
  const pathSegments = window.location.pathname
    .split("/")
    .filter((segment) => segment !== "");
  const manualId = pathSegments[2];

  // Find post by ID
  const getPostById = (postId) => {
    return postList.find((post) => post.id == postId);
  };

  // All state declarations first
  const [isLoading, setIsLoading] = useState(true);
  const [postNotFound, setPostNotFound] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reaction states
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [dislikeAnimation, setDislikeAnimation] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [currentDislikes, setCurrentDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  // Comment states
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState([]);

  // Get current post
  const post = getPostById(manualId);

  // Handle post loading and initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!postList || postList.length === 0) {
        setIsLoading(true);
        return;
      }

      if (post) {
        // Initialize with post data
        setCurrentLikes(post.reactions?.likes || 0);
        setCurrentDislikes(post.reactions?.dislikes || 0);
        setComments(post.comments || []);
        setIsLoading(false);
        setPostNotFound(false);
      } else {
        // Post not found
        setIsLoading(false);
        setPostNotFound(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [post, postList]);

  // Event handlers
  const handleLike = () => {
    if (userDisliked) {
      setCurrentDislikes((prev) => prev - 1);
      setUserDisliked(false);
    }

    if (userLiked) {
      setCurrentLikes((prev) => prev - 1);
      setUserLiked(false);
    } else {
      setCurrentLikes((prev) => prev + 1);
      setUserLiked(true);
    }

    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 600);
  };

  const handleDislike = () => {
    if (userLiked) {
      setCurrentLikes((prev) => prev - 1);
      setUserLiked(false);
    }

    if (userDisliked) {
      setCurrentDislikes((prev) => prev - 1);
      setUserDisliked(false);
    } else {
      setCurrentDislikes((prev) => prev + 1);
      setUserDisliked(true);
    }

    setDislikeAnimation(true);
    setTimeout(() => setDislikeAnimation(false), 600);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setShowDropdown(false);

    setTimeout(() => {
      setIsDeleted(true);
    }, 300);
  };

  const handleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    setIsSubmittingComment(true);

    const newCommentObj = {
      id: Date.now(),
      text: newComment.trim(),
      author: "Current User",
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    setComments((prev) => [...prev, newCommentObj]);
    setNewComment("");

    setTimeout(() => {
      setIsSubmittingComment(false);
    }, 500);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Handle cross button click - navigate to home
  const handleGoHome = () => {
    // You can replace this with your routing logic
    // For React Router: navigate('/') or history.push('/')
    // For Next.js: router.push('/')
    // For basic navigation:
    window.location.href = '/';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="post">
        <button className="cross-button" onClick={handleGoHome} aria-label="Go to Home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="post-page">
          <div className="post-card">
            <div className="post-card-body">
              <div className="loading-spinner">Loading post...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Post not found state
  if (postNotFound) {
    return (
      <div className="post">
        <button className="cross-button" onClick={handleGoHome} aria-label="Go to Home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="post-page">
          <div className="post-card">
            <div className="post-card-body">
              <div className="error-message">
                <h3>Post not found</h3>
                <p>
                  The post you're looking for doesn't exist or has been deleted.
                </p>
                <button onClick={() => window.history.back()}>Go Back</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Deleted state
  if (isDeleted) {
    return (
      <div className="post">
        <button className="cross-button" onClick={handleGoHome} aria-label="Go to Home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="post-page">
          <div className="post-card">
            <div className="post-card-body">
              <div className="error-message">
                <h3>Post Deleted</h3>
                <p>This post has been successfully deleted.</p>
                <button onClick={handleGoHome}>Go to Home</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="post">
      <button className="cross-button" onClick={handleGoHome} aria-label="Go to Home">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <div className="post-page">
        <div className={`post-card ${isDeleting ? "deleting" : ""}`}>
          <div className="post-card-body">
            <PostHeader
              post={post}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              onDelete={handleDelete}
            />

            <PostContent post={post} />

            <PostActions
              post={post}
              currentLikes={currentLikes}
              currentDislikes={currentDislikes}
              userLiked={userLiked}
              userDisliked={userDisliked}
              likeAnimation={likeAnimation}
              dislikeAnimation={dislikeAnimation}
              onLike={handleLike}
              onDislike={handleDislike}
              onComments={handleComments}
            />

            <div className="comment-input-section">
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <div className="comment-input-container">
                  <input
                    type="text"
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Write a comment..."
                    className="comment-input"
                    disabled={isSubmittingComment}
                  />
                  <button
                    type="submit"
                    className={`comment-submit-btn ${
                      isSubmittingComment ? "submitting" : ""
                    }`}
                    disabled={isSubmittingComment || newComment.trim() === ""}
                  >
                    {isSubmittingComment ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            </div>

            <PostComments showComments={showComments} comments={comments} />
          </div>
        </div>
      </div>
    </div>
  );
}