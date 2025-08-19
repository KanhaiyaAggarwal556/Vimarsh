import type { PostDataExtended } from './postTypes';

export const SECTIONS = {
  HOME: 'home',
  MESSAGES: 'messages'
} as const;

export type ActiveSection = typeof SECTIONS[keyof typeof SECTIONS];

// Component Props Types
export interface SectionToggleProps {
  activeSection: ActiveSection;
  onSectionToggle: (section: ActiveSection) => void;
}

export interface HeaderProps {
  isScrolled: boolean;
  activeSection: ActiveSection;
  onSectionToggle: (section: ActiveSection) => void;
}

export interface HomeSectionProps {
  isActive: boolean;
  fetching: boolean;
  postList: PostDataExtended[];
  onRefetch?: () => void;
}

export interface MessagesSectionProps {
  isActive: boolean;
}

// Re-export post types for convenience
export * from './postTypes';

// utils/classNames.ts
export const createToggleClass = (
  baseClass: string,
  condition: boolean,
  activeClass: string = 'active'
): string => {
  return condition ? `${baseClass} ${activeClass}` : baseClass;
};