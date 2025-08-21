// components/desktop/NavigationList.tsx - Enhanced with double-tap home functionality
import React from "react";
import NavigationItem from "../shared/NavigationItem";
import { NAV_ITEMS } from "@/config/navigationConfig";

interface NavigationListProps {
  pathname: string;
  onHomeTap?: () => void; // New prop for home double-tap functionality
}

const NavigationList: React.FC<NavigationListProps> = ({ 
  pathname, 
  onHomeTap 
}) => (
  <ul
    className="nav nav-pills flex-column mb-auto w-100"
    style={{
      gap: "0.5rem",
      marginTop: "2rem",
      marginBottom: "0", // Removed margin to eliminate gap with Create Post
      alignItems: "center",
      paddingRight: "1rem",
      paddingLeft: "11rem",
    }}
  >
    {NAV_ITEMS.map(({ to, icon, label, id }) => (
      <NavigationItem
        key={id}
        id={id}
        to={to}
        icon={React.cloneElement(icon, { className: "me-2" })}
        label={label}
        pathname={pathname}
        onHomeTap={id === 'home' ? onHomeTap : undefined}
      />
    ))}
  </ul>
);

export default NavigationList;