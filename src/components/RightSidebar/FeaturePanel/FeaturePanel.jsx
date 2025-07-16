import { useState } from 'react';
import { FEATURES_DATA } from './constants/featuresData';
import { fetchFeatureData } from './services/featureDataService';
import FeatureGrid from './components/FeatureGrid';
import ResultView from './components/ResultView';
import "./FeaturePanel.css";

const FeaturePanel = ({onBackToMain, isMobile = true, isQuickAccess = false }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  const handleFeatureClick = async (feature) => {
    console.log('=== FEATURE CLICKED ===', feature.name, { isMobile, isQuickAccess });
    
    setShowMobileDropdown(false);
    setSelectedFeature(feature);
    setIsLoading(true);
    setError(null);
    setSearchResults(null);
    
    try {
      const data = await fetchFeatureData(feature);
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!searchResults) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: searchResults.title,
          text: searchResults.content,
          url: searchResults.shareUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${searchResults.title}\n\n${searchResults.content}\n\n${searchResults.shareUrl}`);
      alert('Content copied to clipboard!');
    }
  };

  const handleRedirect = () => {
    if (searchResults && searchResults.redirectUrl) {
      window.open(searchResults.redirectUrl, '_blank');
    }
  };

  const handleBack = () => {
    setSelectedFeature(null);
    setSearchResults(null);
    setIsLoading(false);
    setError(null);
    setShowMobileDropdown(false);
    if (onBackToMain) onBackToMain();
  };

  const handleRetry = () => {
    if (selectedFeature) {
      handleFeatureClick(selectedFeature);
    }
  };

  const handleToggleDropdown = () => {
    setShowMobileDropdown(!showMobileDropdown);
  };

  // Show result view for both desktop and mobile when a feature is selected
  if (selectedFeature && (isLoading || searchResults || error)) {
    return (
      <ResultView 
        selectedFeature={selectedFeature}
        isLoading={isLoading}
        error={error}
        searchResults={searchResults}
        onBack={handleBack}
        onRetry={handleRetry}
        onShare={handleShare}
        onRedirect={handleRedirect}
        isMobile={isMobile} // Pass isMobile prop to ResultView for responsive styling
      />
    );
  }

  // Default feature panel (grid or dropdown)
  return (
    <div className={`feature-panel mobile-feature-panel}`}>
      <FeatureGrid 
        features={FEATURES_DATA}
        isMobile={isMobile}
        showMobileDropdown={showMobileDropdown}
        onToggleDropdown={handleToggleDropdown}
        onFeatureClick={handleFeatureClick}
      />
    </div>
  );
};

export default FeaturePanel;