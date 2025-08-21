// components/shared/NavigationItem.tsx - Enhanced with double-tap home functionality
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SIDEBAR_CONFIG } from "@/config/navigationConfig";

interface NavigationItemProps {
  to: string;
  icon: React.ReactElement;
  label: string;
  pathname: string;
  onClick?: () => void;
  onHomeTap?: () => void; // New prop for home double-tap functionality
  id?: string; // Add id to identify home button
}

const NavigationItem: React.FC<NavigationItemProps> = ({ 
  to, 
  icon, 
  label, 
  pathname, 
  onClick,
  onHomeTap,
  id
}) => {
  const location = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    // Check if this is the home button and we're already on home page
    if (id === 'home' && location.pathname === '/home' && onHomeTap) {
      e.preventDefault();
      onHomeTap();
      return;
    }
    
    // Regular navigation or custom onClick
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    // Otherwise let the Link handle navigation normally
  };

  return (
    <li className="w-100">
      <Link
        to={to}
        className="nav-link text-white w-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: pathname === to ? SIDEBAR_CONFIG.activeColor : "transparent",
          color: "#fff",
          fontWeight: pathname === to ? "bold" : "normal",
          borderRadius: SIDEBAR_CONFIG.itemBorderRadius,
          transition: "background-color 0.3s, color 0.3s, border-radius 0.3s",
          minHeight: 48,
        }}
        onClick={handleClick}
      >
        {icon}
        {label}
      </Link>
    </li>
  );
};

export default NavigationItem;