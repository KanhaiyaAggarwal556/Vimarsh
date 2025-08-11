// MediaGrid.tsx
import React, { useEffect, useCallback, useState } from 'react';
import { Grid3X3, Heart, Copy, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { post } from '../types';

interface MediaGridProps {
  posts: post[];
  type?: string;
  isLoading?: boolean;
  hasMore?: boolean;
  loadMore?: () => void;
  isLoadingMore?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ 
  posts, 
  type = 'posts', 
  isLoading = false,
  hasMore = false,
  loadMore,
  isLoadingMore = false
}) => {
  const navigate = useNavigate();
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  // Handle post click navigation
  const handlePostClick = (postId: string) => {
    navigate(`/p/${postId}`);
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (isLoadingMore || !hasMore || !loadMore) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    // Trigger load more when user is 200px from bottom
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMore();
    }
  }, [isLoadingMore, hasMore, loadMore]);

  // Add scroll event listener
  useEffect(() => {
    if (hasMore && loadMore) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, hasMore, loadMore]);

  // Format number for display (e.g., 1.2K, 1.5M)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-4">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <div className="flex items-center gap-2 text-white text-base">
          <span className="animate-pulse">Loading {type}...</span>
        </div>
        <div className="text-gray-400 text-sm mt-2 animate-pulse">Please wait a moment</div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Grid3X3 size={48} className="mb-3 opacity-30" />
        <p className="text-base">No {type} yet</p>
        <p className="text-xs text-gray-500 mt-1">Content will appear here when available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-6">
        {posts.map((post, index) => {
          const hasMultipleMedia = post.images && post.images.length > 1;
          const likesCount = post.reactions?.likes || post.likes || 0; // Check both possible locations
          const viewsCount = post.views || 0;
          const isHovered = hoveredPost === post._id;
          
          return (
            <div
              key={post._id || index}
              className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer relative group"
              style={{ 
                aspectRatio: '3/4',
                animation: `fadeIn 0.5s ease-out ${index * 50}ms both`
              }}
              onClick={() => handlePostClick(post._id)}
              onMouseEnter={() => setHoveredPost(post._id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              {/* Main Image - Base Layer */}
              {post.images && post.images.length > 0 ? (
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isHovered ? 'scale-105' : 'scale-100'
                  }`}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center p-2 sm:p-3">
                  <span className="text-xs sm:text-sm text-gray-400 text-center font-medium">
                    {post.title}
                  </span>
                </div>
              )}

              {/* Multiple Media Indicator */}
              {hasMultipleMedia && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                  <div className="bg-black bg-opacity-80 rounded-full p-1.5 sm:p-2 backdrop-blur-sm shadow-lg">
                    <Copy size={12} className="text-white sm:w-4 sm:h-4" />
                  </div>
                </div>
              )}

              {/* Views Counter - Bottom Left (Always Visible) */}
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10">
                <div className="bg-black bg-opacity-80 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 backdrop-blur-sm flex items-center gap-1 shadow-lg">
                  <Eye size={12} className="text-white sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm text-white font-medium">
                    {formatNumber(viewsCount)}
                  </span>
                </div>
              </div>

              {/* Hover Overlay with Likes */}
              {isHovered && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  {/* Dark overlay background */}
                  <div 
                    className="absolute inset-0 bg-black transition-opacity duration-300"
                    style={{ opacity: 0.5 }}
                  />
                  
                  {/* Likes content */}
                  <div className="relative flex items-center gap-2 sm:gap-3 text-white z-30">
                    <Heart 
                      size={24} 
                      className="text-white sm:w-7 sm:h-7"
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' }}
                    />
                    <span 
                      className="text-lg sm:text-xl font-bold" 
                      style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                    >
                      {formatNumber(likesCount)}
                    </span>
                  </div>
                </div>
              )}

              {/* Border effect on hover */}
              <div 
                className={`absolute inset-0 rounded-lg border-2 transition-colors duration-300 pointer-events-none z-10 ${
                  isHovered ? 'border-blue-400' : 'border-transparent'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative mb-2">
            <div className="w-6 h-6 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <div className="text-gray-400 text-sm animate-pulse">Loading more {type}...</div>
        </div>
      )}

      {/* Load More Button (fallback for manual loading) */}
      {hasMore && !isLoadingMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={loadMore}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Load More {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-6">
          <div className="text-gray-500 text-sm">
            You've reached the end of {type}
          </div>
        </div>
      )}

      {/* CSS for fadeIn animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MediaGrid;