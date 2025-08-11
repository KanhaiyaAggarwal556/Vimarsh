import React from "react";
import NavigationItem from "./NavigationItem";
import { NAV_ITEMS } from "../config/sidebarConfig";

// Props interface
interface NavigationListProps {
  pathname: string;
  onLinkClick?: () => void;
  isResponsive?: boolean;
}

const NavigationList: React.FC<NavigationListProps> = ({ 
  pathname, 
  onLinkClick, 
  isResponsive = false 
}) => (
  <ul
    className="nav nav-pills flex-column mb-auto w-100"
    style={{
      gap: "0.5rem",
      marginTop: isResponsive ? "1rem" : "2rem",
      marginBottom: isResponsive ? "1rem" : "2rem",
      alignItems: "center",
      paddingRight: isResponsive ? 0 : "1rem",
      paddingLeft: isResponsive ? 0 : "11rem",
    }}
  >
    {NAV_ITEMS.map(({ to, icon, label }) => (
      <NavigationItem
        key={to}
        to={to}
        icon={icon}
        label={label}
        pathname={pathname}
        onClick={onLinkClick}
      />
    ))}
  </ul>
);

export default NavigationList;