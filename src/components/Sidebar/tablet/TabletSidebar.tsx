// components/tablet/TabletSidebar.tsx - Enhanced with double-tap home functionality
import React from "react";
import { SIDEBAR_CONFIG } from "@/config/navigationConfig";
import SidebarContent from "../desktop/SidebarContent";

interface TabletSidebarProps {
  onHomeTap?: () => void;
}

const TabletSidebar: React.FC<TabletSidebarProps> = ({ onHomeTap }) => (
  <div className="sidebar hidden md:flex lg:hidden p-3 flex-col flex-shrink-0 min-h-screen w-[25vw] fixed top-0 left-0 z-[1050] justify-center overflow-hidden border-r-2 border-gray-700" style={{ backgroundColor: SIDEBAR_CONFIG.backgroundColor }}>
    <div className="w-full flex flex-col items-center h-[80vh] justify-between pt-8 pb-8">
      <SidebarContent onHomeTap={onHomeTap} />
    </div>
  </div>
);

export default TabletSidebar;