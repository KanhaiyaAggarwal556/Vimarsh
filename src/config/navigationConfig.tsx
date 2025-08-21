import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineMessage,
  AiOutlineInfoCircle,
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineAppstore,
  AiOutlineEllipsis,
  AiOutlinePlusCircle
} from 'react-icons/ai';
import { NavItem, SidebarConfig } from '../types/navigation';

export const SIDEBAR_CONFIG: SidebarConfig = {
  activeColor: "rgb(52 71 178 / 51%)",
  createPostActiveColor: "rgb(52 71 178 / 51%)",
  itemBorderRadius: "1.5rem",
  createPostBorderRadius: "2.5rem",
  backgroundColor: "#000000",
  bottomNavBackgroundColor: "#1a1a1a",
  bottomNavActiveColor: "#3949ab",
};

export const NAV_ITEMS: NavItem[] = [
  { 
    id: 'home',
    to: "/home", 
    icon: <AiOutlineHome />, 
    label: "Home",
    mobileVisible: true 
  },
  { 
    id: 'search',
    to: "/search", 
    icon: <AiOutlineSearch />, 
    label: "Search",
    mobileVisible: true 
  },
  { 
    id: 'notifications',
    to: "/notifications", 
    icon: <AiOutlineBell />, 
    label: "Notifications" 
  },
  { 
    id: 'tweety',
    to: "/i/twitty", 
    icon: <AiOutlineMessage />, 
    label: "Tweety" 
  },
  { 
    id: 'about',
    to: "/about", 
    icon: <AiOutlineInfoCircle />, 
    label: "About Us" 
  },
  { 
    id: 'contact',
    to: "/contact", 
    icon: <AiOutlineMail />, 
    label: "Contact Us" 
  },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { 
    id: 'home',
    to: "/home", 
    icon: <AiOutlineHome size={24} />, 
    label: "Home",
    mobileVisible: true 
  },
  { 
    id: 'search',
    to: "/search", 
    icon: <AiOutlineSearch size={24} />, 
    label: "Search",
    mobileVisible: true 
  },
  { 
    id: 'createpost', // Changed from 'features' to 'createpost'
    to: "/createpost", 
    icon: <AiOutlinePlusCircle size={24} />, 
    label: "Create", // Short label for mobile
    mobileVisible: true 
  },
  { 
    id: 'more',
    to: "#", 
    icon: <AiOutlineEllipsis size={24} />, 
    label: "More",
    mobileVisible: true 
  },
  { 
    id: 'profile',
    to: "", // Will be set dynamically based on username
    icon: <AiOutlineUser size={24} />, 
    label: "Profile",
    mobileVisible: true 
  },
];

// Updated MORE_ITEMS to include features and other non-mobile items
export const MORE_ITEMS: NavItem[] = [
  { 
    id: 'features', // Moved from mobile nav to more modal
    to: "/featurePanel", 
    icon: <AiOutlineAppstore size={20} />, 
    label: "Features"
  },
  ...NAV_ITEMS.filter(item => !item.mobileVisible) // Include other desktop-only items
];