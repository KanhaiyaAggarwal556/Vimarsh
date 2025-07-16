import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import SidebarLogo from "./SidebarLogo";
import NavigationList from "./NavigationList";
import CreatePostButton from "./CreatePostButton";

const SidebarContent = ({ onLinkClick, isResponsive = false }) => {
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

SidebarContent.propTypes = {
  onLinkClick: PropTypes.func,
  isResponsive: PropTypes.bool,
};

export default SidebarContent;