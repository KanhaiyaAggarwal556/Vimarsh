import React from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

// Props interface
interface MobileToggleButtonProps {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const MobileToggleButton: React.FC<MobileToggleButtonProps> = ({ open, setOpen }) => {
  const location = useLocation();
  
  // Check if we're on the home page
  const isOnHomePage: boolean = location.pathname === '/' || location.pathname === '/home';
  
  // Don't render the button if not on home page
  if (!isOnHomePage) {
    return null;
  }

  return (
    <button
      className="btn d-lg-none position-fixed"
      style={{ 
        top: 15, 
        width: 20,
        zIndex: 10,
        backgroundColor: SIDEBAR_CONFIG.backgroundColor,
        // border: "1px solid #333",
        color: "#fff"
      }}
      onClick={() => setOpen((v) => !v)}
      aria-label="Toggle sidebar"
    >
      {open ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
    </button>
  );
};

export default MobileToggleButton;