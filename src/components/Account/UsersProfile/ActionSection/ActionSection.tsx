// ActionSection.tsx
import React from 'react';
import { MessageCircle, Grid3X3, Info, Bookmark, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ActionSection.css';

interface ActionButtonsProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  userName: string;
  onFollowToggle: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isOwnProfile,
  isFollowing,
  userName,
  onFollowToggle
}) => {
  const navigate = useNavigate();

  const handleMessage = () => {
    navigate(`/message/@${userName}`);
  };

  if (isOwnProfile) {
    return (
      <div className="action-buttons-container">
        <button className="btn-base btn-edit-profile">
          Edit Profile
        </button>
      </div>
    );
  }

  return (
    <div className="action-buttons-container">
      <div className="action-buttons-row">
        <button
          onClick={onFollowToggle}
          className={`btn-base ${
            isFollowing ? 'btn-following' : 'btn-follow'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        
        <button
          onClick={handleMessage}
          className="btn-base btn-message"
        >
          <MessageCircle size={18} />
          Message
        </button>
      </div>
    </div>
  );
};

interface ContentTabsProps {
  activeTab: string;
  userName: string;
  onTabChange: (tab: string) => void;
}

const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, userName, onTabChange }) => {
  const navigate = useNavigate();
  const tabs = [
    { id: 'posts', label: 'Posts', icon: Grid3X3, path: `/${userName}` },
    { id: 'about', label: 'About', icon: Info, path: `/${userName}/about` },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, path: `/${userName}/bookmarks` },
    { id: 'media', label: 'Media', icon: Camera, path: `/${userName}/media` }
  ];

  const handleTabClick = (tab: { id: string; path: string }) => {
    // Navigate to the tab's specific path
    navigate(tab.path, { replace: false });
    
    // Update the active tab state
    onTabChange(tab.id);
  };

  return (
    <div className="content-tabs">
      <div className="tabs-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              data-active={isActive}
              className={`tab-btn ${
                isActive ? 'tab-btn-active' : 'tab-btn-inactive'
              }`}
            >
              <Icon size={18} />
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface ActionSectionProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  activeTab: string;
  userName: string;
  onFollowToggle: () => void;
  onTabChange: (tab: string) => void;
}

const ActionSection: React.FC<ActionSectionProps> = ({
  isOwnProfile,
  isFollowing,
  activeTab,
  userName,
  onFollowToggle,
  onTabChange
}) => {
  return (
    <>
      <ActionButtons
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        userName={userName}
        onFollowToggle={onFollowToggle}
      />
      
      <ContentTabs
        activeTab={activeTab}
        userName={userName}
        onTabChange={onTabChange}
      />
    </>
  );
};

export default ActionSection;