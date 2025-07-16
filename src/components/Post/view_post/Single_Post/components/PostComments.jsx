import PropTypes from "prop-types";
import "../style/PostComments.css";
import UserAvatar from "../UI/UserAvatar";
export default function PostComments({ showComments, comments }) {
  if (!showComments) return null;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return date.toLocaleDateString();
  };

  const renderComment = (comment) => (
    <div key={comment.id} className="post-comment">
      <div className="comment-header">
        <div className="comment-user-info">
          <UserAvatar
            user={{
              avatar: comment.UsersProfilePic,
              username: comment.username,
              id: comment.userId,
            }}
            size={20}
          />
          <div className="comment-user-details">
            <strong className="comment-username">{comment.username}</strong>
            <span className="comment-timestamp">
              {formatTimestamp(comment.timestamp)}
            </span>
          </div>
        </div>
        <div className="comment-reactions">
          <button className="comment-reaction-btn">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span>{comment.reactions.likes}</span>
          </button>
          <button className="comment-reaction-btn">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
            </svg>
            <span>{comment.reactions.dislikes}</span>
          </button>
        </div>
      </div>
      <div className="comment-body">
        <p>{comment.body}</p>
      </div>
    </div>
  );

  return (
    <div className="post-comments">
      {comments && comments.length > 0 ? (
        <div className="comments-list">{comments.map(renderComment)}</div>
      ) : (
        <p className="post-no-comments">No comments yet...</p>
      )}
    </div>
  );
}

// PropTypes validation
PostComments.propTypes = {
  showComments: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
};

PostComments.defaultProps = {
  comments: [],
};
