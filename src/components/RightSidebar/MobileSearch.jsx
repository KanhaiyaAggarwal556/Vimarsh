// MobileSearch.jsx - Fixed version
import React, { useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Hash, TrendingUp } from 'lucide-react';

const MobileSearchSuggestions = ({ suggestions, searchTerm, onSuggestionClick }) => {
  // console.log('MobileSearchSuggestions render:', { suggestions, searchTerm });
  
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="mobile-search-suggestions">
        <div className="no-suggestions">
          <TrendingUp size={16} />
          <span>Start typing to see suggestions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-search-suggestions">
      {searchTerm === '' && (
        <div className="suggestions-header">
          <TrendingUp size={16} />
          <span>Trending & Popular</span>
        </div>
      )}
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="suggestion-item"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion.startsWith('#') ? (
            <Hash size={16} className="suggestion-icon" />
          ) : (
            <TrendingUp size={16} className="suggestion-icon" />
          )}
          <span>{suggestion}</span>
        </div>
      ))}
    </div>
  );
};

const MobileSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  isMobileSearchOpen,
  setIsMobileSearchOpen,
  onSearch,
  suggestions,
  onSuggestionClick 
}) => {
  const inputRef = useRef(null);

  // console.log('=== MOBILE SEARCH COMPONENT RENDER ===');
  // console.log('isMobileSearchOpen:', isMobileSearchOpen);
  // console.log('searchTerm:', searchTerm);
  // console.log('suggestions:', suggestions);

  useEffect(() => {
    // console.log('MobileSearch useEffect triggered, isMobileSearchOpen:', isMobileSearchOpen);
    
    if (isMobileSearchOpen && inputRef.current) {
      // Focus the input when mobile search opens
      setTimeout(() => {
        inputRef.current.focus();
        // console.log('Input focused');
      }, 100); // Reduced delay for better UX
    }
  }, [isMobileSearchOpen]);

  const handleClose = () => {
    // console.log('Closing mobile search');
    setIsMobileSearchOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // console.log('Enter pressed on mobile search');
      onSearch(e);
      handleClose();
    }
    if (e.key === 'Escape') {
      // console.log('Escape pressed on mobile search');
      handleClose();
    }
  };

  // FIXED: Modified to not automatically close the search
  const handleSuggestionClick = (suggestion) => {
    // console.log('Suggestion clicked:', suggestion);
    // Set the search term to the clicked suggestion
    setSearchTerm(suggestion);
    // Call the parent's suggestion click handler
    onSuggestionClick(suggestion);
    // Don't close immediately - let the parent component handle navigation
    // The search overlay should remain open to show results or close when appropriate
  };

  const handleInputChange = (e) => {
    // console.log('Input changed:', e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(e);
      handleClose();
    }
  };

  // If not open, don't render anything
  if (!isMobileSearchOpen) {
    // console.log('Mobile search is not open, not rendering');
    return null;
  }

  return (
    <>
      {/* Mobile Search Overlay */}
      <div 
        className={`mobile-search-overlay ${isMobileSearchOpen ? 'active' : ''}`}
        onClick={handleClose}
      />
      
      {/* Mobile Search Container */}
      <div className={`mobile-search-container ${isMobileSearchOpen ? 'active' : ''}`}>
        {/* Search Header */}
        <div className="mobile-search-header">
          <div className="mobile-search-input-wrapper">
            <SearchIcon 
              className="mobile-search-icon-input" 
              size={20}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search hashtags, topics..."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="mobile-search-input"
            />
            <button 
              className="mobile-search-close"
              onClick={handleClose}
              aria-label="Close search"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Search Button */}
        <div className="mobile-search-actions">
          <button 
            className="mobile-search-submit"
            onClick={handleSearchSubmit}
            disabled={!searchTerm.trim()}
            type="button"
          >
            Search
          </button>
        </div>
        
        {/* Mobile Search Suggestions */}
        <MobileSearchSuggestions 
          suggestions={suggestions}
          searchTerm={searchTerm}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>
    </>
  );
};

export default MobileSearch;