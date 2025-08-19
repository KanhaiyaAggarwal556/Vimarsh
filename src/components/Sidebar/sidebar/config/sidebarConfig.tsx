import React from "react";
import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineMessage,
  AiOutlineInfoCircle,
  AiOutlineMail,
} from "react-icons/ai";
// Type definitions
interface SidebarConfig {
  activeColor: string;
  createPostActiveColor: string;
  itemBorderRadius: string;
  createPostBorderRadius: string;
  backgroundColor: string;
}

interface NavItem {
  to: string;
  icon: React.ReactElement;
  label: string;
}

// Sidebar styling configuration
export const SIDEBAR_CONFIG: SidebarConfig = {
  activeColor: "rgb(52 71 178 / 51%)",
  createPostActiveColor: "rgb(52 71 178 / 51%)",
  itemBorderRadius: "1.5rem",
  createPostBorderRadius: "2.5rem",
  backgroundColor: "#000000", // Pure black background
};

// Navigation items data
export const NAV_ITEMS: NavItem[] = [
  { to: "/home", icon: <AiOutlineHome className="me-2" />, label: "Home" },
  { to: "/search", icon: <AiOutlineSearch className="me-2" />, label: "Search" },
  { to: "/notifications", icon: <AiOutlineBell className="me-2" />, label: "Notifications" },
  { to: "/i/twitty", icon: <AiOutlineMessage className="me-2" />, label: "Tweety" },
  { to: "/about", icon: <AiOutlineInfoCircle className="me-2" />, label: "About Us" },
  { to: "/contact", icon: <AiOutlineMail className="me-2" />, label: "Contact Us" },
];