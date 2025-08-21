// components/mobile/BottomNavigation.tsx - Enhanced with double-tap home functionality
import React from "react";
import { useLocation } from "react-router-dom";
import BottomNavItem from "./BottomNavItem";
import { MOBILE_NAV_ITEMS, SIDEBAR_CONFIG } from "@/config/navigationConfig";
import { useAuth } from "@/hooks/useAuth";

interface BottomNavigationProps {
  onMoreClick: () => void;
  onHomeTap?: () => void; // New prop for home double-tap functionality
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  onMoreClick, 
  onHomeTap 
}) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div
      className="d-lg-none fixed-bottom d-flex justify-content-around align-items-center py-2"
      style={{
        backgroundColor: SIDEBAR_CONFIG.bottomNavBackgroundColor,
        borderTop: "1px solid #333",
        height: "60px",
        zIndex: 1000,
      }}
    >
      {MOBILE_NAV_ITEMS.map(({ id, to, icon, label }) => {
        let href = to;
        let onClick: (() => void) | undefined;

        // Handle special cases
        if (id === 'more') {
          onClick = onMoreClick;
        } else if (id === 'profile' && user?.userName) {
          href = `/${user.userName}`;
        }

        return (
          <BottomNavItem
            key={id}
            id={id}
            to={href}
            icon={icon}
            label={label}
            pathname={location.pathname}
            onClick={onClick}
            onHomeTap={id === 'home' ? onHomeTap : undefined}
            isCreatePost={id === 'createpost'}
          />
        );
      })}
    </div>
  );
};

export default BottomNavigation;