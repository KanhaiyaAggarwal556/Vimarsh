import { useState } from "react";
import { FEATURES_DATA, Feature } from "./constants/featuresData";
import { fetchFeatureData } from "./services/featureDataService";
import FeatureGrid from "./components/FeatureGrid";
import ResultView from "./components/ResultView";
import "./FeaturePanel.css";

// Define the search results type based on your fetchFeatureData return structure
interface SearchResults {
  feature: string;
  title: string;
  content: string;
  shareUrl: string;
  redirectUrl?: string;
  imageUrl?: string;
}

// Define the component props interface
interface FeaturePanelProps {
  onBackToMain?: () => void;
  isMobile?: boolean;
  isQuickAccess?: boolean;
}

const FeaturePanel: React.FC<FeaturePanelProps> = ({
  onBackToMain,
  isMobile = true,
  isQuickAccess = false,
}) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showMobileDropdown, setShowMobileDropdown] = useState<boolean>(false);

  const handleFeatureClick = async (feature: Feature): Promise<void> => {
    console.log("=== FEATURE CLICKED ===", feature.name, {
      isMobile,
      isQuickAccess,
    });

    setShowMobileDropdown(false);
    setSelectedFeature(feature);
    setIsLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      const data = await fetchFeatureData(feature);
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (): Promise<void> => {
    if (!searchResults) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: searchResults.title,
          text: searchResults.content,
          url: searchResults.shareUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(
        `${searchResults.title}\n\n${searchResults.content}\n\n${searchResults.shareUrl}`
      );
      alert("Content copied to clipboard!");
    }
  };

  const handleRedirect = (): void => {
    if (searchResults && searchResults.redirectUrl) {
      window.open(searchResults.redirectUrl, "_blank");
    }
  };

  const handleBack = (): void => {
    setSelectedFeature(null);
    setSearchResults(null);
    setIsLoading(false);
    setError(null);
    setShowMobileDropdown(false);
    if (onBackToMain) onBackToMain();
  };

  const handleRetry = (): void => {
    if (selectedFeature) {
      handleFeatureClick(selectedFeature);
    }
  };

  const handleToggleDropdown = (): void => {
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
