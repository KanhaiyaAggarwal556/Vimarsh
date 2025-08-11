import { useRef, useEffect, useState } from "react";
import useAuthStore from "@store/useAuthStore";
import "../style/PostDropdown.css";

interface PostUser {
  _id: string;
  userName: string;
  isFollowing?: boolean;
}

interface PostData {
  _id: string;
  user: PostUser;
  isPinned: boolean;
}

interface PostDropdownProps {
  show: boolean;
  setShow: (show: boolean) => void;
  post: PostData;
  onDelete: () => void;
  onPin: () => void;
  onFollow: () => void;
  pinPending: boolean;
  deletePending: boolean;
  followPending?: boolean;
}

export default function PostDropdown({
  show,
  setShow,
  post,
  onDelete,
  onPin,
  onFollow,
  pinPending,
  deletePending,
  followPending = false,
}: PostDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied">(
    "idle"
  );

  // Get current user from auth store
  const currentUser = useAuthStore((state) => state.currentUser);

  // Check if the current user is the post author
  const isOwnPost = currentUser && currentUser._id === post.user._id;

  // Reset copy status when dropdown closes
  useEffect(() => {
    if (!show) {
      setCopyStatus("idle");
    }
  }, [show]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, setShow]);

  // Close on Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [show, setShow]);

  const handleMenuItemClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    action: string
  ): void => {
    e.preventDefault();
    e.stopPropagation();

    if (action === "Delete") {
      onDelete();
    } else if (action === "Pin" || action === "Unpin") {
      onPin();
    } else if (action === "Follow" || action === "Unfollow") {
      onFollow();
    } else if (action === "Copy Link") {
      setCopyStatus("copying");
      const postUrl = `/p/${post._id}`;
      navigator.clipboard
        .writeText(window.location.origin + postUrl)
        .then(() => {
          setCopyStatus("copied");
          setTimeout(() => {
            setCopyStatus("idle");
            setShow(false);
          }, 1500);
        })
        .catch((err) => {
          console.error("Failed to copy link:", err);
          setCopyStatus("idle");
          setShow(false);
        });
    } else {
      // Just log for showcase purposes
      console.log(`${action} clicked for post:`, post._id);
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <div className="post-dropdown-container" ref={dropdownRef}>
      <div className="post-dropdown-menu">
        {/* Own Post Actions */}
        {isOwnPost ? (
          <>
            <button
              className="post-dropdown-item"
              onClick={(e) => handleMenuItemClick(e, "Edit")}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </button>

            <button
              className="post-dropdown-item"
              onClick={(e) =>
                handleMenuItemClick(e, post.isPinned ? "Unpin" : "Pin")
              }
              type="button"
              disabled={pinPending}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 12V4a1 1 0 00-1-1h-1V2a1 1 0 00-2 0v1h-2V2a1 1 0 00-2 0v1H7a1 1 0 00-1 1v8l-2 2v1h5v4l2 2v-6h2v6l2-2v-4h5v-1l-2-2z"
                  fill="currentColor"
                />
              </svg>
              {pinPending
                ? post.isPinned
                  ? "Unpinning..."
                  : "Pinning..."
                : post.isPinned
                ? "Unpin"
                : "Pin"}
            </button>

            <div className="post-dropdown-divider" />

            <button
              className="post-dropdown-item"
              onClick={(e) => handleMenuItemClick(e, "Copy Link")}
              type="button"
              disabled={copyStatus !== "idle"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {copyStatus === "copying"
                ? "Copying..."
                : copyStatus === "copied"
                ? "Copied!"
                : "Copy Link"}
            </button>

            <div className="post-dropdown-divider" />

            <button
              className="post-dropdown-item danger"
              onClick={(e) => handleMenuItemClick(e, "Delete")}
              type="button"
              disabled={deletePending}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M10 11v6M14 11v6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {deletePending ? "Deleting..." : "Delete"}
            </button>
          </>
        ) : (
          /* Other User's Post Actions */
          <>
            <button
              className="post-dropdown-item"
              onClick={(e) =>
                handleMenuItemClick(
                  e,
                  post.user.isFollowing ? "Unfollow" : "Follow"
                )
              }
              type="button"
              disabled={followPending}
            >
              {followPending
                ? post.user.isFollowing
                  ? "Unfollowing..."
                  : "Following..."
                : post.user.isFollowing
                ? `Following @${post.user.userName}`
                : `Follow @${post.user.userName}`}
            </button>

            <div className="post-dropdown-divider" />

            <button
              className="post-dropdown-item"
              onClick={(e) => handleMenuItemClick(e, "Copy Link")}
              type="button"
              disabled={copyStatus !== "idle"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {copyStatus === "copying"
                ? "Copying..."
                : copyStatus === "copied"
                ? "Copied!"
                : "Copy Link"}
            </button>

            <button
              className="post-dropdown-item danger"
              onClick={(e) => handleMenuItemClick(e, "Block")}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M4.93 4.93l14.14 14.14"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Block @{post.user.userName}
            </button>

            <button
              className="post-dropdown-item danger"
              onClick={(e) => handleMenuItemClick(e, "Report")}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}
