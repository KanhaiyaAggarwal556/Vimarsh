import type { PostData } from '../post';
import '../style/ShareAndViewsCounter.css'; // Assuming you have a CSS file for styles
interface ShareAndViewsCounterProps {
  views: number;
  shares: number;
  saves: number;
  userSaved?: boolean;
  shareAnimation?: boolean;
  saveAnimation?: boolean;
  sharePending?: boolean;
  savePending?: boolean;
  onShare: () => void;
  onSave: () => void;
  post: PostData;
  compact?: boolean;
  formatCount?: (count: number) => string;
}

export default function ShareAndViewsCounter({ 
  views, 
  shares,
  saves,
  userSaved = false,
  shareAnimation = false,
  saveAnimation = false,
  sharePending = false,
  savePending = false,
  onShare,
  onSave,
  compact = false,
  formatCount
}: ShareAndViewsCounterProps) {
  
  const handleShareClick = (): void => {
    if (onShare && !sharePending) {
      onShare();
    }
  };

  const handleSaveClick = (): void => {
    if (onSave && !savePending) {
      onSave();
    }
  };

  // Default format function if not provided
  const defaultFormatCount = (count: number): string => {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  const displayFormat = formatCount || defaultFormatCount;
  
  return (
    <div className={`share-views-container ${compact ? 'compact' : ''}`}>
      <div className="engagement-actions">
        {/* Share Button */}
        <div className="tooltip-container">
          <button 
            className={`engagement-item engagement-btn ${sharePending ? 'pending' : ''}`}
            onClick={handleShareClick}
            disabled={sharePending}
            aria-label="Share this post"
          >
            <span className={`engagement-icon ${shareAnimation ? 'animate-pulse' : ''}`}>
              {sharePending ? (
                <svg width="18" height="18" viewBox="0 0 24 24" className="spinner">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684 6.632 3.316m-6.632-6 6.632-3.316m0 0a3 3 0 1 1 5.367-2.684 3 3 0 0 1-5.367 2.684zm0 9.316a3 3 0 1 1 5.367 2.684 3 3 0 0 1-5.367-2.684z"/>
                </svg>
              )}
            </span>
            {!compact && shares > 0 && (
              <span className="engagement-count">{displayFormat(shares)}</span>
            )}
          </button>
          <div className="tooltip">
            Share{!compact && shares > 0 ? ` (${displayFormat(shares)})` : ''}
          </div>
        </div>

        {/* Save Button */}
        <div className="tooltip-container">
          <button 
            className={`engagement-item engagement-btn ${userSaved ? 'saved' : ''} ${savePending ? 'pending' : ''}`}
            onClick={handleSaveClick}
            disabled={savePending}
            aria-label={`${userSaved ? 'Unsave' : 'Save'} this post`}
          >
            <span className={`engagement-icon ${saveAnimation ? 'animate-pulse' : ''}`}>
              {savePending ? (
                <svg width="18" height="18" viewBox="0 0 24 24" className="spinner">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill={userSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              )}
            </span>
            {!compact && saves > 0 && (
              <span className="engagement-count">{displayFormat(saves)}</span>
            )}
          </button>
          <div className="tooltip">
            {userSaved ? 'Unsave' : 'Save'}{!compact && saves > 0 ? ` (${displayFormat(saves)})` : ''}
          </div>
        </div>

        {/* Views */}
        <div className="tooltip-container">
          <div className="engagement-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {!compact && (
              <span className="engagement-count">{displayFormat(views)}</span>
            )}
          </div>
          <div className="tooltip">
            Views{!compact ? ` (${displayFormat(views)})` : `: ${displayFormat(views)}`}
          </div>
        </div>
      </div>
    </div>
  );
}