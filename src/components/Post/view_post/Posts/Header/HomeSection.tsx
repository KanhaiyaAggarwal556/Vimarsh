// components/Post/view_post/Posts/Header/HomeSection.tsx - Fixed version
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

  // Enhanced pull-to-refresh functionality
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
      setInternalRefreshing(true);
      try {
        if (onRefetch) {
          await onRefetch();
        }
      } finally {
        setInternalRefreshing(false);
      }
    },
    threshold: 70, // Slightly higher threshold for better UX
    resistance: 2.2, // More resistance for natural feel
    enabled: isActive && postList.length > 0 && !fetching,
    refreshing: fetching || internalRefreshing
  });

  // Reset internal refreshing state when fetching changes
  useEffect(() => {
    if (!fetching && internalRefreshing) {
      setInternalRefreshing(false);
    }
  }, [fetching, internalRefreshing]);

  // Calculate enhanced pull-to-refresh visual effects
  const pullProgress = Math.min(pullDistance / threshold, 1);
  const spinnerSize = 24 + (pullProgress * 16); // Larger spinner
  const spinnerOpacity = Math.min(pullProgress * 1.5, 1);

  // Enhanced spinner visibility logic
  const actuallyRefreshing = isRefreshing || internalRefreshing;
  const showSpinner = pullToRefreshEnabled && (isPulling || actuallyRefreshing) && isActive;
  const spinnerVisible = showSpinner && (spinnerOpacity > 0.1 || actuallyRefreshing);

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
        '--pull-distance': `${Math.min(pullDistance * 0.3, 40)}px`
      } as React.CSSProperties : undefined}
    >
      {/* Enhanced pull-to-refresh spinner indicator */}
      {showSpinner && (
        <div 
          className={`pull-refresh-spinner ${spinnerVisible ? 'visible' : 'hidden'}`}
          style={{
            opacity: actuallyRefreshing ? 1 : spinnerOpacity,
            display: actuallyRefreshing || spinnerVisible ? 'flex' : 'none'
          }}
        >
          <div 
            className={`spinner-container ${canRefresh || actuallyRefreshing ? 'can-refresh' : 'not-ready'} ${
              actuallyRefreshing ? 'refreshing' : ''
            }`}
            style={{
              width: `${Math.max(spinnerSize, 50)}px`,
              height: `${Math.max(spinnerSize, 50)}px`
            }}
          >
            {actuallyRefreshing ? (
              <div className="spinner-loading" />
            ) : (
              <div 
                className="spinner-icon"
                style={{
                  fontSize: `${Math.max(spinnerSize * 0.4, 20)}px`,
                  transform: `rotate(${pullProgress * 180}deg)`
                }}
              >
                ↓
              </div>
            )}
          </div>
          
          {/* Enhanced feedback text */}
          {canRefresh && !actuallyRefreshing && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '8px',
              fontSize: '12px',
              color: '#fff',
              background: 'rgba(52, 71, 178, 0.9)',
              padding: '4px 8px',
              borderRadius: '12px',
              whiteSpace: 'nowrap',
              opacity: pullProgress > 0.8 ? 1 : 0,
              transition: 'opacity 0.2s ease'
            }}>
              Release to refresh
            </div>
          )}
          
          {actuallyRefreshing && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '8px',
              fontSize: '12px',
              color: '#fff',
              background: 'rgba(34, 197, 94, 0.9)',
              padding: '4px 8px',
              borderRadius: '12px',
              whiteSpace: 'nowrap'
            }}>
              Refreshing...
            </div>
          )}
        </div>
      )}

      {/* Regular refresh indicator for non-mobile or non-pull refresh */}
      {fetching && postList.length > 0 && !isPulling && !actuallyRefreshing && (
        <div className="refresh-indicator">
          <div className="refresh-content">
            <LoadingSpinner size="small" />
            <span>Refreshing content...</span>
          </div>
        </div>
      )}

      {/* Posts list with better structure */}
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
          style={{ 
            height: '20px',
            margin: '40px 0',
            background: 'transparent' 
          }}
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