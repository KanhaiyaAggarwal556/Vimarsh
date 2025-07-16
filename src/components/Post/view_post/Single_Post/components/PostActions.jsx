import PropTypes from "prop-types";
import ReactionButtons from "../UI/ReactionButtons";
import ShareAndViewsCounter from "../UI/ShareAndViewsCounter";
import "../style/PostAction.css";

export default function PostActions({
  post,
  currentLikes,
  currentDislikes,
  userLiked,
  userDisliked,
  likeAnimation,
  dislikeAnimation,
  onLike,
  onDislike,
  onComments,
  onShare,
  shareCount,
  userShared,
}) {
  return (
    <div className="post-actions">
      <ReactionButtons
        currentLikes={currentLikes}
        currentDislikes={currentDislikes}
        userLiked={userLiked}
        userDisliked={userDisliked}
        likeAnimation={likeAnimation}
        dislikeAnimation={dislikeAnimation}
        onLike={onLike}
        onDislike={onDislike}
        onComments={onComments}
        onShare={onShare}
        post={post}
      />

      <ShareAndViewsCounter 
        views={post.views}
        onShare={onShare}
        post={post}
        shareCount={shareCount}
        userShared={userShared}
      />
    </div>
  );
}

// PropTypes validation
PostActions.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    views: PropTypes.number.isRequired,
    username: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  currentLikes: PropTypes.number.isRequired,
  currentDislikes: PropTypes.number.isRequired,
  userLiked: PropTypes.bool.isRequired,
  userDisliked: PropTypes.bool.isRequired,
  likeAnimation: PropTypes.bool.isRequired,
  dislikeAnimation: PropTypes.bool.isRequired,
  onLike: PropTypes.func.isRequired,
  onDislike: PropTypes.func.isRequired,
  onComments: PropTypes.func,
  onShare: PropTypes.func,
  shareCount: PropTypes.number,
  userShared: PropTypes.bool,
};