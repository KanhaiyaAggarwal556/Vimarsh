import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineMessage,
  AiOutlineInfoCircle,
  AiOutlineMail,
  AiOutlineLogin,
} from "react-icons/ai";

// Sidebar styling configuration
export const SIDEBAR_CONFIG = {
  activeColor: "rgb(52 71 178 / 51%)",
  createPostActiveColor: "rgb(52 71 178 / 51%)",
  itemBorderRadius: "1.5rem",
  createPostBorderRadius: "2.5rem",
  backgroundColor: "#000000", // Pure black background
};

// Navigation items data
export const NAV_ITEMS = [
  { to: "/", icon: <AiOutlineHome className="me-2" />, label: "Home" },
  { to: "/search", icon: <AiOutlineSearch className="me-2" />, label: "Search" },
  { to: "/notifications", icon: <AiOutlineBell className="me-2" />, label: "Notifications" },
  { to: "/i/twitty", icon: <AiOutlineMessage className="me-2" />, label: "Tweety" },
  { to: "/about", icon: <AiOutlineInfoCircle className="me-2" />, label: "About Us" },
  { to: "/contact", icon: <AiOutlineMail className="me-2" />, label: "Contact Us" },
  { to: "/login", icon: <AiOutlineLogin className="me-2" />, label: "Log in" },
];