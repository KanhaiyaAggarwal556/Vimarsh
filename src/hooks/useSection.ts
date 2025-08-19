import { useState, useCallback } from 'react';
import { ActiveSection, SECTIONS } from '@/types';
import { SECTION_CONFIG } from '@/config/sections';

interface UseSectionReturn {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  isSection: (section: ActiveSection) => boolean;
  toggleSection: () => void;
}

export const useSection = (
  initialSection: ActiveSection = SECTION_CONFIG.DEFAULT_SECTION
): UseSectionReturn => {
  const [activeSection, setActiveSection] = useState<ActiveSection>(initialSection);

  const handleSectionChange = useCallback((section: ActiveSection) => {
    setActiveSection(section);
  }, []);

  const isSection = useCallback((section: ActiveSection) => {
    return activeSection === section;
  }, [activeSection]);

  const toggleSection = useCallback(() => {
    setActiveSection(current => 
      current === SECTIONS.HOME ? SECTIONS.MESSAGES : SECTIONS.HOME
    );
  }, []);

  return {
    activeSection,
    setActiveSection: handleSectionChange,
    isSection,
    toggleSection
  };
};
