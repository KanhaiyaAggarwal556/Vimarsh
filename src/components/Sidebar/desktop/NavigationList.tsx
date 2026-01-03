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
  <ul className="nav nav-pills flex-col mb-auto w-full gap-2 mt-8 mb-0 items-center pr-4 pl-44">
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