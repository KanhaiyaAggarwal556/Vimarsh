// components/Post/view_post/Posts/Header/HomeSection.tsx - Cleaned version with CSS-only styles
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
  const spinnerSize = 20 + (pullProgress * 12);
  const spinnerOpacity = Math.min(pullProgress * 2, 1);

  // Enhanced spinner visibility logic
  const showSpinner = pullToRefreshEnabled && (isPulling || isRefreshing);
  const spinnerVisible = showSpinner && (spinnerOpacity > 0.1 || isRefreshing);

  // Error state with retry option
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
      className={`${createToggleClass('section home-section', isActive)} ${
        pullToRefreshEnabled && isPulling ? 'pulling' : 'not-pulling'
      }`}
      ref={containerRef}
      style={pullToRefreshEnabled && isPulling ? {
        '--pull-distance': `${Math.min(pullDistance * 0.5, 30)}px`
      } as React.CSSProperties : undefined}
    >
      {/* Pull-to-refresh spinner indicator */}
      {showSpinner && (
        <div 
          className={`pull-refresh-spinner ${spinnerVisible ? 'visible' : 'hidden'}`}
          style={{
            opacity: isRefreshing ? 1 : spinnerOpacity,
            display: isRefreshing || spinnerVisible ? 'flex' : 'none'
          }}
        >
          <div 
            className={`spinner-container ${canRefresh || isRefreshing ? 'can-refresh' : 'not-ready'} ${
              isRefreshing ? 'refreshing' : ''
            }`}
            style={{
              width: `${Math.max(spinnerSize, 40)}px`,
              height: `${Math.max(spinnerSize, 40)}px`
            }}
          >
            {isRefreshing ? (
              <div className="spinner-loading" />
            ) : (
              <div 
                className="spinner-icon"
                style={{
                  fontSize: `${Math.max(spinnerSize * 0.5, 16)}px`,
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
        />
      )}
      
      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="infinite-loading">
          <LoadingSpinner size="small" />
          <span>Loading more posts...</span>
        </div>
      )}
      
      {/* Error state for additional pages */}
      {error && postList.length > 0 && (
        <div className="load-more-error">
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
        <div className="end-of-content">
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