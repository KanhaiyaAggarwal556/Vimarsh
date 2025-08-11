import React, { useState } from "react";
import MobileToggleButton from "./sidebar/components/MobileToggleButton";
import DesktopSidebar from "./sidebar/components/DesktopSidebar";
import MobileSidebarOverlay from "./sidebar/components/MobileSidebarOverlay";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <MobileToggleButton open={open} setOpen={setOpen} />
      <DesktopSidebar />
      <MobileSidebarOverlay open={open} setOpen={setOpen} />
    </>
  );
};

export default Sidebar;