import React from "react";
import { Link } from "react-router-dom";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

// Props interface
interface NavigationItemProps {
  to: string;
  icon: React.ReactElement;
  label: string;
  pathname: string;
  onClick?: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ to, icon, label, pathname, onClick }) => (
  <li className="w-100">
    <Link
      to={to}
      className="nav-link text-white w-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: pathname === to ? SIDEBAR_CONFIG.activeColor : "transparent",
        color: "#fff",
        fontWeight: pathname === to ? "bold" : "normal",
        borderRadius: SIDEBAR_CONFIG.itemBorderRadius,
        transition: "background-color 0.3s, color 0.3s, border-radius 0.3s",
        minHeight: 48,
      }}
      onClick={onClick}
    >
      {icon}
      {label}
    </Link>
  </li>
);

export default NavigationItem;