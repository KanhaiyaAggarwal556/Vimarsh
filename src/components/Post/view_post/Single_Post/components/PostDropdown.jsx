import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReportModal from './ReportModal';
import BlockModal from './BlockModal';
import "../style/PostDropdown.css";

export default function PostDropdown ({ 
  show, 
  setShow, 
  post,
  currentUserId,
  onDelete,
  onPostRemoved
}) {
  const dropdownRef = useRef(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const isOwnPost = currentUserId === post.userId;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, setShow]);

  // Reset modal states when dropdown closes
  useEffect(() => {
    if (!show) {
      setShowReportModal(false);
      setShowBlockModal(false);
    }
  }, [show]);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      onDelete(post.id);
      setShow(false);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleBlock = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close dropdown first, then open modal
    setShow(false);
    
    // Use setTimeout to ensure dropdown is closed before opening modal
    setTimeout(() => {
      setShowBlockModal(true);
    }, 100);
  };

  const handleReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close dropdown first, then open modal
    setShow(false);
    
    // Use setTimeout to ensure dropdown is closed before opening modal
    setTimeout(() => {
      setShowReportModal(true);
    }, 100);
  };

  const handleReportConfirm = async (reportData) => {
    try {
      console.log('Report submitted:', reportData);
      
      // Remove post from user's feed after reporting
      if (onPostRemoved) {
        onPostRemoved(post.id, 'reported');
      }
      
      setShowReportModal(false);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const handleBlockConfirm = async () => {
    try {
      console.log('User blocked:', post.userId);
      
      // Remove all posts from this user from the feed
      if (onPostRemoved) {
        onPostRemoved(post.id, 'blocked', post.userId);
      }
      
      setShowBlockModal(false);
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleReportClose = () => {
    setShowReportModal(false);
  };

  const handleBlockClose = () => {
    setShowBlockModal(false);
  };

  if (!show) return null;

  return (
    <>
      <div className="post-dropdown-container" ref={dropdownRef}>
        <div className="post-dropdown-menu">
          {/* Own Post Actions */}
          {isOwnPost && (
            <button 
              className="post-dropdown-item danger"
              onClick={handleDelete}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" 
                      stroke="currentColor" strokeWidth="2"/>
                <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Delete post
            </button>
          )}

          {/* Other User's Post Actions */}
          {!isOwnPost && (
            <>
              <button 
                className="post-dropdown-item"
                onClick={handleBlock}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4.93 4.93l14.14 14.14" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Block @{post.userId}
              </button>

              <button 
                className="post-dropdown-item danger"
                onClick={handleReport}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Report post
              </button>
            </>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        show={showReportModal}
        onClose={handleReportClose}
        onConfirm={handleReportConfirm}
        post={post}
      />

      {/* Block Modal */}
      <BlockModal
        show={showBlockModal}
        onClose={handleBlockClose}
        onConfirm={handleBlockConfirm}
        username={post.username}
        userId={post.userId}
      />
    </>
  );
}

PostDropdown.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onDelete: PropTypes.func.isRequired,
  onPostRemoved: PropTypes.func.isRequired,
};

