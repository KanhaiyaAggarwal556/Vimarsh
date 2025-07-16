import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../style/Modal.css';

const BlockModal = ({ show, onClose, onConfirm, username, userId }) => {
  const [isBlocking, setIsBlocking] = useState(false);

  // Reset state when modal is opened
  useEffect(() => {
    if (show) {
      setIsBlocking(false);
    }
  }, [show]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && show && !isBlocking) {
        handleClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, isBlocking]);

  const handleBlock = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsBlocking(true);

    try {
      await onConfirm();
    } catch (error) {
      console.error('Error blocking user:', error);
      setIsBlocking(false);
    }
  };

  const handleClose = () => {
    if (isBlocking) return;
    
    setIsBlocking(false);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isBlocking) {
      handleClose();
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Block @{userId}?</h2>
          <button 
            className="modal-close" 
            onClick={handleClose}
            disabled={isBlocking}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="block-user-info">
            <div className="block-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M4.93 4.93l14.14 14.14" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            
            <div className="block-details">
              <p><strong>{username}</strong> will no longer be able to:</p>
              <ul>
                <li>See your posts and profile</li>
                <li>Send you messages</li>
                <li>Follow you</li>
                <li>Tag you in posts</li>
              </ul>
              
              <p>You will also:</p>
              <ul>
                <li>No longer see their posts in your feed</li>
                <li>Be automatically unfollowed from each other</li>
                <li>Have all their posts removed from your timeline</li>
              </ul>
              
              <p className="block-note">
                <strong>Note:</strong> This action can be undone by unblocking them from your settings.
              </p>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isBlocking}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={handleBlock}
              disabled={isBlocking}
            >
              {isBlocking ? 'Blocking...' : 'Block'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

BlockModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default BlockModal;