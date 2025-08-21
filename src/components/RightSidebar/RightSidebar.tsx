// RightSidebar.tsx - Desktop-only version
import React, { useState, KeyboardEvent } from "react";
import Search from "./Search";
import UserAccount from "./UserAccount";
import SearchResults from "./SearchResults";
import FeaturePanel from "./FeaturePanel/FeaturePanel";
import { useSearch, useAuth } from "./hooks";
import ChatBot from "./ChatBot";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/rightsidebar.css";

type ViewType = "main" | "search" | "login" | "signup";

interface UserData {
  id: string;
  email: string;
  name: string;
}

interface LoginProps {
  onLoginSuccess: (userData: UserData) => void;
  onBackToMain: () => void;
  onSwitchToSignup: () => void;
}

interface SignUpProps {
  onSignupSuccess: (userData: UserData) => void;
  onBackToMain: () => void;
  onSwitchToLogin: () => void;
}

declare const Login: React.FC<LoginProps>;
declare const SignUp: React.FC<SignUpProps>;

const RightSidebar: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("main");
  const [isChatBotOpen, setIsChatBotOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    searchTerm,
    setSearchTerm,
    isSearchFocused,
    setIsSearchFocused,
    suggestions,
    searchRef,
    handleSuggestionClick,
  } = useSearch();

  const { setIsUserMenuOpen } = useAuth();

  // Check if we're on the search page
  const isOnSearchPage: boolean = location.pathname === "/search";

  // ChatBot toggle handler
  const handleChatBotToggle = (): void => {
    setIsChatBotOpen(!isChatBotOpen);
  };

  // Back to main handler
  const handleBackToMain = (): void => {
    setCurrentView("main");
  };

  // Login/SignUp handlers
  const handleLogin = (): void => {
    setCurrentView("login");
    setIsUserMenuOpen(false);
  };

  const handleSignup = (): void => {
    setCurrentView("signup");
    setIsUserMenuOpen(false);
  };

  // Handle successful login/signup
  const handleLoginSuccess = (userData: UserData): void => {
    console.log("Login successful:", userData);
    setCurrentView("main");
  };

  const handleSignupSuccess = (userData: UserData): void => {
    console.log("Signup successful:", userData);
    setCurrentView("main");
  };

  // Search handler - navigate to search page
  const handleSearch = async (query: string): Promise<void> => {
    setSearchTerm(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Search handler for Search component
  const handleSearchAction = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(searchTerm);
    }
  };

  // Enhanced suggestion click handler
  const handleSuggestionClickEnhanced = (suggestion: string): void => {
    handleSuggestionClick(suggestion);
    handleSearch(suggestion);
  };

  // Main content renderer
  const renderMainContent = (): React.ReactNode => {
    switch (currentView) {
      case "search":
        return (
          <SearchResults
            searchTerm={searchTerm}
            onBackToMain={handleBackToMain}
          />
        );
      case "login":
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onBackToMain={handleBackToMain}
            onSwitchToSignup={handleSignup}
          />
        );
      case "signup":
        return (
          <SignUp
            onSignupSuccess={handleSignupSuccess}
            onBackToMain={handleBackToMain}
            onSwitchToLogin={handleLogin}
          />
        );
      case "main":
      default:
        return (
          <FeaturePanel onBackToMain={handleBackToMain} isMobile={false} />
        );
    }
  };

  // Check if we should show the search bar (not on search page)
  const shouldShowSearchBar: boolean = !isOnSearchPage;

  return (
    <>
      <div className="right-sidebar">
        {/* Desktop Header */}
        <div className="right-sidebar__header">
          {shouldShowSearchBar && (
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
              onSearch={handleSearchAction}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClickEnhanced}
              searchRef={searchRef}
            />
          )}

          <UserAccount className="desktop-user-account" />
        </div>

        {/* Desktop Content */}
        <div className="right-sidebar__content">{renderMainContent()}</div>
      </div>

      {/* ChatBot for Desktop */}
      {/* <ChatBot
        isOpen={isChatBotOpen}
        onToggle={handleChatBotToggle}
        position="bottom-right"
      /> */}
    </>
  );
};

export default RightSidebar;
