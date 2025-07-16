// hooks.jsx - Updated with better search suggestions
import { useState, useRef, useEffect } from 'react';

// Mock suggestions data
const mockSuggestions = [
  '#trending',
  '#technology',
  '#javascript',
  '#react',
  '#webdev',
  '#programming',
  '#design',
  '#ui',
  '#ux',
  '#frontend',
  '#backend',
  '#mobile',
  '#ios',
  '#android',
  '#nodejs',
  '#python',
  '#css',
  '#html',
  '#database',
  '#ai',
  '#machinelearning',
  '#startup',
  '#business',
  '#marketing',
  '#socialmedia',
  '#news',
  '#sports',
  '#music',
  '#movies',
  '#travel'
];

const defaultSuggestions = [
  '#trending',
  '#technology',
  '#javascript',
  '#react',
  '#webdev',
  '#programming',
  '#design',
  '#ui'
];

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState(defaultSuggestions);
  const [currentView, setCurrentView] = useState('main');
  const searchRef = useRef(null);

  // Update suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions(defaultSuggestions);
    } else {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      setCurrentView('search');
      setIsSearchFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('Suggestion clicked:', suggestion);
    setSearchTerm(suggestion);
    setCurrentView('search');
    setIsSearchFocused(false);
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSearchTerm('');
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
    handleBackToMain
  };
};

export const useAuth = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    console.log('Login clicked');
    // Add login logic here
    setIsLoggedIn(true);
    setIsUserMenuOpen(false);
  };

  const handleSignup = () => {
    console.log('Signup clicked');
    // Add signup logic here
    setIsLoggedIn(true);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
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
    handleLogout
  };
};