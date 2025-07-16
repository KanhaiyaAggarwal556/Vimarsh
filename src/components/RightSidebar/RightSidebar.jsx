// RightSidebar.jsx - Updated to hide search bar on /search page
import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, User, Grid3X3, X } from 'lucide-react';
import Search from './Search';
import UserAccount from './UserAccount';
import MobileSearch from './MobileSearch';
import SearchResults from './SearchResults';
import FeaturePanel from './FeaturePanel/FeaturePanel';
import { useSearch, useAuth } from './hooks';
import ChatBot from './ChatBot';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';

const RightSidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [isMobileFeaturePanelOpen, setIsMobileFeaturePanelOpen] = useState(false);
  const [currentView, setCurrentView] = useState('main');
  const [searchResults, setSearchResults] = useState(null);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  
  const mobileUserMenuRef = useRef(null);
  const mobileFeaturePanelRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    searchTerm,
    setSearchTerm,
    isSearchFocused,
    setIsSearchFocused,
    suggestions,
    searchRef,
    handleSearch: originalHandleSearch,
    handleSuggestionClick
  } = useSearch();

  const {
    isUserMenuOpen,
    setIsUserMenuOpen,
    isLoggedIn,
    handleLogout
  } = useAuth();

  // Check if we're on the search page
  const isOnSearchPage = location.pathname === '/search';

  // ChatBot toggle handler
  const handleChatBotToggle = () => {
    setIsChatBotOpen(!isChatBotOpen);
  };

  // Back to main handler
  const handleBackToMain = () => {
    setCurrentView('main');
    setSearchResults(null);
    setIsMobileFeaturePanelOpen(false);
    setIsMobileSearchOpen(false);
  };

  // Login/SignUp handlers
  const handleLogin = () => {
    setCurrentView('login');
    setIsUserMenuOpen(false);
    setIsMobileUserMenuOpen(false);
    setIsMobileFeaturePanelOpen(false);
  };

  const handleSignup = () => {
    setCurrentView('signup');
    setIsUserMenuOpen(false);
    setIsMobileUserMenuOpen(false);
    setIsMobileFeaturePanelOpen(false);
  };

  // Handle successful login/signup
  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    setCurrentView('main');
  };

  const handleSignupSuccess = (userData) => {
    console.log('Signup successful:', userData);
    setCurrentView('main');
  };

  // Search handler - navigate to search page instead of changing view
  const handleSearch = async (query) => {
    setSearchTerm(query);
    setIsMobileSearchOpen(false);
    setIsMobileFeaturePanelOpen(false);
    
    // Navigate to search page with query parameter
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Enhanced suggestion click handler
  const handleSuggestionClickEnhanced = (suggestion) => {
    handleSuggestionClick(suggestion);
    handleSearch(suggestion);
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mobile search opening
  const handleMobileSearchOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileSearchOpen(true);
    setIsMobileFeaturePanelOpen(false);
  };

  // Handle mobile user menu toggle
  const handleMobileUserMenuToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileUserMenuOpen(!isMobileUserMenuOpen);
    setIsMobileFeaturePanelOpen(false);
  };

  // Handle mobile feature panel toggle
  const handleMobileFeaturePanelToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileFeaturePanelOpen(!isMobileFeaturePanelOpen);
    setIsMobileUserMenuOpen(false);
  };

  // Handle clicking outside mobile menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileUserMenuOpen && 
          mobileUserMenuRef.current && 
          !mobileUserMenuRef.current.contains(event.target)) {
        setIsMobileUserMenuOpen(false);
      }
      
      if (isMobileFeaturePanelOpen && 
          mobileFeaturePanelRef.current && 
          !mobileFeaturePanelRef.current.contains(event.target)) {
        setIsMobileFeaturePanelOpen(false);
      }
    };

    if (isMobileUserMenuOpen || isMobileFeaturePanelOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileUserMenuOpen, isMobileFeaturePanelOpen]);

  // Mobile menu item handlers
  const handleMobileLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/login");
  };

  const handleMobileSignup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/signup");
  };

  const handleMobileLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleLogout();
    setIsMobileUserMenuOpen(false);
  };

  // Main content renderer
  const renderMainContent = () => {
    switch (currentView) {
      case 'search':
        return (
          <SearchResults 
            searchTerm={searchTerm}
            searchResults={searchResults}
            onBackToMain={handleBackToMain}
          />
        );
      case 'login':
        return (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onBackToMain={handleBackToMain}
            onSwitchToSignup={handleSignup}
          />
        );
      case 'signup':
        return (
          <SignUp 
            onSignupSuccess={handleSignupSuccess}
            onBackToMain={handleBackToMain}
            onSwitchToLogin={handleLogin}
          />
        );
      case 'main':
      default:
        return (
          <FeaturePanel
            onSearch={handleSearch}
            onBackToMain={handleBackToMain}
            searchTerm={searchTerm}
            isMobile={isMobile}
          />
        );
    }
  };

  // Check if we should show the search bar (not on search page)
  const shouldShowSearchBar = !isOnSearchPage;

  // ==========================================
  // MOBILE RENDER
  // ==========================================
  if (isMobile) {
    return (
      <>
        {/* Mobile Header Icons - Only show search icon when search bar should be visible */}
        <div className="mobile-header-icons-container">
          <div className="mobile-header-spacer"></div>
          
          <div className="mobile-header-icons">
            {/* Mobile Search Button - Only show when search bar should be visible */}
            {shouldShowSearchBar && (
              <button
                className="mobile-search-icon"
                onClick={handleMobileSearchOpen}
                onTouchEnd={handleMobileSearchOpen}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Open search"
                type="button"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  userSelect: 'none'
                }}
              >
                <SearchIcon size={24} />
              </button>
            )}

            {/* Mobile User Menu */}
            <div className="mobile-user-menu" ref={mobileUserMenuRef}>
              <button
                className="mobile-user-icon"
                onClick={handleMobileUserMenuToggle}
                onTouchEnd={handleMobileUserMenuToggle}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="User menu"
                type="button"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  userSelect: 'none'
                }}
              >
                <User size={24} />
              </button>

              {/* Mobile User Dropdown */}
              {isMobileUserMenuOpen && (
                <div className="user-dropdown">
                  {isLoggedIn ? (
                    <>
                      <div className="user-info">
                        <span>Welcome, User!</span>
                      </div>
                      <button 
                        onClick={handleMobileLogout} 
                        className="menu-item"
                        type="button"
                      >
                        <User size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleMobileLogin} 
                        className="menu-item"
                        type="button"
                      >
                        <User size={16} />
                        Login
                      </button>
                      <button 
                        onClick={handleMobileSignup} 
                        className="menu-item"
                        type="button"
                      >
                        <User size={16} />
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Component - Only shows when opened and search bar should be visible */}
        {shouldShowSearchBar && (
          <MobileSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isMobileSearchOpen={isMobileSearchOpen}
            setIsMobileSearchOpen={setIsMobileSearchOpen}
            onSearch={handleSearch}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClickEnhanced}
          />
        )}

        {/* Mobile Main Content */}
        <div className="mobile-main-content">
          {renderMainContent()}
        </div>

        {/* Mobile Feature Panel Button - Only show when search bar should be visible */}
        {shouldShowSearchBar && (
          <div className="mobile-feature-panel-wrapper" ref={mobileFeaturePanelRef}>
            <button
              className="mobile-feature-panel-button"
              onClick={handleMobileFeaturePanelToggle}
              onTouchEnd={handleMobileFeaturePanelToggle}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="Features"
              type="button"
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                userSelect: 'none'
              }}
            >
              {isMobileFeaturePanelOpen ? <X size={24} /> : <Grid3X3 size={24} />}
            </button>

            {isMobileFeaturePanelOpen && (
              <div className="mobile-feature-panel-overlay">
                <div className="mobile-feature-panel-content">
                  <div className="mobile-feature-panel-header">
                    <h3>Features</h3>
                    <button
                      className="mobile-feature-panel-close"
                      onClick={handleMobileFeaturePanelToggle}
                      aria-label="Close features"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="mobile-feature-panel-body">
                    <FeaturePanel
                      onSearch={handleSearch}
                      onBackToMain={handleBackToMain}
                      searchTerm={searchTerm}
                      isMobile={true} 
                      isQuickAccess={false}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ChatBot for Mobile */}
        <ChatBot
          isOpen={isChatBotOpen}
          onToggle={handleChatBotToggle}
          position="bottom-left"
        />
      </>
    );
  }

  // ==========================================
  // DESKTOP RENDER
  // ==========================================
  return (
    <>
      <div className="right-sidebar">
        {/* Desktop Header - Only show search bar when shouldShowSearchBar is true */}
        <div className="right-sidebar__header">
          {shouldShowSearchBar && (
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
              onSearch={handleSearch}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClickEnhanced}
              searchRef={searchRef}
            />
          )}

          <UserAccount
            isUserMenuOpen={isUserMenuOpen}
            setIsUserMenuOpen={setIsUserMenuOpen}
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onLogout={handleLogout}
          />
        </div>

        {/* Desktop Content */}
        <div className="right-sidebar__content">
          {renderMainContent()}
        </div>
      </div>
      
      {/* ChatBot for Desktop */}
      <ChatBot
        isOpen={isChatBotOpen}
        onToggle={handleChatBotToggle}
        position="bottom-right"
      />
    </>
  );
};

export default RightSidebar;