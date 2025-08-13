import { useCallback } from "react";

// ShareAndViewCounter component props interface
interface ShareAndViewCounterProps {
  views?: number;
  shareAnimation?: boolean;
  onShare: () => void;
  compact?: boolean;
  formatCount?: (count: number) => string;
}

// ShareAndViewCounter Component (Save button removed)
export default function ShareAndViewCounter({
  views = 0,
  shareAnimation = false,
  onShare,
  compact = false,
  formatCount,
}: ShareAndViewCounterProps) {
  
  const handleShareClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (onShare) {
        onShare();
      }
    },
    [onShare]
  );

  const defaultFormatCount = useCallback((count: number) => {
    if (count === 0) return "0";
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  }, []);

  const displayFormat = formatCount || defaultFormatCount;

  return (
    <div className={`save-views-container ${compact ? "compact" : ""}`}>
      <div className="engagement-actions">
        {/* Share Button */}
        <div className="tooltip-container">
          <button
            className="engagement-btn"
            onClick={handleShareClick}
            aria-label="Share this post"
          >
            <span
              className={`engagement-icon ${
                shareAnimation ? "animate-wobble" : ""
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </span>
            {!compact && <span className="action-text">Share</span>}
          </button>
          <div className="tooltip">Share post</div>
        </div>

        {/* Views Counter */}
        <div className="tooltip-container">
          <div className="engagement-item">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="engagement-count">{displayFormat(views)}</span>
          </div>
          <div className="tooltip">{displayFormat(views)} views</div>
        </div>
      </div>
    </div>
  );
}