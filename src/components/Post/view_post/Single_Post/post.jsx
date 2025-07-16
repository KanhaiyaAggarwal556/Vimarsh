import { useState } from "react";
import PropTypes from "prop-types";
import PostHeader from "./components/PostHeader";
import PostContent from "./components/PostContent";
import PostActions from "./components/PostActions";
import PostComments from "./components/PostComments";
import "./style/post.css";
import UserPost from "./UserPost";

export default function Post({ post, onDelete }) {
  // State management
  const [showDropdown, setShowDropdown] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reaction states
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [dislikeAnimation, setDislikeAnimation] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(post.reactions.likes);
  const [currentDislikes, setCurrentDislikes] = useState(
    post.reactions.dislikes
  );
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

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
      if (onDelete) {
        onDelete(post.id);
      }
    }, 300);
  };

  const handleComments = () => {
    setShowComments(!showComments);
  };

  const handleUserClick = () => {
    setShowUserModal(true);
  };

  // Don't render if deleted
  if (isDeleted) {
    return null;
  }

  return (
    <>
      <div className={`post-card ${isDeleting ? "deleting" : ""}`}>
        <div className="post-card-body">
          <PostHeader
            post={post}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            onUserClick={handleUserClick}
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

          <PostComments showComments={showComments} comments={post.comments} />
        </div>
      </div>
    </>
  );
}

// PropTypes validation
Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    username: PropTypes.string.isRequired,
    UsersProfilePic: PropTypes.string,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    reactions: PropTypes.shape({
      likes: PropTypes.number.isRequired,
      dislikes: PropTypes.number.isRequired,
    }).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    views: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    videos: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        username: PropTypes.string.isRequired,
        UsersProfilePic: PropTypes.string,
        body: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
        reactions: PropTypes.shape({
          likes: PropTypes.number.isRequired,
          dislikes: PropTypes.number.isRequired,
        }).isRequired,
      })
    ),
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
};

// Default props
Post.defaultProps = {
  onDelete: null,
};
