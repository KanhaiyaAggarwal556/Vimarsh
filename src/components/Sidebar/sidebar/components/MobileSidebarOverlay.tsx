import React from "react";
import SidebarContent from "./SidebarContent";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

// Props interface
interface MobileSidebarOverlayProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MobileSidebarOverlay: React.FC<MobileSidebarOverlayProps> = ({ open, setOpen }) => (
  open && (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{
        background: "rgba(0,0,0,0.7)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => setOpen(false)}
    >
      <div
        className="rounded-4 shadow-lg mt-4 d-flex flex-column align-items-center"
        style={{
          backgroundColor: SIDEBAR_CONFIG.backgroundColor,
          width: 280,
          padding: "1.5rem",
          margin: 0,
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #333",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <SidebarContent onLinkClick={() => setOpen(false)} isResponsive={true} />
      </div>
    </div>
  )
);

export default MobileSidebarOverlay;