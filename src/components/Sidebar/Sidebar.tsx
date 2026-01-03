// components/Sidebar.tsx - Updated to use simplified HomeContext
import React, { useState, useCallback } from "react";
import DesktopSidebar from "./desktop/DesktopSidebar";
import TabletSidebar from "./tablet/TabletSidebar";
import BottomNavigation from "./mobile/BottomNavigation";
import MoreModal from "./mobile/MoreModal";
import { useResponsiveBreakpoint } from "@/hooks/useResponsiveBreakpoint";
import { useHomeContext } from "@/contexts/HomeContext";

const Sidebar: React.FC = () => {
  const [showMoreModal, setShowMoreModal] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsiveBreakpoint();
  
  // Get home functionality from simplified context
  const { handleHomeTap } = useHomeContext();

  const handleMoreClick = useCallback(() => {
    setShowMoreModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowMoreModal(false);
  }, []);

  return (
    <>
      {isDesktop && <DesktopSidebar onHomeTap={handleHomeTap} />}
      {isTablet && <TabletSidebar onHomeTap={handleHomeTap} />}
      {isMobile && (
        <>
          <BottomNavigation 
            onMoreClick={handleMoreClick} 
            onHomeTap={handleHomeTap}
          />
          <MoreModal isOpen={showMoreModal} onClose={handleCloseModal} />
        </>
      )}
    </>
  );
};

export default Sidebar;