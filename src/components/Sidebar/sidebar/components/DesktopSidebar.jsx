import SidebarContent from "./SidebarContent";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

const DesktopSidebar = () => (
  <div
    className="sidebar d-none d-lg-flex p-3 flex-column flex-shrink-0"
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
      borderRight: "2px solid #333", // Right border separator
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
      <SidebarContent />
    </div>
  </div>
);

export default DesktopSidebar;