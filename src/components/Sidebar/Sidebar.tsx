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
          
          {/* Mobile spacing styles */}
          <style>{`
            /* Main content wrapper spacing */
            .main-content,
            .container-fluid,
            .app-container {
              padding-bottom: 80px !important;
            }
            
            /* Page containers */
            .page-container,
            .home-container,
            .profile-container,
            .search-container {
              padding-bottom: 80px !important;
              min-height: calc(100vh - 80px) !important;
            }
            
            /* Scrollable areas */
            .scroll-container,
            .posts-container,
            .content-area {
              padding-bottom: 80px !important;
            }
            
            /* Body spacing for mobile only */
            @media (max-width: 767px) {
              body {
                padding-bottom: 0 !important;
              }
              
              /* Main app wrapper */
              #root,
              .app {
                padding-bottom: 0 !important;
              }
              
              /* Specific page layouts */
              .home-section {
                padding-bottom: 90px !important;
              }
              
              .profile-section {
                padding-bottom: 80px !important;
              }
              
              .search-section {
                padding-bottom: 80px !important;
              }
              
              /* Any other main sections */
              .main-section {
                padding-bottom: 80px !important;
              }
            }
            
            /* Desktop and tablet - no extra padding */
            @media (min-width: 768px) {
              body,
              #root,
              .app,
              .main-content,
              .container-fluid,
              .app-container,
              .page-container,
              .home-container,
              .profile-container,
              .search-container,
              .scroll-container,
              .posts-container,
              .content-area {
                padding-bottom: 0 !important;
              }
            }
            
            /* Ensure bottom nav doesn't interfere with content */
            @media (max-width: 767px) {
              .bottom-navigation {
                z-index: 1050 !important;
                background-color: rgba(0, 0, 0, 0.95) !important;
                backdrop-filter: blur(10px) !important;
                border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
              }
            }
          `}</style>
        </>
      )}
    </>
  );
};

export default Sidebar;