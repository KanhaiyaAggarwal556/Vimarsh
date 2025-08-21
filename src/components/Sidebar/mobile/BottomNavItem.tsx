// components/mobile/BottomNavItem.tsx - Enhanced with double-tap home functionality
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SIDEBAR_CONFIG } from "@/config/navigationConfig";

interface BottomNavItemProps {
  to: string;
  icon: React.ReactElement;
  label: string;
  pathname: string;
  onClick?: () => void;
  onHomeTap?: () => void; // New prop for home double-tap functionality
  isCreatePost?: boolean;
  id?: string; // Add id to identify home button
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({ 
  to, 
  icon, 
  label, 
  pathname, 
  onClick,
  onHomeTap,
  isCreatePost = false,
  id
}) => {
  const location = useLocation();
  const isActive = pathname === to || (to.includes(':') && pathname.includes(to.split('/')[1]));

  const handleClick = (e: React.MouseEvent) => {
    // Check if this is the home button and we're already on home page
    if (id === 'home' && location.pathname === '/home' && onHomeTap) {
      e.preventDefault();
      onHomeTap();
      return;
    }
    
    // Regular onClick handler
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    // Otherwise let the Link handle navigation normally
  };

  // Special styling for Create Post button - but keep it simple like others
  if (isCreatePost) {
    return (
      <Link
        to={to}
        className="d-flex flex-column align-items-center text-decoration-none"
        style={{
          color: isActive ? SIDEBAR_CONFIG.bottomNavActiveColor : "#999",
          transition: "color 0.3s",
          fontSize: "0.75rem",
          minWidth: "50px",
        }}
        onClick={handleClick}
      >
        <div style={{ marginBottom: "2px" }}>
          {React.cloneElement(icon, {
            color: isActive ? SIDEBAR_CONFIG.bottomNavActiveColor : "#999"
          })}
        </div>
        <span style={{ fontSize: "0.7rem" }}>{label}</span>
      </Link>
    );
  }

  // Regular navigation item
  return (
    <Link
      to={to}
      className="d-flex flex-column align-items-center text-decoration-none"
      style={{
        color: isActive ? SIDEBAR_CONFIG.bottomNavActiveColor : "#999",
        transition: "color 0.3s",
        fontSize: "0.75rem",
        minWidth: "50px",
      }}
      onClick={handleClick}
    >
      <div style={{ marginBottom: "2px" }}>
        {React.cloneElement(icon, {
          color: isActive ? SIDEBAR_CONFIG.bottomNavActiveColor : "#999"
        })}
      </div>
      <span style={{ fontSize: "0.7rem" }}>{label}</span>
    </Link>
  );
};

export default BottomNavItem;