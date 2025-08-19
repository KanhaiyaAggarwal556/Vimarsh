import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color,
  className = '' 
}) => {
  const sizeClass = `loading-spinner ${size}`;
  const combinedClassName = `${sizeClass} ${className}`.trim();
  
  const style = color ? { borderTopColor: color } : {};

  return (
    <div 
      className={combinedClassName}
      style={style}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;