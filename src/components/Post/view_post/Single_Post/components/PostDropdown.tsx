// components/Single_Post/components/PostDropdown.tsx
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import useAuthStore from "@/store/useAuthStore";
import { usePostMutations } from "@/hooks/usePostMutations";
import { 
  PostDropdownProps, 
  type DropdownMenuItem as DropdownMenuItemType, 
  DropdownAction,
  CopyStatus 
} from "@/types/dropdownTypes";
import { AuthUser } from "@/types/authTypes";
import "../style/PostDropdown.css";

// Custom hook for dropdown logic - FIXED VERSION
const useDropdownState = (show: boolean, setShow: (show: boolean) => void) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if dropdown exists and click is outside dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        // IMPORTANT: Also check if the click is on the dropdown trigger button
        // We need to exclude the trigger button from "outside" clicks
        const triggerButton = document.querySelector('.dropdown-trigger');
        
        // If the click is on the trigger button or its children, don't close
        if (triggerButton && (triggerButton === target || triggerButton.contains(target))) {
          return; // Don't close - let the toggle handler handle it
        }
        
        setShow(false);
      }
    };

    if (show) {
      // Use capture phase to ensure we get the event before other handlers
      document.addEventListener("mousedown", handleClickOutside, true);
      return () => document.removeEventListener("mousedown", handleClickOutside, true);
    }
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
      return () => document.removeEventListener("keydown", handleEscapeKey);
    }
  }, [show, setShow]);

  return { dropdownRef };
};

