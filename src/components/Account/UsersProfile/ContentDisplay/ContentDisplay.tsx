// ContentDisplay.tsx (Main Component)
import React from 'react';
import { post, UserData } from '../types';
import PostGrid from './PostGrid';
import AboutSection from './AboutSection';
import MediaGrid from './MediaGrid';

interface ContentDisplayProps {
  activeTab: string;
  userData: UserData;
  posts: post[];
  isLoading: boolean;
  hasMore?: boolean;
  loadMore?: () => void;
  isLoadingMore?: boolean;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  activeTab,
  userData,
  posts,
  isLoading,
  hasMore = false,
  loadMore,
  isLoadingMore = false
}) => {
  // Filter posts with media for the media tab
  const mediaPosts = posts.filter(post => post.images && post.images.length > 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <PostGrid 
            posts={posts} 
            type="posts" 
            isLoading={isLoading}
            hasMore={hasMore}
            loadMore={loadMore}
            isLoadingMore={isLoadingMore}
          />
        );
      case 'about':
        return <AboutSection userData={userData} />;
      case 'bookmarks':
        return <PostGrid posts={[]} type="bookmarks" isLoading={false} />;
      case 'media':
        return (
          <MediaGrid 
            posts={mediaPosts} 
            type="media" 
            isLoading={isLoading}
            hasMore={hasMore}
            loadMore={loadMore}
            isLoadingMore={isLoadingMore}
          />
        );
      default:
        return (
          <PostGrid 
            posts={posts} 
            type="posts" 
            isLoading={isLoading}
            hasMore={hasMore}
            loadMore={loadMore}
            isLoadingMore={isLoadingMore}
          />
        );
    }
  };

  return <>{renderContent()}</>;
};

export default ContentDisplay;