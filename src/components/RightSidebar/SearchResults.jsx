// SearchResults.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const SearchResults = ({ searchTerm, onBackToMain }) => {
  return (
    <div className="search-content">
      <div className="search-header">
        <button onClick={onBackToMain} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>
      </div>
      <div className="search-results">
        <div className="search-term-display">
          <span>Results for: "{searchTerm}"</span>
        </div>
        <div className="coming-soon-message">
          <h3>🚀 Coming Soon...</h3>
          <p>We're working hard to bring you this amazing search feature!</p>
          <div className="feature-list">
            <div className="feature-item">🔍 Advanced search capabilities</div>
            <div className="feature-item">🏷️ Hashtag exploration</div>
            <div className="feature-item">📈 Trending analysis</div>
            <div className="feature-item">🎯 Personalized results</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;