import React, { useState, KeyboardEvent, MouseEvent } from 'react';
import { User } from 'lucide-react';
import "../style/UserAvatar.css";

// Type definitions
interface User {
  id?: string | number;
  userId?: string | number;
  avatar?: string;
  name?: string;
  username?: string;
}

interface UserAvatarProps {
  user?: User | null;
  size?: number;
  showOnlineStatus?: boolean;
  onClick?: (user: User) => void;
}

export default function UserAvatar({ 
  user = null, 
  size = 40, 
  showOnlineStatus = false, 
  onClick 
}: UserAvatarProps) {
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const avatarStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const handleImageLoad = (): void => {
    setImageLoading(false);
  };

  const handleImageError = (): void => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (onClick && user) {
      e.preventDefault();
      e.stopPropagation();
      onClick(user);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (onClick && user && (e.key === 'Enter' || e.key === ' ')) {
      handleClick(e as any);
    }
  };

  // Generate initials from username or name
  const getInitials = (user: User | null): string => {
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
  const getAvatarGradient = (userId: string | number | undefined): string => {
    if (!userId) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    const gradients: string[] = [
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

  const renderAvatar = (): JSX.Element => {
    // If user has avatar and no error, show image
    if (user?.avatar && user.avatar.trim() !== '' && !imageError) {
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

    // If user exists but no profile picture, show initials with background
    if (user && (user.name || user.username)) {
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
    }

    // Fallback to User icon (for not logged in state)
    return (
      <div 
        className="user-avatar-fallback" 
        style={{
          ...avatarStyle,
          background: 'none',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <User size={size * 0.7} />
      </div>
    );
  };

  return (
    <div 
      className={`post-user-avatar ${onClick ? 'clickable' : ''} ${showOnlineStatus ? 'has-status' : ''}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
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

export type { User, UserAvatarProps };