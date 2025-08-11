// Search.tsx
import React, { useEffect, RefObject } from 'react';
import { Search as SearchIcon, Hash, TrendingUp } from 'lucide-react';

// Type definitions
interface SearchSuggestionsProps {
  suggestions: string[];
  searchTerm: string;
  onSuggestionClick: (suggestion: string) => void;
}

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  onSearch: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  searchRef: RefObject<HTMLDivElement>;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ 
  suggestions, 
  searchTerm, 
  onSuggestionClick 
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="search-suggestions">
      {searchTerm === '' && (
        <div className="suggestions-header">
          <TrendingUp size={16} />
          <span>Trending & Popular</span>
        </div>
      )}
      {suggestions.map((suggestion: string, index: number) => (
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

const Search: React.FC<SearchProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  isSearchFocused, 
  setIsSearchFocused,
  onSearch,
  suggestions,
  onSuggestionClick,
  searchRef 
}) => {
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    // Add event listener when dropdown is open
    if (isSearchFocused) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchFocused, searchRef, setIsSearchFocused]);

  return (
    <div className="search-form" ref={searchRef}>
      <div className="search-container">
        <SearchIcon className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search hashtags, topics..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              onSearch(e);
            }
          }}
          className="search-input"
        />
        
        {isSearchFocused && (
          <SearchSuggestions 
            suggestions={suggestions}
            searchTerm={searchTerm}
            onSuggestionClick={onSuggestionClick}
          />
        )}
      </div>
    </div>
  );
};

export default Search;