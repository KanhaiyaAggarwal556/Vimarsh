// components/shared/NavigationItem.tsx - Fixed home button logic
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SIDEBAR_CONFIG } from "@/config/navigationConfig";

interface NavigationItemProps {
  to: string;
  icon: React.ReactElement;
  label: string;
  pathname: string;
  onClick?: () => void;
  onHomeTap?: () => void;
  id?: string;
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
    
    // Regular navigation or custom onClick for other buttons
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    // Otherwise let the Link handle navigation normally
  };

  // Home button - don't use Link when on home page to avoid navigation interference
  if (isHome && isOnHomePage) {
    return (
      <li className="w-100">
        <div
          className={`nav-link text-white w-100 d-flex align-items-center justify-content-center ${
            isHomePressed ? 'home-pressed' : ''
          }`}
          style={{
            backgroundColor: isActive ? SIDEBAR_CONFIG.activeColor : "transparent",
            color: "#fff",
            fontWeight: isActive ? "bold" : "normal",
            borderRadius: SIDEBAR_CONFIG.itemBorderRadius,
            transition: "all 0.2s ease",
            minHeight: 48,
            transform: isHomePressed ? 'scale(0.95)' : 'scale(1)',
            opacity: isHomePressed ? 0.8 : 1,
            cursor: 'pointer',
          }}
          onClick={handleClick}
        >
          {icon}
          {label}

        </div>
        
        {/* Add CSS animation styles */}
        <style>{`
          
          .nav-link.home-pressed {
            background-color: ${SIDEBAR_CONFIG.activeColor} !important;
          }
        `}</style>
      </li>
    );
  }

  // Regular navigation item with Link
  return (
    <li className="w-100">
      <Link
        to={to}
        className={`nav-link text-white w-100 d-flex align-items-center justify-content-center ${
          isHomePressed ? 'home-pressed' : ''
        }`}
        style={{
          backgroundColor: isActive ? SIDEBAR_CONFIG.activeColor : "transparent",
          color: "#fff",
          fontWeight: isActive ? "bold" : "normal",
          borderRadius: SIDEBAR_CONFIG.itemBorderRadius,
          transition: "all 0.2s ease",
          minHeight: 48,
          transform: isHomePressed ? 'scale(0.95)' : 'scale(1)',
          opacity: isHomePressed ? 0.8 : 1,
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