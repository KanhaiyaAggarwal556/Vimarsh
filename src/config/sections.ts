import { SECTIONS, ActiveSection } from '@/types';

export const SECTION_CONFIG = {
  DEFAULT_SECTION: SECTIONS.HOME,
  AVAILABLE_SECTIONS: Object.values(SECTIONS),
  SECTION_LABELS: {
    [SECTIONS.HOME]: 'Home',
    [SECTIONS.MESSAGES]: 'Messages'
  }
} as const;