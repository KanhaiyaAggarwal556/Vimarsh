// AboutSection.tsx - Updated version with CSS classes
import React, { useState, useEffect } from 'react';
import { User, Heart, Mail, BarChart3, Link, Image } from 'lucide-react';
import { UserData, post, ActivityData } from '../types';
import { fetchUserAnalytics } from '../api';
import './AboutSection.css';

interface AboutSectionProps {
  userData: UserData;
  posts?: post[]; // Keep for backward compatibility but won't be used for analytics
}

interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgViewsPerPost: number;
  avgLikesPerPost: number;
  totalPosts: number;
  monthlyGrowth: number;
  chartData: ActivityData[];
}

const AboutSection: React.FC<AboutSectionProps> = ({ userData}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  const joinDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Fetch analytics data from dedicated endpoint
  const fetchAnalytics = async () => {
    try {
      setIsLoadingAnalytics(true);
      
      // Fetch from dedicated analytics endpoint
      const analyticsData = await fetchUserAnalytics(userData._id);
      
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to empty analytics
      setAnalytics({
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        avgViewsPerPost: 0,
        avgLikesPerPost: 0,
        totalPosts: 0,
        monthlyGrowth: 0,
        chartData: []
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [userData._id]);

  // Loading state
  if (isLoadingAnalytics || !analytics) {
    return (
      <div className="about-section">
        <div className="loading-card">
          <div className="loading-title"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="loading-item"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="about-section">
      {/* Basic Information */}
      <div className="about-card basic-info">
        <h3 className="section-header">
          <div className="section-icon blue">
            <User size={20} className="text-blue-400" />
          </div>
          Basic Information
        </h3>
        <div className="space-y-3">
          <div className="info-row">
            <span className="info-label">Full Name</span>
            <span className="info-value">{userData.fullName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Username</span>
            <span className="info-value blue">@{userData.userName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Joined</span>
            <span className="info-value">{joinDate}</span>
          </div>
          {userData.board?.location && (
            <div className="info-row">
              <span className="info-label">Location</span>
              <span className="info-value">{userData.board.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="about-card contact-info">
        <h3 className="section-header">
          <div className="section-icon green">
            <Mail size={20} className="text-green-400" />
          </div>
          Contact Information
        </h3>
        <div className="space-y-3">
          <div className="info-row">
            <span className="info-label">Email</span>
            <a 
              href={`mailto:${userData.email}`}
              className="info-value green info-link"
            >
              {userData.email}
            </a>
          </div>
          {userData.board?.website && (
            <div className="info-row">
              <span className="info-label">Website</span>
              <a 
                href={userData.board.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="info-value blue info-link truncate"
              >
                {userData.board.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Dashboard - Now with Complete Data */}
      <div className="about-card analytics">
        <h3 className="section-header">
          <div className="section-icon purple">
            <BarChart3 size={20} className="text-purple-400" />
          </div>
          Analytics Dashboard
          <span className="analytics-badge">
            All Posts Data
          </span>
        </h3>
        
        {/* Key Metrics - Complete Data */}
        <div className="metrics-grid">
          <div className="metric-card blue">
            <div className="metric-label blue">Total Views</div>
            <div className="metric-value">{analytics.totalViews.toLocaleString()}</div>
            <div className="metric-subtitle blue">
              {analytics.monthlyGrowth > 0 ? '+' : ''}{analytics.monthlyGrowth}% this month
            </div>
          </div>
          
          <div className="metric-card pink">
            <div className="metric-label pink">Total Likes</div>
            <div className="metric-value">{analytics.totalLikes.toLocaleString()}</div>
            <div className="metric-subtitle pink">
              Engagement Rate: {analytics.totalViews > 0 ? Math.round((analytics.totalLikes / analytics.totalViews) * 100) : 0}%
            </div>
          </div>
          
          <div className="metric-card green">
            <div className="metric-label green">Avg Views/Post</div>
            <div className="metric-value">{analytics.avgViewsPerPost}</div>
            <div className="metric-subtitle green">From {analytics.totalPosts} posts</div>
          </div>
          
          <div className="metric-card orange">
            <div className="metric-label orange">Avg Likes/Post</div>
            <div className="metric-value">{analytics.avgLikesPerPost}</div>
            <div className="metric-subtitle orange">Performance metric</div>
          </div>
        </div>

        {/* Mini Chart Visualization - Complete Data */}
        <div className="chart-container">
          <div className="chart-title">Monthly Performance (Complete Data)</div>
          <div className="chart-bars">
            {analytics.chartData.map((data) => {
              const maxViews = Math.max(...analytics.chartData.map(d => d.views));
              const maxLikes = Math.max(...analytics.chartData.map(d => d.likes));
              
              return (
                <div key={data.date} className="chart-bar-group">
                  <div className="chart-bars-container">
                    <div 
                      className="chart-bar views"
                      style={{ 
                        height: `${maxViews > 0 ? (data.views / maxViews) * 60 : 0}px`,
                        minHeight: data.views > 0 ? '4px' : '0px'
                      }}
                      title={`${data.views} views`}
                    ></div>
                    <div 
                      className="chart-bar likes"
                      style={{ 
                        height: `${maxLikes > 0 ? (data.likes / maxLikes) * 60 : 0}px`,
                        minHeight: data.likes > 0 ? '4px' : '0px'
                      }}
                      title={`${data.likes} likes`}
                    ></div>
                  </div>
                  <span className="chart-label">{data.date}</span>
                </div>
              );
            })}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot blue"></div>
              <span className="legend-text">Views</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot pink"></div>
              <span className="legend-text">Likes</span>
            </div>
          </div>
        </div>

        {/* Social Stats - Real Data */}
        <div className="social-stats">
          <div className="social-stat">
            <div className="social-stat-value">{userData.board?.socialStats?.followers || 0}</div>
            <div className="social-stat-label">Followers</div>
          </div>
          <div className="social-stat">
            <div className="social-stat-value">{userData.board?.socialStats?.following || 0}</div>
            <div className="social-stat-label">Following</div>
          </div>
          <div className="social-stat">
            <div className="social-stat-value">{analytics.totalPosts}</div>
            <div className="social-stat-label">Posts</div>
          </div>
        </div>
      </div>

      {/* User URLs & Assets */}
      <div className="about-card media-assets">
        <h3 className="section-header">
          <div className="section-icon cyan">
            <Link size={20} className="text-cyan-400" />
          </div>
          Media Assets
        </h3>
        <div className="space-y-4">
          {/* Profile Picture URL */}
          <div className="media-asset">
            <div className="media-asset-header">
              <div className="section-icon indigo">
                <User size={16} className="text-indigo-400" />
              </div>
              <span className="media-asset-title">Profile Picture</span>
            </div>
            {userData.profilepic ? (
              <div className="media-asset-content">
                <img 
                  src={userData.profilepic} 
                  alt="Profile" 
                  className="media-asset-image profile"
                />
                <div className="media-asset-link-container">
                  <a 
                    href={userData.profilepic} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="media-asset-link indigo"
                  >
                    {userData.profilepic}
                  </a>
                </div>
              </div>
            ) : (
              <span className="media-asset-empty">No profile picture set</span>
            )}
          </div>

          {/* Cover Photo URL */}
          <div className="media-asset">
            <div className="media-asset-header">
              <div className="section-icon purple">
                <Image size={16} className="text-purple-400" />
              </div>
              <span className="media-asset-title">Cover Photo</span>
            </div>
            {userData.board?.coverPhoto ? (
              <div className="media-asset-content">
                <img 
                  src={userData.board.coverPhoto} 
                  alt="Cover" 
                  className="media-asset-image cover"
                />
                <div className="media-asset-link-container">
                  <a 
                    href={userData.board.coverPhoto} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="media-asset-link purple"
                  >
                    {userData.board.coverPhoto}
                  </a>
                </div>
              </div>
            ) : (
              <span className="media-asset-empty">No cover photo set</span>
            )}
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {userData.board?.bio && (
        <div className="about-card bio">
          <h3 className="section-header">
            <div className="section-icon amber">
              <Heart size={20} className="text-amber-400" />
            </div>
            About Me
          </h3>
          <div className="bio-content">
            <p className="bio-text">{userData.board.bio}</p>
          </div>
        </div>
      )}

      {/* Interests */}
      {userData.board?.interests && userData.board.interests.length > 0 && (
        <div className="about-card interests">
          <h3 className="section-header">
            <div className="section-icon emerald">
              <Heart size={20} className="text-emerald-400" />
            </div>
            Interests & Passions
          </h3>
          <div className="interests-container">
            {userData.board.interests.map((interest, index) => (
              <span
                key={index}
                className="interest-tag"
              >
                #{interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutSection;