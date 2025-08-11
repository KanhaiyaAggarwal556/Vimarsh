// hooks.tsx - Updated with better search suggestions
import { useState, useRef, useEffect, RefObject, FormEvent } from "react";

// Mock suggestions data
const mockSuggestions: string[] = [
  "#trending",
  "#technology",
  "#javascript",
  "#react",
  "#webdev",
  "#programming",
  "#design",
  "#ui",
  "#ux",
  "#frontend",
  "#backend",
  "#mobile",
  "#ios",
  "#android",
  "#nodejs",
  "#python",
  "#css",
  "#html",
  "#database",
  "#ai",
  "#machinelearning",
  "#startup",
  "#business",
  "#marketing",
  "#socialmedia",
  "#news",
  "#sports",
  "#music",
  "#movies",
  "#travel",
];

const defaultSuggestions: string[] = [
  "#trending",
  "#technology",
  "#javascript",
  "#react",
  "#webdev",
  "#programming",
  "#design",
  "#ui",
];

type ViewType = "main" | "search";

interface UseSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  suggestions: string[];
  currentView: ViewType;
  searchRef: RefObject<HTMLInputElement>;
  handleSearch: (e: FormEvent<HTMLFormElement>) => void;
  handleSuggestionClick: (suggestion: string) => void;
  handleBackToMain: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>(defaultSuggestions);
  const [currentView, setCurrentView] = useState<ViewType>("main");
  const searchRef = useRef<HTMLInputElement>(null);

  // Update suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions(defaultSuggestions);
    } else {
      const filtered = mockSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
    }
  }, [searchTerm]);

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      setCurrentView("search");
      setIsSearchFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string): void => {
    console.log("Suggestion clicked:", suggestion);
    setSearchTerm(suggestion);
    setCurrentView("search");
    setIsSearchFocused(false);
  };

  const handleBackToMain = (): void => {
    setCurrentView("main");
    setSearchTerm("");
    setSuggestions(defaultSuggestions);
  };

  return {
    searchTerm,
    setSearchTerm,
    isSearchFocused,
    setIsSearchFocused,
    suggestions,
    currentView,
    searchRef,
    handleSearch,
    handleSuggestionClick,
    handleBackToMain,
  };
};

interface UseAuthReturn {
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  handleLogin: () => void;
  handleSignup: () => void;
  handleLogout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = (): void => {
    console.log("Login clicked");
    // Add login logic here
    setIsLoggedIn(true);
    setIsUserMenuOpen(false);
  };

  const handleSignup = (): void => {
    console.log("Signup clicked");
    // Add signup logic here
    setIsLoggedIn(true);
    setIsUserMenuOpen(false);
  };

  const handleLogout = (): void => {
    console.log("Logout clicked");
    // Add logout logic here
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
  };

  return {
    isUserMenuOpen,
    setIsUserMenuOpen,
    isLoggedIn,
    handleLogin,
    handleSignup,
    handleLogout,
  };
};
