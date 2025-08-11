import "../style/ViewsCounter.css";

interface ViewsCounterProps {
  views?: number;
}

export default function ViewsCounter({ views = 0 }: ViewsCounterProps) {
  // Format large numbers for better readability
  const formatViews = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    if (count < 1000000000) return `${(count / 1000000).toFixed(1)}M`;
    return `${(count / 1000000000).toFixed(1)}B`;
  };

  return (
    <div className="post-views" title={`${views.toLocaleString()} views`}>
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      <small>{formatViews(views)}</small>
    </div>
  );
}

export type { ViewsCounterProps };