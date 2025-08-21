// components/mobile/BottomNavItem.tsx - Fixed home button logic
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SIDEBAR_CONFIG } from "@/config/navigationConfig";

interface BottomNavItemProps {
  to: string;
  icon: React.ReactElement;
  label: string;
  pathname: string;
  onClick?: () => void;
  onHomeTap?: () => void;
  isCreatePost?: boolean;
  id?: string;
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
  const [isHomePressed, setIsHomePressed] = useState(false);
  
  const isActive = pathname === to || (to.includes(':') && pathname.includes(to.split('/')[1]));
  const isHome = id === 'home';
  const isOnHomePage = location.pathname === '/' || location.pathname === '/home';

  const handleClick = async (e: React.MouseEvent) => {
    // Special handling for home button
    if (isHome) {
      e.preventDefault();
      e.stopPropagation();
      
      if (isOnHomePage && onHomeTap) {
        // We're already on home page - trigger double-tap functionality
        setIsHomePressed(true);
        setTimeout(() => setIsHomePressed(false), 300); // Visual feedback
        
        try {
          await onHomeTap();
        } catch (error) {
          console.error('Home tap failed:', error);
        }
      } else {
        // Navigate to home page normally when not on home page
        window.location.href = to;
      }
      return;
    }
    
    // Regular onClick handler for other buttons
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    // Otherwise let the Link handle navigation normally
  };

  // Special styling for Create Post button
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

  // Home button - don't use Link when on home page to avoid navigation interference
  if (isHome && isOnHomePage) {
    return (
      <div
        className="d-flex flex-column align-items-center text-decoration-none"
        style={{
          color: isActive || isHomePressed ? SIDEBAR_CONFIG.bottomNavActiveColor : "#999",
          transition: "all 0.2s ease",
          fontSize: "0.75rem",
          minWidth: "50px",
          transform: isHomePressed ? 'scale(0.95)' : 'scale(1)',
          opacity: isHomePressed ? 0.8 : 1,
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        <div style={{ 
          marginBottom: "2px",
          position: 'relative'
        }}>
          {React.cloneElement(icon, {
            color: isActive || isHomePressed ? SIDEBAR_CONFIG.bottomNavActiveColor : "#999"
          })}
          

        </div>
        <span style={{ fontSize: "0.7rem" }}>{label}</span>
        
        {/* Add CSS animation styles */}
        <style>{`
        `}</style>
      </div>
    );
  }

  // Regular navigation item with Link
  return (
    <Link
      to={to}
      className="d-flex flex-column align-items-center text-decoration-none"
      style={{
        color: isActive || isHomePressed ? SIDEBAR_CONFIG.bottomNavActiveColor : "#999",
        transition: "all 0.2s ease",
        fontSize: "0.75rem",
        minWidth: "50px",
        transform: isHomePressed ? 'scale(0.95)' : 'scale(1)',
        opacity: isHomePressed ? 0.8 : 1,
      }}
      onClick={handleClick}
    >
      <div style={{ 
        marginBottom: "2px",
        position: 'relative'
      }}>
        {React.cloneElement(icon, {
          color: isActive || isHomePressed ? SIDEBAR_CONFIG.bottomNavActiveColor : "#999"
        })}
      </div>
      <span style={{ fontSize: "0.7rem" }}>{label}</span>
    </Link>
  );
};

export default BottomNavItem;