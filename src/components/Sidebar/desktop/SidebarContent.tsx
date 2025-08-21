// components/desktop/SidebarContent.tsx - Enhanced with double-tap home functionality
import React from "react";
import { useLocation } from "react-router-dom";
import SidebarLogo from "../shared/SidebarLogo";
import NavigationList from "./NavigationList";
import CreatePostButton from "../shared/CreatePostButton";

interface SidebarContentProps {
  onHomeTap?: () => void; // New prop for home double-tap functionality
}

const SidebarContent: React.FC<SidebarContentProps> = ({ onHomeTap }) => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <>
      <SidebarLogo />
      {/* Group navigation and create post together to eliminate gap */}
      <div className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
        <NavigationList pathname={pathname} onHomeTap={onHomeTap} />
        <CreatePostButton pathname={pathname} />
      </div>
    </>
  );
};

export default SidebarContent;