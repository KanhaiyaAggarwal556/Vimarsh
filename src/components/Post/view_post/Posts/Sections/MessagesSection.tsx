// MessagesSection.tsx - Enhanced with proper centering and improved UI
import { MessagesSectionProps } from '@/types';
import { createToggleClass } from '@/utils/classNames';
import "./MessagesSection.css"

const MessagesSection = ({ isActive }: MessagesSectionProps) => {
  return (
    <div className={createToggleClass('section messages-section', isActive)}>
      <div className="messages-container">
        <div className="messages-placeholder">
          {/* Icon */}
          <div className="messages-icon">
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="message-svg"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <circle cx="9" cy="10" r="1"/>
              <circle cx="15" cy="10" r="1"/>
            </svg>
          </div>

          {/* Content */}
          <div className="messages-content">
            <h2 className="messages-title">Messages</h2>
            <p className="messages-description">
              Your conversations will appear here. Stay connected with your friends and community.
            </p>
          </div>

          {/* Coming Soon Badge */}
          <div className="coming-soon-badge">
            <span className="badge-text">Coming Soon</span>
          </div>

          {/* Additional Features Preview */}
          <div className="features-preview">
            <div className="feature-item">
              <div className="feature-icon">💬</div>
              <span>Direct Messages</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <span>Group Chats</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔔</div>
              <span>Real-time Notifications</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="messages-cta">
            <button className="cta-button" disabled>
              <span>Start Messaging</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesSection;