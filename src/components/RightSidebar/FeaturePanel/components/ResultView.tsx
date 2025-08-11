import React from 'react';
import { X, Share2, ExternalLink } from 'lucide-react';
import { Feature } from '../constants/featuresData';

// Define the SearchResults interface (should match the one in your service)
interface SearchResults {
  feature: string;
  title: string;
  content: string;
  shareUrl: string;
  redirectUrl?: string;
  imageUrl?: string;
}

// Define the props interface for ResultView
interface ResultViewProps {
  selectedFeature: Feature;
  isLoading: boolean;
  error: string | null;
  searchResults: SearchResults | null;
  onBack: () => void;
  onRetry: () => void;
  onShare: () => Promise<void>;
  onRedirect: () => void;
  isMobile?: boolean;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  selectedFeature, 
  isLoading, 
  error, 
  searchResults, 
  onBack, 
  onRetry, 
  onShare, 
  onRedirect,
  isMobile = false
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  };

  return (
    <div className={`feature-result-container ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className="result-header">
        <button 
          onClick={onBack} 
          className="close-button"
          aria-label="Close"
        >
          <X size={isMobile ? 18 : 20} />
        </button>
      </div>

      <div className="result-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">
              Finding you the perfect {selectedFeature.name.toLowerCase()}...
            </p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Oops! Something went wrong</h3>
            <p className="error-message">{error}</p>
            <button 
              onClick={onRetry}
              className="try-again-button"
            >
              Try Again
            </button>
          </div>
        ) : searchResults ? (
          <div className="search-result">
            <div className="result-icon">
              <selectedFeature.icon size={isMobile ? 20 : 24} />
            </div>
            {searchResults.imageUrl && (
              <img 
                src={searchResults.imageUrl} 
                alt={searchResults.title} 
                className="result-image"
                onError={handleImageError}
              />
            )}
            <h2 className="result-title">{searchResults.title}</h2>
            <div className="result-text">
              {searchResults.content}
            </div>
            <div className={`action-buttons ${isMobile ? 'mobile-buttons' : 'desktop-buttons'}`}>
              <button 
                onClick={onRetry}
                className="try-again-button"
              >
                Get Another
              </button>
              <button 
                onClick={onShare}
                className="share-button"
              >
                <Share2 size={14} />
                Share
              </button>
              <button 
                onClick={onRedirect}
                className="redirect-button"
              >
                <ExternalLink size={14} />
                More
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ResultView;