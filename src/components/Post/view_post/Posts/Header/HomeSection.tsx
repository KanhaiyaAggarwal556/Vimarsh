// components/Post/view_post/Posts/Header/HomeSection.tsx - Enhanced with better visual feedback
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
    threshold: 80,
    resistance: 2.0,
    enabled: isActive && postList.length > 0,
    refreshing: fetching
  });

  // Calculate pull-to-refresh visual effects
  const pullProgress = Math.min(pullDistance / threshold, 1);
  const pullOpacity = Math.min(pullProgress * 1.5, 1);
  const iconRotation = pullProgress * 180;

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
      className={createToggleClass('section home-section', isActive)}
      ref={containerRef}
      style={{
        position: 'relative'
      }}
    >
      {/* Pull-to-refresh indicator */}
      {pullToRefreshEnabled && (isPulling || isRefreshing) && (
        <div 
          className="pull-to-refresh-indicator"
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: `translateX(-50%) translateY(${Math.min(pullDistance * 0.6, 60)}px)`,
            opacity: pullOpacity,
            zIndex: 100,
            transition: isPulling ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div 
            className="pull-refresh-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: `2px solid ${canRefresh ? '#10b981' : '#e5e7eb'}`
            }}
          >
            {isRefreshing ? (
              <>
                <div style={{ width: '24px', height: '24px' }}>
                  <LoadingSpinner size="small" />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Refreshing...</span>
              </>
            ) : (
              <>
                <div 
                  className="pull-refresh-icon"
                  style={{
                    fontSize: '24px',
                    transform: `rotate(${iconRotation}deg)`,
                    color: canRefresh ? '#10b981' : '#6b7280',
                    transition: 'transform 0.1s ease-out, color 0.2s ease-out'
                  }}
                >
                  ↓
                </div>
                <span 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    color: canRefresh ? '#10b981' : '#6b7280',
                    transition: 'color 0.2s ease-out'
                  }}
                >
                  {canRefresh ? 'Release to refresh' : 'Pull to refresh'}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Regular refresh indicator for non-mobile */}
      {fetching && postList.length > 0 && !isPulling && !isRefreshing && (
        <div 
          className="refresh-indicator"
          style={{
            position: 'sticky',
            top: '0',
            zIndex: 50,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <div 
            className="refresh-content"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px'
            }}
          >
            <LoadingSpinner size="small" />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Refreshing content...
            </span>
          </div>
        </div>
      )}

      {/* Posts list with smooth transforms */}
      <div 
        className="posts-list"
        style={{
          transform: pullToRefreshEnabled && isPulling 
            ? `translateY(${Math.min(pullDistance * 0.3, 20)}px)` 
            : 'translateY(0)',
          transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
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
              color: '#6b7280',
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