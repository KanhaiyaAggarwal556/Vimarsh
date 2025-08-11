// FollowersModal.tsx
import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";

interface FollowerUser {
  _id: string;
  fullName: string;
  userName: string;
  profilepic?: string;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialTab: "followers" | "following";
  followersCount: number;
  followingCount: number;
}

const FollowersModal: React.FC<FollowersModalProps> = ({
  isOpen,
  onClose,
  userId,
  initialTab,
  followersCount,
  followingCount,
}) => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    initialTab
  );
  const [followers, setFollowers] = useState<FollowerUser[]>([]);
  const [following, setFollowing] = useState<FollowerUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      loadData(initialTab);
    }
  }, [isOpen, initialTab, userId]);

  const loadData = async (tab: "followers" | "following") => {
    setLoading(true);
    try {
      // Mock data for demonstration - replace with actual API calls
      const mockUsers: FollowerUser[] = Array.from(
        { length: tab === "followers" ? followersCount : followingCount },
        (_, i) => ({
          _id: `user-${i}`,
          fullName: `User ${i + 1}`,
          userName: `user${i + 1}`,
          profilepic: undefined,
        })
      );

      if (tab === "followers") {
        setFollowers(mockUsers);
      } else {
        setFollowing(mockUsers);
      }
    } catch (error) {
      console.error(`Error loading ${tab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: "followers" | "following") => {
    setActiveTab(tab);
    if (
      (tab === "followers" && followers.length === 0) ||
      (tab === "following" && following.length === 0)
    ) {
      loadData(tab);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleUserClick = (user: FollowerUser) => {
    // Navigate to user profile
    console.log("Navigate to user:", user.userName);
    // You can implement navigation logic here
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  const currentUsers = activeTab === "followers" ? followers : following;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-tabs">
            <div
              className={`modal-tab ${
                activeTab === "followers" ? "active" : ""
              }`}
              onClick={() => handleTabChange("followers")}
            >
              Followers ({followersCount})
            </div>
            <div
              className={`modal-tab ${
                activeTab === "following" ? "active" : ""
              }`}
              onClick={() => handleTabChange("following")}
            >
              Following ({followingCount})
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="empty-state">
              <div>Loading...</div>
            </div>
          ) : currentUsers.length === 0 ? (
            <div className="empty-state">
              <div>No {activeTab} yet</div>
            </div>
          ) : (
            currentUsers.map((user) => (
              <div
                key={user._id}
                className="user-list-item"
                onClick={() => handleUserClick(user)}
              >
                <div className="user-avatar">
                  {user.profilepic ? (
                    <img
                      src={user.profilepic}
                      alt={user.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(user.fullName)}</span>
                  )}
                </div>
                <div className="user-info-modal">
                  <div className="user-name-modal">{user.fullName}</div>
                  <div className="user-handle-modal">@{user.userName}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
