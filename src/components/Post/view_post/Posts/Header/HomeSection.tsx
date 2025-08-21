// components/Post/view_post/Posts/Header/HomeSection.tsx - FIXED
import { RefObject, useState, useEffect } from 'react';
import { HomeSectionProps } from '@/types';
import { createToggleClass } from '@/utils/classNames';
import { scrollToTop } from '@/utils/scroll';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import Post from '../../Single_Post/post';
import WelcomeMessage from '../../WelcomeMessage';
import LoadingSpinner from '../../Loading/LoadingSpinner';
import "./HomeSection.css"

interface ExtendedHomeSectionProps extends HomeSectionProps {
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  sentinelRef?: RefObject<HTMLDivElement>;
  error?: Error | null;
}

// Mobile-optimized spinner component
const MobileSpinner = () => {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20"
      className="mobile-spinner"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="#3447b2"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="31.416"
        strokeDashoffset="31.416"
      />
    </svg>
  );
};

const HomeSection = ({
  isActive,
  fetching,
  postList,
  onRefetch,
  isFetchingNextPage,
  hasNextPage,
  sentinelRef,
  error,
}: ExtendedHomeSectionProps) => {
  const [internalRefreshing, setInternalRefreshing] = useState(false);
  
  const handleGetPostClick = () => {
    onRefetch?.();
    scrollToTop();
  };

  // Enhanced pull-to-refresh with visual indicators
  const { 
    containerRef, 
    isPulling, 
    isRefreshing, 
    canRefresh, 
    showIndicator,
    pullDistance,
    progress,
    postsTransform
  } = usePullToRefresh({
    onRefresh: async () => {
      setInternalRefreshing(true);
      try {
        if (onRefetch) {
          await onRefetch();
        }
      } finally {
        setInternalRefreshing(false);
      }
    },
    threshold: 80,
    resistance: 2.5,
    enabled: isActive && postList.length > 0 && !fetching,
    refreshing: fetching || internalRefreshing
  });

  // Reset internal refreshing state when fetching changes
  useEffect(() => {
    if (!fetching && internalRefreshing) {
      setInternalRefreshing(false);
    }
  }, [fetching, internalRefreshing]);

  // Error state
  if (error && postList.length === 0) {
    return (
      <div className={createToggleClass('section home-section', isActive)}>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>Unable to load posts. Please check your connection and try again.</p>
          <button 
            className={`retry-button ${fetching ? 'loading' : ''}`}
            onClick={handleGetPostClick}
            disabled={fetching}
          >
            {fetching ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // Initial loading state
  if (fetching && postList.length === 0) {
    return (
      <div className={createToggleClass('section home-section', isActive)}>
        <div className="initial-loading">
          <LoadingSpinner />
          <p>Loading fresh content...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (postList.length === 0 && !fetching) {
    return (
      <div className={createToggleClass('section home-section', isActive)}>
        <WelcomeMessage onGetPostClick={handleGetPostClick} />
      </div>
    );
  }

  return (
    <div 
      className={createToggleClass('section home-section', isActive)}
      ref={containerRef}
    >
      {/* Pull-to-refresh indicator */}
      {showIndicator && (
        <div 
          className="pull-refresh-indicator"
          style={{
            transform: `translateY(${Math.min(pullDistance - 20, 60)}px)`,
            WebkitTransform: `translateY(${Math.min(pullDistance - 20, 60)}px)`,
            opacity: Math.min(progress * 2, 1)
          }}
        >
          <div className="pull-refresh-content">
            {isRefreshing ? (
              <>
                <div className="refresh-spinner"></div>
                <span className="refresh-text">Refreshing...</span>
              </>
            ) : canRefresh ? (
              <>
                <div className="refresh-icon ready">↻</div>
                <span className="refresh-text">Release to refresh</span>
              </>
            ) : (
              <>
                <div 
                  className="refresh-icon"
                  style={{ 
                    transform: `rotate(${progress * 180}deg)`,
                    WebkitTransform: `rotate(${progress * 180}deg)`
                  }}
                >
                  ↓
                </div>
                <span className="refresh-text">Pull to refresh</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Posts list with transform for pull effect */}
      <div 
        className="posts-list"
        style={{
          transform: `translateY(${postsTransform}px)`,
          WebkitTransform: `translateY(${postsTransform}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {postList.map((post, index) => (
          <Post 
            key={`${post._id}-${index}`}
            post={post} 
          />
        ))}
      </div>
      
      {/* Infinite scroll sentinel */}
      {hasNextPage && (
        <div 
          ref={sentinelRef} 
          className="infinite-scroll-sentinel"
          style={{ 
            height: '10px',
            margin: '20px 0',
            background: 'transparent',
            transform: `translateY(${postsTransform}px)`,
            WebkitTransform: `translateY(${postsTransform}px)`,
            transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        />
      )}
      
      {/* FIXED: Mobile-optimized loading indicator */}
      {isFetchingNextPage && (
        <div 
          className="infinite-loading-mobile"
          style={{
            transform: `translateY(${postsTransform}px)`,
            WebkitTransform: `translateY(${postsTransform}px)`,
            transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <MobileSpinner />
          <span>Loading more posts...</span>
        </div>
      )}
      
      {/* Error state for load more */}
      {error && postList.length > 0 && (
        <div 
          className="load-more-error"
          style={{
            transform: `translateY(${postsTransform}px)`,
            WebkitTransform: `translateY(${postsTransform}px)`,
            transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <div className="error-content">
            <span className="error-message">
              Failed to load more posts
            </span>
            <button 
              className="retry-button small"
              onClick={() => onRefetch?.()}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* End of content indicator */}
      {!hasNextPage && !isFetchingNextPage && postList.length > 0 && (
        <div 
          className="end-of-content"
          style={{
            transform: `translateY(${postsTransform}px)`,
            WebkitTransform: `translateY(${postsTransform}px)`,
            transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <div className="end-content-line"></div>
          <span className="end-content-text">
            <span className="end-emoji">🎉</span>
            You've reached the end!
          </span>
          <div className="end-content-line"></div>
        </div>
      )}
    </div>
  );
};

export default HomeSection;