  import React from 'react';

  const FeatureGrid = ({ 
    features, 
    isMobile, 
    onFeatureClick 
  }) => {
    if (isMobile) {
      return (
        <div className="mobile-features-container">
          <div className="mobile-features-grid">
            {features.map((feature) => (
              <button
                key={feature.id}
                className="mobile-feature-item clickable-item"
                onClick={() => onFeatureClick(feature)}
              >
                <div 
                  className="mobile-feature-background"
                  style={{
                    backgroundImage: `url(${feature.background})`,
                  }}
                ></div>
                <div className={`mobile-feature-gradient bg-gradient-to-br ${feature.gradient}`}></div>
                <div className="feature-item-icon">
                  <feature.icon size={16} />
                </div>
                <div className="feature-item-content">
                  <span className="feature-item-title">{feature.name}</span>
                  <span className="feature-item-desc">{feature.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="features-grid">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="feature-card"
            onClick={() => onFeatureClick(feature)}
          >
            <div 
              className="card-background"
              style={{
                backgroundImage: `url(${feature.background})`,
              }}
            ></div>
            <div className={`card-gradient bg-gradient-to-br ${feature.gradient}`}></div>
            <div className="card-content">
              <div className="card-icon">
                <feature.icon size={18} />
              </div>
              <h3 className="card-title"a>{feature.name}</h3>
            </div>
            <div className="card-shimmer"></div>
          </div>
        ))}
      </div>
    );
  };

  export default FeatureGrid;