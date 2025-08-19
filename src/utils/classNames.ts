export const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
};

export const createToggleClass = (baseClass: string, isActive: boolean, activeClass = 'active'): string => {
  return cn(baseClass, isActive && activeClass);
};
