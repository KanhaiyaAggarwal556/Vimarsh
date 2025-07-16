import React, { useContext, useState } from "react";
import "./UsersProfile.css";
import { UserList as UserListData } from "@store/user-list-store";
import HomeSection from "../../Post/view_post/Posts/Sections/HomeSection";
import UserAvatar from "../../Post/view_post/Single_Post/UI/UserAvatar";

export default function UsersProfile() {
  const { userList, fetching, getUserById } = useContext(UserListData);
  const pathSegments = window.location.pathname
    .split("/")
    .filter((segment) => segment !== "");
  const manualId = pathSegments[0];
  const user = getUserById(manualId);
  const [activeTab, setActiveTab] = useState("posts");
  
  // Follow functionality state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(user?.socialStats?.followers || 0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  
  // Mock current user ID (in real app, this would come from auth context)
  const currentUserId = "current-user-123";
  const isOwnProfile = user?.userId === currentUserId;

  // Add safety check
  if (!user) {
    return (
      <div className="user-profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Follow/Unfollow handler
  const handleFollowToggle = async () => {
    setIsFollowLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isFollowing) {
        // Unfollow logic
        setFollowerCount(prev => prev - 1);
        setIsFollowing(false);
        // Here you would make API call to unfollow user
        console.log(`Unfollowed user: ${user.userId}`);
      } else {
        // Follow logic
        setFollowerCount(prev => prev + 1);
        setIsFollowing(true);
        // Here you would make API call to follow user
        console.log(`Followed user: ${user.userId}`);
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const totalLikes = user.posts.reduce(
    (sum, post) => sum + post.reactions.likes,
    0
  );
  const totalViews = user.posts.reduce((sum, post) => sum + post.views, 0);
  const totalShares = user.posts.reduce(
    (sum, post) => sum + post.reactions.shares,
    0
  );
  const totalSaves = user.posts.reduce(
    (sum, post) => sum + post.reactions.saves,
    0
  );

  // Format join date
  const joinDate = new Date(user.joinDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format last seen
  const lastSeen = new Date(user.lastSeen).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="user-profile-container">
      <div className="user-profile-content">
        {/* User Profile Header */}
        <div className="profile-header">
          <div
            className="profile-cover"
            style={{ backgroundImage: `url(${user.coverPhoto})` }}
          >
            <div className="profile-avatar-container">
              <UserAvatar
                user={{
                  avatar: user.UsersProfilePic,
                  username: user.username,
                  id: user.userId,
                }}
                size={120}
              />
              {user.isVerified && <div className="verified-badge">✓</div>}
              <div
                className={`online-status ${
                  user.isOnline ? "online" : "offline"
                }`}
              ></div>
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-main-info">
              <h1 className="profile-name">
                {user.displayName}
                {user.isVerified && <span className="verified-icon">✓</span>}
              </h1>
              <p className="profile-username">@{user.username}</p>
              {user.bio && <p className="profile-bio">{user.bio}</p>}

              <div className="profile-details">
                {user.location && (
                  <span className="profile-detail">
                    <span className="detail-icon">📍</span>
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <span className="profile-detail">
                    <span className="detail-icon">🔗</span>
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.website}
                    </a>
                  </span>
                )}
                <span className="profile-detail">
                  <span className="detail-icon">📅</span>
                  Joined {joinDate}
                </span>
              </div>

              {/* Follow Button Section */}
              {!isOwnProfile && (
                <div className="follow-section">
                  <button
                    className={`follow-btn ${isFollowing ? 'following' : 'follow'}`}
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                  >
                    {isFollowLoading ? (
                      <div className="follow-loading">
                        <div className="follow-spinner"></div>
                        <span>{isFollowing ? 'Unfollowing...' : 'Following...'}</span>
                      </div>
                    ) : (
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">
                  {followerCount}
                </span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {user.socialStats.following}
                </span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.socialStats.posts}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{totalLikes}</span>
                <span className="stat-label">Total Likes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-nav">
          <button
            className={`nav-tab ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button
            className={`nav-tab ${activeTab === "followers" ? "active" : ""}`}
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
          <button
            className={`nav-tab ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`nav-tab ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </button>
          <button
            className={`nav-tab ${activeTab === "interests" ? "active" : ""}`}
            onClick={() => setActiveTab("interests")}
          >
            Interests
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "posts" && (
            <div className="posts-section">
              <HomeSection
                isActive={true}
                fetching={fetching}
                postList={user.posts}
              />
            </div>
          )}

          {activeTab === "followers" && (
            <div className="followers-section">
              <div className="followers-header">
                <h3>Followers ({followerCount})</h3>
                <div className="followers-actions">
                  <button className="sort-btn">
                    <span>Sort by</span>
                    <span className="sort-icon">↕️</span>
                  </button>
                </div>
              </div>
              
              <div className="followers-list">
                {/* Mock followers data - in real app, this would come from API */}
                {Array.from({ length: Math.min(followerCount, 10) }, (_, index) => (
                  <div key={index} className="follower-item">
                    <div className="follower-avatar">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`} 
                        alt="follower avatar"
                        className="follower-img"
                      />
                      <div className="follower-status online"></div>
                    </div>
                    <div className="follower-info">
                      <h4 className="follower-name">Follower {index + 1}</h4>
                      <p className="follower-username">@follower{index + 1}</p>
                      <p className="follower-bio">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      <div className="follower-stats">
                        <span className="follower-stat">{Math.floor(Math.random() * 1000)} followers</span>
                        <span className="follower-stat">{Math.floor(Math.random() * 100)} posts</span>
                      </div>
                    </div>
                    <div className="follower-actions">
                      <button className="follow-back-btn">Follow Back</button>
                      <button className="remove-follower-btn">Remove</button>
                    </div>
                  </div>
                ))}
                
                {followerCount === 0 && (
                  <div className="no-followers">
                    <div className="no-followers-icon">👥</div>
                    <h4>No followers yet</h4>
                    <p>When people follow this profile, they'll appear here.</p>
                  </div>
                )}
                
                {followerCount > 10 && (
                  <div className="load-more">
                    <button className="load-more-btn">Load More Followers</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="about-section">
              <div className="about-card">
                <h3>Contact Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Display Name</span>
                    <span className="info-value">{user.displayName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Username</span>
                    <span className="info-value">@{user.username}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">
                      {user.profilePrivacy.contactVisible
                        ? user.email
                        : "Private"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">
                      {user.profilePrivacy.contactVisible
                        ? user.contactNumber
                        : "Private"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">User ID</span>
                    <span className="info-value">{user.userId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Verified</span>
                    <span className="info-value">
                      {user.isVerified ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="about-card">
                <h3>Profile Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">
                      {user.location || "Not specified"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Website</span>
                    <span className="info-value">
                      {user.website ? (
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {user.website}
                        </a>
                      ) : (
                        "Not specified"
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Joined</span>
                    <span className="info-value">{joinDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Seen</span>
                    <span className="info-value">{lastSeen}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Online Status</span>
                    <span className="info-value">
                      <span
                        className={`status-indicator ${
                          user.isOnline ? "online" : "offline"
                        }`}
                      >
                        {user.isOnline ? "Online" : "Offline"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="about-card">
                <h3>Content Statistics</h3>
                <div className="content-stats">
                  <div className="content-stat">
                    <span className="stat-icon">📝</span>
                    <div>
                      <span className="stat-title">Posts Created</span>
                      <span className="stat-desc">
                        {user.socialStats.posts} total posts
                      </span>
                    </div>
                  </div>
                  <div className="content-stat">
                    <span className="stat-icon">👍</span>
                    <div>
                      <span className="stat-title">Likes Received</span>
                      <span className="stat-desc">
                        {totalLikes} total likes
                      </span>
                    </div>
                  </div>
                  <div className="content-stat">
                    <span className="stat-icon">👁️</span>
                    <div>
                      <span className="stat-title">Views Generated</span>
                      <span className="stat-desc">
                        {totalViews} total views
                      </span>
                    </div>
                  </div>
                  <div className="content-stat">
                    <span className="stat-icon">📤</span>
                    <div>
                      <span className="stat-title">Shares Received</span>
                      <span className="stat-desc">
                        {totalShares} total shares
                      </span>
                    </div>
                  </div>
                  <div className="content-stat">
                    <span className="stat-icon">🔖</span>
                    <div>
                      <span className="stat-title">Saves Received</span>
                      <span className="stat-desc">
                        {totalSaves} total saves
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-card">
                <h3>Privacy Settings</h3>
                <div className="privacy-settings">
                  <div className="privacy-item">
                    <span className="privacy-label">Profile Visibility</span>
                    <span className="privacy-value">
                      {user.profilePrivacy.profileVisibility}
                    </span>
                  </div>
                  <div className="privacy-item">
                    <span className="privacy-label">Contact Information</span>
                    <span className="privacy-value">
                      {user.profilePrivacy.contactVisible
                        ? "Visible"
                        : "Hidden"}
                    </span>
                  </div>
                  <div className="privacy-item">
                    <span className="privacy-label">Posts Visibility</span>
                    <span className="privacy-value">
                      {user.profilePrivacy.postsVisible}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="activity-section">
              <div className="activity-card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {user.posts.map((post) => (
                    <div key={post.id} className="activity-item">
                      <div className="activity-icon">📝</div>
                      <div className="activity-content">
                        <span className="activity-title">
                          Posted "{post.title}"
                        </span>
                        <span className="activity-time">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </span>
                        {post.location && (
                          <span className="activity-location">
                            📍 {post.location}
                          </span>
                        )}
                      </div>
                      <div className="activity-stats">
                        <span className="activity-stat">
                          {post.reactions.likes} likes
                        </span>
                        <span className="activity-stat">
                          {post.views} views
                        </span>
                        <span className="activity-stat">
                          {post.reactions.shares} shares
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="activity-card">
                <h3>Popular Tags</h3>
                <div className="tag-cloud">
                  {Array.from(
                    new Set(user.posts.flatMap((post) => post.tags))
                  ).map((tag, index) => (
                    <span key={index} className="tag-item">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="activity-card">
                <h3>Social Engagement</h3>
                <div className="engagement-stats">
                  <div className="engagement-item">
                    <span className="engagement-label">Followers</span>
                    <span className="engagement-value">
                      {followerCount}
                    </span>
                  </div>
                  <div className="engagement-item">
                    <span className="engagement-label">Following</span>
                    <span className="engagement-value">
                      {user.socialStats.following}
                    </span>
                  </div>
                  <div className="engagement-item">
                    <span className="engagement-label">Engagement Rate</span>
                    <span className="engagement-value">
                      {totalViews > 0
                        ? ((totalLikes / totalViews) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "interests" && (
            <div className="interests-section">
              <div className="about-card">
                <h3>Interests & Hobbies</h3>
                <div className="interests-grid">
                  {user.interests.map((interest, index) => (
                    <div key={index} className="interest-item">
                      <span className="interest-name">{interest}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="about-card">
                <h3>Theme Preferences</h3>
                <div className="theme-info">
                  <div className="theme-item">
                    <span className="theme-label">Theme</span>
                    <span className="theme-value">
                      {user.customization.theme}
                    </span>
                  </div>
                  <div className="theme-item">
                    <span className="theme-label">Accent Color</span>
                    <span className="theme-value">
                      <span
                        className="color-preview"
                        style={{
                          backgroundColor: user.customization.accentColor,
                        }}
                      ></span>
                      {user.customization.accentColor}
                    </span>
                  </div>
                  <div className="theme-item">
                    <span className="theme-label">Background Type</span>
                    <span className="theme-value">
                      {user.customization.backgroundType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="about-card">
                <h3>Content Preferences</h3>
                <div className="content-preferences">
                  <div className="preference-item">
                    <span className="preference-label">Most Used Tags</span>
                    <div className="preference-tags">
                      {Array.from(
                        new Set(user.posts.flatMap((post) => post.tags))
                      )
                        .slice(0, 5)
                        .map((tag, index) => (
                          <span key={index} className="preference-tag">
                            #{tag}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="preference-item">
                    <span className="preference-label">
                      Average Post Length
                    </span>
                    <span className="preference-value">
                      {user.posts.length > 0
                        ? Math.round(
                            user.posts.reduce(
                              (sum, post) => sum + post.body.length,
                              0
                            ) / user.posts.length
                          )
                        : 0}{" "}
                      characters
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}