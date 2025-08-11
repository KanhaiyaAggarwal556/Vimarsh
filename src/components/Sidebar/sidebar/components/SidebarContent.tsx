import React from "react";
import { useLocation } from "react-router-dom";
import SidebarLogo from "./SidebarLogo";
import NavigationList from "./NavigationList";
import CreatePostButton from "./CreatePostButton";

// Props interface
interface SidebarContentProps {
  onLinkClick?: () => void;
  isResponsive?: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ onLinkClick, isResponsive = false }) => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <>
      <SidebarLogo />
      <NavigationList 
        pathname={pathname} 
        onLinkClick={onLinkClick} 
        isResponsive={isResponsive} 
      />
      <CreatePostButton 
        pathname={pathname} 
        onLinkClick={onLinkClick} 
        isResponsive={isResponsive} 
      />
    </>
  );
};

export default SidebarContent;