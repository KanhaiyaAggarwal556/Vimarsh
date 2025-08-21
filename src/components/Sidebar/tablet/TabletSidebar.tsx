// components/tablet/TabletSidebar.tsx - Enhanced with double-tap home functionality
import React from "react";
import { SIDEBAR_CONFIG } from "@/config/navigationConfig";
import SidebarContent from "../desktop/SidebarContent";

interface TabletSidebarProps {
  onHomeTap?: () => void;
}

const TabletSidebar: React.FC<TabletSidebarProps> = ({ onHomeTap }) => (
  <div
    className="sidebar d-none d-md-flex d-lg-none p-3 flex-column flex-shrink-0"
    style={{
      backgroundColor: SIDEBAR_CONFIG.backgroundColor,
      minHeight: "100vh",
      width: "25vw",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 1050,
      justifyContent: "center",
      overflow: "hidden",
      borderRight: "2px solid #333",
    }}
  >
    <div
      className="w-100 d-flex flex-column align-items-center"
      style={{
        height: "80vh",
        justifyContent: "space-between",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <SidebarContent onHomeTap={onHomeTap} />
    </div>
  </div>
);

export default TabletSidebar;