// Custom hook for copy functionality
const useCopyLink = (postId: string, onComplete?: () => void) => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  const copyLink = useCallback(async () => {
    if (copyStatus !== "idle") return;

    setCopyStatus("copying");
    try {
      const postUrl = `${window.location.origin}/p/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      setCopyStatus("copied");
      
      setTimeout(() => {
        setCopyStatus("idle");
        onComplete?.();
      }, 1500);
    } catch (error) {
      console.error("Failed to copy link:", error);
      setCopyStatus("idle");
      onComplete?.();
    }
  }, [postId, copyStatus, onComplete]);

  return { copyStatus, copyLink };
};

// Menu item component
const DropdownMenuItemComponent: React.FC<{
  item: DropdownMenuItemType;
  onClick: (action: DropdownAction) => void;
}> = ({ item, onClick }) => (
  <button
    className={`post-dropdown-item ${item.variant === "danger" ? "danger" : ""}`}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(item.action);
    }}
    type="button"
    disabled={item.disabled}
    role="menuitem"
    aria-label={item.label}
  >
    {item.icon}
    {item.label}
  </button>
);

// Main component
export default function PostDropdown({
  show,
  setShow,
  post,
  onDelete, // Optional parent callback
  onPin, // Optional parent callback
  onBookmark, // Optional parent callback
  pinPending,
  deletePending,
  bookmarkPending = false,
  onEdit,
  onBlock,
  onReport,
}: PostDropdownProps) {
  const { dropdownRef } = useDropdownState(show, setShow);
  const { copyStatus, copyLink } = useCopyLink(post._id, () => setShow(false));
  
  // Use the centralized mutations hook for standalone functionality
  const {
    togglePin,
    toggleBookmark,
    deletePost: deletePostMutation,
    isTogglingPin,
    isTogglingBookmark,
    isDeletingPost,
  } = usePostMutations();

  // Get current user with proper typing
  const currentUser = useAuthStore((state) => state.currentUser) as AuthUser | null;

  // Check if the current user is the post author
  const isOwnPost = useMemo(() => 
    currentUser && currentUser._id === post.user._id, 
    [currentUser, post.user._id]
  );

  // Use parent pending states if provided, otherwise use mutation states
  const actualPinPending = pinPending ?? isTogglingPin;
  const actualBookmarkPending = bookmarkPending ?? isTogglingBookmark;
  const actualDeletePending = deletePending ?? isDeletingPost;

  // Generate menu items based on post ownership
  const menuItems = useMemo((): DropdownMenuItemType[] => {
    const commonItems: DropdownMenuItemType[] = [
      {
        id: "copy-link",
        label: copyStatus === "copying" ? "Copying..." : copyStatus === "copied" ? "Copied!" : "Copy Link",
        icon: (
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
        ),
        action: "Copy Link",
        disabled: copyStatus !== "idle",
        dividerAfter: true,
      },
    ];

    // Add bookmark for non-own posts only
    if (!isOwnPost) {
      commonItems.unshift({
        id: "bookmark",
        label: actualBookmarkPending
          ? (post.isBookmarked ? "Removing..." : "Saving...")
          : (post.isBookmarked ? "Saved!" : "Save"),
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill={post.isBookmarked ? "currentColor" : "none"}>
            <path
              d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        action: post.isBookmarked ? "Remove Bookmark" : "Bookmark",
        disabled: actualBookmarkPending,
      });
    }

    if (isOwnPost) {
      return [
        {
          id: "edit",
          label: "Edit",
          icon: (
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
          ),
          action: "Edit",
        },
        {
          id: "pin",
          label: actualPinPending
            ? (post.isPinned ? "Unpinning..." : "Pinning...")
            : (post.isPinned ? "Unpin" : "Pin"),
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 12V4a1 1 0 00-1-1h-1V2a1 1 0 00-2 0v1h-2V2a1 1 0 00-2 0v1H7a1 1 0 00-1 1v8l-2 2v1h5v4l2 2v-6h2v6l2-2v-4h5v-1l-2-2z"
                fill="currentColor"
              />
            </svg>
          ),
          action: post.isPinned ? "Unpin" : "Pin",
          disabled: actualPinPending,
          dividerAfter: true,
        },
        ...commonItems,
        {
          id: "delete",
          label: actualDeletePending ? "Deleting..." : "Delete",
          icon: (
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
          ),
          action: "Delete",
          variant: "danger",
          disabled: actualDeletePending,
        },
      ];
    } else {
      return [
        ...commonItems,
        {
          id: "block",
          label: "Block",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M4.93 4.93l14.14 14.14" stroke="currentColor" strokeWidth="2" />
            </svg>
          ),
          action: "Block",
        },
        {
          id: "report",
          label: "Report",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          ),
          action: "Report",
          variant: "danger",
        },
      ];
    }
  }, [
    isOwnPost,
    post.isBookmarked,
    post.isPinned,
    post.user.userName,
    actualBookmarkPending,
    actualPinPending,
    actualDeletePending,
    copyStatus,
  ]);

  const handleAction = useCallback(async (action: DropdownAction) => {
    console.log(`🎯 Dropdown action: ${action}`);
    
    try {
      switch (action) {
        case "Edit":
          onEdit?.();
          setShow(false);
          break;
        case "Pin":
        case "Unpin":
          console.log(`📌 ${action} post:`, post._id);
          // Use parent callback if provided, otherwise use standalone mutation
          if (onPin) {
            await onPin();
          } else {
            togglePin(post._id);
          }
          setShow(false);
          break;
        case "Bookmark":
        case "Remove Bookmark":
          console.log(`🔖 ${action} post:`, post._id);
          // Use parent callback if provided, otherwise use standalone mutation
          if (onBookmark) {
            await onBookmark();
          } else {
            toggleBookmark(post._id);
          }
          setShow(false);
          break;
        case "Copy Link":
          await copyLink();
          break;
        case "Delete":
          console.log(`🗑️ Delete post:`, post._id);
          // Use parent callback if provided, otherwise use standalone mutation
          if (onDelete) {
            onDelete();
          } else {
            deletePostMutation(post._id);
          }
          setShow(false);
          break;
        case "Block":
          console.log(`🚫 Block user:`, post.user._id);
          onBlock?.(post.user._id);
          setShow(false);
          break;
        case "Report":
          console.log(`⚠️ Report post:`, post._id);
          onReport?.(post._id);
          setShow(false);
          break;
        default:
          console.log(`${action} action not implemented`);
          setShow(false);
      }
    } catch (error) {
      console.error(`Failed to execute ${action}:`, error);
      setShow(false);
    }
  }, [
    post._id, 
    post.user._id, 
    onEdit, 
    onPin, 
    onBookmark, 
    onDelete, 
    onBlock, 
    onReport, 
    copyLink, 
    setShow,
    togglePin,
    toggleBookmark,
    deletePostMutation
  ]);

  if (!show) return null;

  return (
    <div className="post-dropdown-container" ref={dropdownRef}>
      <div 
        className="post-dropdown-menu"
        role="menu"
        aria-label="Post actions menu"
        aria-orientation="vertical"
      >
        {menuItems.map((item, index) => (
          <div key={item.id}>
            <DropdownMenuItemComponent item={item} onClick={handleAction} />
            {item.dividerAfter && index < menuItems.length - 1 && (
              <div className="post-dropdown-divider" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}