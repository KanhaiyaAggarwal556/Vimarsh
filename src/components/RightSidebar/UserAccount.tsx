// UserAccount.tsx - Desktop-only component
import React, { useState, useEffect, useRef } from "react";
import { User, LogIn, UserPlus, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../Post/view_post/Single_Post/UI/UserAvatar";
import useAuthStore from "@store/useAuthStore";
import "./styles/UserAccount.css"; // Import your styles

interface UserData {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  profilepic?: string;
}

interface UserAccountProps {
  onUserChange?: (user: UserData | null) => void;
  className?: string;
}

const UserAccount: React.FC<UserAccountProps> = ({
  onUserChange,
  className = "",
}) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Get user from Zustand store
  const { currentUser, removeAllUser, setCurrentUser } = useAuthStore();
  const user = currentUser as UserData | null;

  // Fetch current user on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Call onUserChange callback when user state changes
  useEffect(() => {
    if (onUserChange) {
      onUserChange(user);
    }
  }, [user, onUserChange]);

  // Handle clicking outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/auth/me`
, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCurrentUser(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserMenuOpen(false);
    navigate("/i/account/login");
  };

  const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserMenuOpen(false);
    navigate("/i/account/signup");
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      console.log("Starting logout process...");

      // Call backend logout endpoint to clear server-side tokens/cookies
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/auth/logout`
, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Server logout successful");
      } else {
        console.warn(
          "Server logout failed, but continuing with client cleanup"
        );
      }

      // Clear user from Zustand store (client-side cleanup)
      removeAllUser();

      // Clear any localStorage/sessionStorage if you're using them
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.clear();

      setIsUserMenuOpen(false);
      navigate("/i/account/login");

      console.log("Logout complete - user cleared from all storage");
    } catch (error) {
      console.error("Error during logout:", error);

      // Even if server request fails, clear client-side data
      removeAllUser();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.clear();

      setIsUserMenuOpen(false);
      navigate("/i/account/login");

      console.log("Logout completed with errors - client data cleared");
    }
  };

  const handleUserProfile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      setIsUserMenuOpen(false);
      navigate(`/${user.userName}`);
    }
  };

  const handleSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserMenuOpen(false);
    navigate("/settings");
  };

  const handleMenuToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Don't render anything while loading
  if (isLoading) {
    return (
      <div className={`user-account-loading ${className}`}>
        <div className="user-menu">
          <button
            type="button"
            disabled
            style={{
              opacity: 0.5,
              cursor: "not-allowed",
            }}
          >
            <User size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`user-account ${className}`} ref={userMenuRef}>
      <div className="user-menu">
        <button
          onClick={handleMenuToggle}
          type="button"
          aria-label="User menu"
          className={`user-menu-button ${user ? "logged-in" : "not-logged-in"}`}
        >
          {user ? (
            <UserAvatar
              user={{
                avatar: user.profilepic || "",
                name: user.fullName,
                username: user.userName,
                id: user._id,
              }}
              size={40}
            />
          ) : (
            <User size={24} />
          )}
        </button>

        {isUserMenuOpen && (
          <div className="user-dropdown">
            {user ? (
              <>
                <button
                  onClick={handleUserProfile}
                  className="menu-item user-profile-item"
                  type="button"
                >
                  <span className="username">@{user.userName}</span>
                </button>

                <button
                  onClick={handleSettings}
                  className="menu-item"
                  type="button"
                >
                  <Settings size={16} />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="menu-item"
                  type="button"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="menu-item"
                  type="button"
                >
                  <LogIn size={16} />
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="menu-item"
                  type="button"
                >
                  <UserPlus size={16} />
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;
