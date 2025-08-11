// UserInfo.tsx - Updated to use complete analytics data
import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Calendar } from 'lucide-react';
import { UserData } from '../types';
import { formatNumber } from '../utils';
import { fetchUserAnalytics } from '../api'; // Import the analytics API
import FollowersModal from './FollowersModal';
import './UserInfo.css';

interface UserInfoProps {
  userData: UserData;
}

interface DynamicStats {
  followers: number;
  following: number;
  posts: number;
  likes: number;
  comments?: number;
  bookmarks?: number;
}

// Use the same analytics interface as AboutSection
interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgViewsPerPost: number;
  avgLikesPerPost: number;
  totalPosts: number;
  monthlyGrowth: number;
  chartData: any[];
}

const UserInfo: React.FC<UserInfoProps> = ({ userData }) => {
  const [stats, setStats] = useState<DynamicStats>({
    followers: userData.board?.socialStats?.followers || 0,
    following: userData.board?.socialStats?.following || 0,
    posts: 0,
    likes: 0,
    comments: 0,
    bookmarks: userData.board?.bookmarks?.length || 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'followers' | 'following'>('followers');

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        setIsLoadingStats(true);
        
        // Use the same analytics endpoint as AboutSection for complete data
        const analyticsData: AnalyticsData = await fetchUserAnalytics(userData._id);
        
        // Update stats with complete analytics data
        setStats(prevStats => ({
          ...prevStats,
          posts: analyticsData.totalPosts, // Complete posts count
          likes: analyticsData.totalLikes, // Complete likes count
          comments: analyticsData.totalComments // Complete comments count
        }));
      } catch (error) {
        console.error('Error loading user analytics:', error);
        
        // Fallback: try to get basic stats from userData if analytics fails
        const fallbackStats: DynamicStats = {
          followers: userData.board?.socialStats?.followers || 0,
          following: userData.board?.socialStats?.following || 0,
          posts: userData.board?.socialStats?.posts || 0,
          likes: userData.board?.socialStats?.likes || 0,
          comments: 0,
          bookmarks: userData.board?.bookmarks?.length || 0
        };
        
        setStats(fallbackStats);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (userData._id) {
      loadUserStats();
    }
  }, [userData._id]);

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const handleFollowStatsClick = (statType: 'followers' | 'following') => {
    setModalTab(statType);
    setIsModalOpen(true);
  };

  const handleLocationClick = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="user-info-container">
      <div className="user-info-content">
        {/* User Details */}
        <div className="user-details">
          <h1 className="user-name">{userData.fullName}</h1>
          <p className="user-handle">@{userData.userName}</p>
          
          {userData.board?.bio && (
            <p className="user-bio">{userData.board.bio}</p>
          )}
          
          <div className="user-meta">
            {userData.board?.location && (
              <div className="meta-item">
                <MapPin size={16} className="meta-icon" />
                <span 
                  className="location-link"
                  onClick={() => handleLocationClick(userData.board.location!)}
                >
                  {userData.board.location}
                </span>
              </div>
            )}
            
            {userData.board?.website && (
              <div className="meta-item">
                <Globe size={16} className="meta-icon" />
                <a 
                  href={userData.board.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="meta-link"
                >
                  {userData.board.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            {userData.createdAt && (
              <div className="meta-item">
                <Calendar size={16} className="meta-icon" />
                <span>Joined {formatJoinDate(userData.createdAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Social Stats - Positioned on the right side */}
        <div className="stats-container">
          {/* Follow Stats Button */}
          <div className="stats-group follow-stats">
            <div 
              className="stat-button clickable"
              onClick={() => handleFollowStatsClick('followers')}
            >
              <span className="stat-value">{formatNumber(stats.followers)}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-divider"></div>
            <div 
              className="stat-button clickable"
              onClick={() => handleFollowStatsClick('following')}
            >
              <span className="stat-value">{formatNumber(stats.following)}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          {/* Content Stats Button - Now with complete data */}
          <div className="stats-group content-stats">
            <div className={`stat-button ${isLoadingStats ? 'loading' : ''}`}>
              <span className="stat-value">
                {isLoadingStats ? '...' : formatNumber(stats.posts)}
              </span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-divider"></div>
            <div className={`stat-button ${isLoadingStats ? 'loading' : ''}`}>
              <span className="stat-value">
                {isLoadingStats ? '...' : formatNumber(stats.likes)}
              </span>
              <span className="stat-label">Likes</span>
            </div>
          </div>
        </div>
      </div>

      <FollowersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userData._id}
        initialTab={modalTab}
        followersCount={stats.followers}
        followingCount={stats.following}
      />
    </div>
  );
};

export default UserInfo;