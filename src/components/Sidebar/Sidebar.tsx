// components/Sidebar.tsx - Enhanced with double-tap home functionality
import React, { useState, useEffect, useCallback } from "react";
import DesktopSidebar from "./desktop/DesktopSidebar";
import TabletSidebar from "./tablet/TabletSidebar";
import BottomNavigation from "./mobile/BottomNavigation";
import MoreModal from "./mobile/MoreModal";
import { useResponsiveBreakpoint } from "@/hooks/useResponsiveBreakpoint";
import { useDoubleTapHome } from "@/hooks/useDoubleTapHome";

// Define interface for home refresh handler
interface SidebarProps {
  onHomeRefresh?: () => Promise<void> | void;
}

const Sidebar: React.FC<SidebarProps> = ({ onHomeRefresh }) => {
  const [showMoreModal, setShowMoreModal] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsiveBreakpoint();

  const { handleHomeTap, cleanup } = useDoubleTapHome({
    onRefresh: onHomeRefresh,
    doubleTapDelay: 300
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

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
          {/* Add padding bottom to prevent content from being hidden behind bottom nav */}
          <style>{`
            body { 
              padding-bottom: 70px; 
            }
            @media (min-width: 768px) {
              body { 
                padding-bottom: 0; 
              }
            }
          `}</style>
        </>
      )}
    </>
  );
};

export default Sidebar;