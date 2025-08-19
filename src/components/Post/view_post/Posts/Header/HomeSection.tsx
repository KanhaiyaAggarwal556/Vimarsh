// components/Post/view_post/Posts/Header/HomeSection.tsx - Updated with spinner-style pull-to-refresh
import { RefObject } from 'react';
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
  const handleGetPostClick = () => {
    onRefetch?.();
    scrollToTop();
  };

  // Pull-to-refresh functionality
  const {
    containerRef,
    isPulling,
    pullDistance,
    isRefreshing,
    canRefresh,
    threshold,
    isEnabled: pullToRefreshEnabled
  } = usePullToRefresh({
    onRefresh: async () => {
      await onRefetch?.();
    },
    threshold: 60,
    resistance: 2.0,
    enabled: isActive && postList.length > 0,
    refreshing: fetching
  });

  // Calculate pull-to-refresh visual effects
  const pullProgress = Math.min(pullDistance / threshold, 1);
  const spinnerSize = 20 + (pullProgress * 8); // Grows from 20px to 28px
  const spinnerOpacity = Math.min(pullProgress * 2, 1);

  // Error state with retry option
  if (error && postList.length === 0) {
    return (
      <div className={createToggleClass('section home-section', isActive)}>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>Unable to load posts. Please check your connection and try again.</p>
          <button 
            className="retry-button"
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
      className={`${createToggleClass('section home-section', isActive)} ${
        pullToRefreshEnabled && isPulling ? 'pulling' : 'not-pulling'
      }`}
      ref={containerRef}
      style={pullToRefreshEnabled && isPulling ? {
        '--pull-distance': `${Math.min(pullDistance * 0.5, 30)}px`
      } as React.CSSProperties : undefined}
    >
      {/* Compact spinner-style pull-to-refresh indicator */}
      {pullToRefreshEnabled && (isPulling || isRefreshing) && (
        <div className={`pull-refresh-spinner ${spinnerOpacity > 0 ? 'visible' : 'hidden'}`}>
          <div 
            className={`spinner-container ${canRefresh || isRefreshing ? 'can-refresh' : 'not-ready'} ${
              isRefreshing ? 'refreshing' : ''
            }`}
            style={{
              width: `${spinnerSize}px`,
              height: `${spinnerSize}px`
            }}
          >
            {isRefreshing ? (
              <div className="spinner-loading" />
            ) : (
              <div 
                className="spinner-icon"
                style={{
                  fontSize: `${spinnerSize * 0.5}px`,
                  transform: `rotate(${pullProgress * 180}deg)`
                }}
              >
                ↓
              </div>
            )}
          </div>
        </div>
      )}

      {/* Regular refresh indicator for non-mobile */}
      {fetching && postList.length > 0 && !isPulling && !isRefreshing && (
        <div className="refresh-indicator">
          <div className="refresh-content">
            <LoadingSpinner size="small" />
            <span>Refreshing content...</span>
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="posts-list">
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
          style={{ height: '20px', margin: '20px 0' }}
        />
      )}
      
      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div 
          className="infinite-loading"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '20px'
          }}
        >
          <LoadingSpinner size="small" />
          <span style={{ fontSize: '14px', color: '#888' }}>
            Loading more posts...
          </span>
        </div>
      )}
      
      {/* Error state for additional pages */}
      {error && postList.length > 0 && (
        <div 
          className="load-more-error"
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="error-content"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px'
            }}
          >
            <span 
              className="error-message"
              style={{ fontSize: '14px', color: '#dc2626' }}
            >
              Failed to load more posts
            </span>
            <button 
              className="retry-button small"
              onClick={() => onRefetch?.()}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
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
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '40px 20px',
            justifyContent: 'center'
          }}
        >
          <div 
            className="end-content-line"
            style={{
              flex: '1',
              height: '1px',
              background: 'linear-gradient(to right, transparent, #d1d5db, transparent)'
            }}
          ></div>
          <span 
            className="end-content-text"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#888',
              whiteSpace: 'nowrap'
            }}
          >
            <span className="end-emoji">🎉</span>
            You've reached the end!
          </span>
          <div 
            className="end-content-line"
            style={{
              flex: '1',
              height: '1px',
              background: 'linear-gradient(to left, transparent, #d1d5db, transparent)'
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default HomeSection; 