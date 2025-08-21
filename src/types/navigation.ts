// types/navigation.ts
import { ReactElement } from 'react';

export interface NavItem {
  to: string;
  icon: ReactElement;
  label: string;
  mobileVisible?: boolean;
  id: string;
}

export interface SidebarConfig {
  activeColor: string;
  createPostActiveColor: string;
  itemBorderRadius: string;
  createPostBorderRadius: string;
  backgroundColor: string;
  bottomNavBackgroundColor: string;
  bottomNavActiveColor: string;
  activeColorSolid?: string; // optional fallback solid color
  bottomNavActiveColorSolid?: string; // optional fallback solid color
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
}