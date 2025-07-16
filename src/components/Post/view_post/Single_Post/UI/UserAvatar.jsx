import PropTypes from 'prop-types';
import { useState } from 'react';
import "../style/UserAvatar.css";

export default function UserAvatar({ user, size = 40, showOnlineStatus = false, onClick }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick(user);
    }
  };

  // Generate initials from username or name
  const getInitials = (user) => {
    if (!user) return 'U';
    
    const name = user.name || user.username;
    if (!name) return 'U';
    
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on user ID with gradient support
  const getAvatarGradient = (userId) => {
    if (!userId) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)',
      'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)',
      'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
      'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
      'linear-gradient(135deg, #b721ff 0%, #21d4fd 100%)',
    ];
    
    const hash = userId.toString().split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return gradients[Math.abs(hash) % gradients.length];
  };

  const renderAvatar = () => {
    // If user has avatar and no error, show image
    if (user?.avatar && !imageError) {
      return (
        <>
          {imageLoading && (
            <div className="user-avatar-skeleton" style={avatarStyle}>
              <div className="skeleton-pulse"></div>
            </div>
          )}
          <img 
            src={user.avatar} 
            alt={`${user.name || user.username || 'User'}'s avatar`}
            className="post-avatar-img"
            style={{
              ...avatarStyle,
              display: imageLoading ? 'none' : 'block'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </>
      );
    }

    // Fallback to initials with gradient background
    const initials = getInitials(user);
    const backgroundGradient = getAvatarGradient(user?.id || user?.userId);
    
    return (
      <div 
        className="user-avatar-initials" 
        style={{
          ...avatarStyle,
          background: backgroundGradient,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${size * 0.4}px`,
          fontWeight: '600',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        {initials}
      </div>
    );
  };

  return (
    <div 
      className={`post-user-avatar ${onClick ? 'clickable' : ''} ${showOnlineStatus ? 'has-status' : ''}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      } : undefined}
    >
      <div className="avatar-wrapper">
        {renderAvatar()}
        
        {/* Animated ring on hover */}
        <div className="avatar-ring"></div>
        
        {/* Pulse animation for online status */}
        {showOnlineStatus && (
          <div className="pulse-ring"></div>
        )}
      </div>
      
      {/* Online status indicator */}
      {showOnlineStatus && (
        <div className="user-status-indicator">
          <div className="status-dot online"></div>
        </div>
      )}
    </div>
  );
}

UserAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    avatar: PropTypes.string,
    name: PropTypes.string,
    username: PropTypes.string,
  }),
  size: PropTypes.number,
  showOnlineStatus: PropTypes.bool,
  onClick: PropTypes.func,
};

UserAvatar.defaultProps = {
  user: null,
  size: 40,
  showOnlineStatus: false,
  onClick: null,
};