import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../style/Modal.css';

const ReportModal = ({ show, onClose, onConfirm, post }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { value: 'spam', label: 'Spam or misleading content' },
    { value: 'harassment', label: 'Harassment or bullying' },
    { value: 'hate_speech', label: 'Hate speech or discrimination' },
    { value: 'violence', label: 'Violence or threats' },
    { value: 'inappropriate', label: 'Inappropriate or explicit content' },
    { value: 'misinformation', label: 'False or misleading information' },
    { value: 'copyright', label: 'Copyright infringement' },
    { value: 'other', label: 'Other' }
  ];

  // Reset form when modal is opened
  useEffect(() => {
    if (show) {
      setSelectedReason('');
      setAdditionalDetails('');
      setIsSubmitting(false);
    }
  }, [show]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && show && !isSubmitting) {
        handleClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedReason) {
      alert('Please select a reason for reporting this post.');
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = {
        postId: post.id,
        reportedUserId: post.userId,
        reason: selectedReason,
        additionalDetails: additionalDetails.trim(),
        timestamp: new Date().toISOString()
      };

      await onConfirm(reportData);
    } catch (error) {
      console.error('Error submitting report:', error);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    setSelectedReason('');
    setAdditionalDetails('');
    setIsSubmitting(false);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      handleClose();
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report Post</h2>
          <button 
            className="modal-close" 
            onClick={handleClose}
            disabled={isSubmitting}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="report-post-info">
            <p>You're reporting a post by <strong>@{post.userId}</strong></p>
            <p className="report-disclaimer">
              Reports are reviewed by our team and action will be taken if the content violates our community guidelines.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Why are you reporting this post?</label>
              <div className="radio-group">
                {reportReasons.map((reason) => (
                  <label key={reason.value} className="radio-option">
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason.value}
                      checked={selectedReason === reason.value}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <span className="radio-label">{reason.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="additionalDetails">
                Additional details (optional)
              </label>
              <textarea
                id="additionalDetails"
                className="form-textarea"
                placeholder="Provide any additional context that might help us understand the issue..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                rows="4"
                maxLength="500"
                disabled={isSubmitting}
              />
              <div className="character-count">
                {additionalDetails.length}/500
              </div>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-danger"
                disabled={isSubmitting || !selectedReason}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ReportModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default ReportModal;