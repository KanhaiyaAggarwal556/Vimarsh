// ProfileHeader.tsx
import React, { useState, useRef } from "react";
import {
  Camera,
  Edit3,
  Plus,
  MoreHorizontal,
  Share,
  Copy,
  Shield,
  Flag,
  ArrowLeft,
} from "lucide-react";
import { UserData } from "../types";
import UserAvatar from "@/components/Post/view_post/Single_Post/UI/UserAvatar";
import "./ProfileHeader.css";

interface OptionsMenuProps {
  isOwnProfile: boolean;
  userId?: string;
  userName?: string;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  isOwnProfile,
  userId,
  userName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Functional menu actions
  const copyProfileLink = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${userId}`;
      await navigator.clipboard.writeText(profileUrl);
      console.log("Profile link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy profile link:", err);
    }
  };

  const shareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${userId}`;
    const shareData = {
      title: `${userName}'s Profile`,
      text: `Check out ${userName}'s profile`,
      url: profileUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(profileUrl);
        console.log("Profile link copied to clipboard (share fallback)");
      }
    } catch (err) {
      console.error("Failed to share profile:", err);
    }
  };

  const blockUser = () => {
    const confirmBlock = window.confirm(
      `Are you sure you want to block ${userName}?`
    );
    if (confirmBlock) {
      console.log(`Blocking user: ${userId}`);
      // Add your block user API call here
    }
  };

  const reportUser = () => {
    const reportReason = window.prompt(`Why are you reporting ${userName}?`);
    if (reportReason && reportReason.trim()) {
      console.log(`Reporting user: ${userId}, Reason: ${reportReason}`);
      // Add your report user API call here
    }
  };

  const menuItems = isOwnProfile
    ? [
        {
          icon: Copy,
          label: "Copy Profile Link",
          action: copyProfileLink,
          isDangerous: false,
        },
        {
          icon: Share,
          label: "Share Profile",
          action: shareProfile,
          isDangerous: false,
        },
      ]
    : [
        {
          icon: Copy,
          label: "Copy Profile Link",
          action: copyProfileLink,
          isDangerous: false,
        },
        {
          icon: Share,
          label: "Share Profile",
          action: shareProfile,
          isDangerous: false,
        },
        {
          icon: Shield,
          label: "Block User",
          action: blockUser,
          isDangerous: true,
        },
        {
          icon: Flag,
          label: "Report User",
          action: reportUser,
          isDangerous: true,
        },
      ];

  return (
    <div className="options-menu">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="options-menu-button"
      >
        <MoreHorizontal size={20} />
      </button>

      {isOpen && (
        <>
          <div
            className="options-menu-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="options-menu-dropdown">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className={`options-menu-item ${
                    item.isDangerous ? "dangerous" : ""
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

interface BackButtonProps {
  onBackClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onBackClick }) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // Default back navigation
      window.history.back();
    }
  };

  return (
    <div className="back-button-position">
      <button
        onClick={handleBackClick}
        className="back-button"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>
    </div>
  );
};

interface CoverPhotoProps {
  coverPhoto?: string;
  isOwnProfile: boolean;
  onCoverUpdate: (url: string) => void;
  userData: UserData;
  onBackClick?: () => void;
}

const CoverPhoto: React.FC<CoverPhotoProps> = ({
  coverPhoto,
  isOwnProfile,
  onCoverUpdate,
  userData,
  onBackClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onCoverUpdate(imageUrl);
      setImageError(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="cover-photo-container">
      <BackButton onBackClick={onBackClick} />

      <div
        className={`cover-photo ${isHovered ? "hovered" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCoverClick}
      >
        {coverPhoto && !imageError ? (
          <img
            src={coverPhoto}
            alt="Cover"
            className="cover-photo-image"
            onError={handleImageError}
          />
        ) : (
          <div className="cover-photo-default">
            <div className="cover-photo-pattern"></div>
            <div className="cover-photo-grid"></div>
            <div className="cover-photo-camera">
              <div className="camera-container">
                <Camera size={48} />
              </div>
            </div>
            <div className="cover-photo-fade"></div>
          </div>
        )}

        {isOwnProfile && isHovered && (
          <div className="cover-photo-overlay">
            <div className="edit-button">
              <Edit3 size={20} />
            </div>
          </div>
        )}

        {isOwnProfile && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        )}
      </div>

      <div className="options-menu-position">
        <OptionsMenu
          isOwnProfile={isOwnProfile}
          userId={userData?._id}
          userName={userData?.fullName}
        />
      </div>
    </div>
  );
};

interface ProfilePictureProps {
  userdata?: UserData;
  isOwnProfile: boolean;
  onProfileUpdate: (url: string) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  userdata,
  isOwnProfile,
  onProfileUpdate,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onProfileUpdate(imageUrl);
    }
  };

  return (
    <div
      className={`profile-picture ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProfileClick}
    >
      <UserAvatar
        user={{
          avatar: userdata?.profilepic,
          name: userdata?.fullName,
          id: userdata?._id,
        }}
        size={150}
      />

      {isOwnProfile && isHovered && (
        <div className="profile-picture-edit">
          <Plus size={16} />
        </div>
      )}

      {isOwnProfile && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
      )}
    </div>
  );
};

interface ProfileHeaderProps {
  userData: UserData;
  isOwnProfile: boolean;
  onCoverUpdate: (url: string) => void;
  onProfileUpdate: (url: string) => void;
  onBackClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userData,
  isOwnProfile,
  onCoverUpdate,
  onProfileUpdate,
  onBackClick,
}) => {
  return (
    <>
      <CoverPhoto
        coverPhoto={userData?.board?.coverPhoto}
        isOwnProfile={isOwnProfile}
        onCoverUpdate={onCoverUpdate}
        userData={userData}
        onBackClick={onBackClick}
      />

      <ProfilePicture
        userdata={userData}
        isOwnProfile={isOwnProfile}
        onProfileUpdate={onProfileUpdate}
      />
    </>
  );
};

export default ProfileHeader;
