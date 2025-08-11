// PostGrid.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { Grid3X3 } from 'lucide-react';
import { post } from '../types';
import Post from '@/components/Post/view_post/Single_Post/post';

interface PostGridProps {
  posts: post[];
  type?: string;
  isLoading?: boolean;
  hasMore?: boolean;
  loadMore?: () => void;
  isLoadingMore?: boolean;
}

const PostGrid: React.FC<PostGridProps> = ({ 
  posts, 
  type = 'posts', 
  isLoading = false, 
  hasMore = false,
  loadMore,
  isLoadingMore = false
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    // console.log('Intersection Observer triggered:', {
    //   isIntersecting: target.isIntersecting,
    //   hasMore,
    //   isLoadingMore,
    //   canLoadMore: target.isIntersecting && hasMore && !isLoadingMore
    // });
    
    if (target.isIntersecting && hasMore && !isLoadingMore && loadMore) {
      // console.log('Calling loadMore function');
      loadMore();
    }
  }, [hasMore, isLoadingMore, loadMore]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  // Add fadeIn animation styles
  useEffect(() => {
    const styleId = 'fadeIn-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
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
      `;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-6">
          <div className="w-12 h-12 border-3 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-b-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="flex items-center gap-2 text-white text-lg font-medium">
          <span className="animate-pulse">Loading {type}...</span>
        </div>
        <div className="text-gray-400 text-sm mt-3 animate-pulse">Preparing your content</div>
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
    <div className="px-4 sm:px-0">
      <div className="grid grid-cols-1 pt-4 space-y-1">
        {posts.map((post, index) => (
          <div
            key={post._id || index}
            className="transform transition-all duration-300 hover:scale-[1.01] opacity-100"
            style={{ 
              animation: `fadeIn 0.5s ease-out ${index * 100}ms both`
            }}
          >
            <Post 
              post={post as any}
              showComments={false}
              comments={[]}
              postId={post._id || ''}
            />
          </div>
        ))}
      </div>

      {isLoadingMore && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-4">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="animate-pulse">Loading more posts...</span>
          </div>
          <div className="text-gray-500 text-xs mt-2 animate-pulse">Just a moment</div>
        </div>
      )}

      {hasMore && !isLoadingMore && (
        <div 
          ref={observerTarget}
          className="h-12 flex items-center justify-center bg-gradient-to-r from-transparent via-gray-800/20 to-transparent rounded-lg my-6 animate-pulse"
        >
          <div className="text-gray-500 text-xs flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <span>Scroll for more posts</span>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 text-sm flex items-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
            <span className="px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50">
              You've reached the end
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostGrid;