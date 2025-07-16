import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../style/PostContent.css";

export default function PostContent({ post }) {
  const [isAdditionalMediaExpanded, setIsAdditionalMediaExpanded] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the post page
  const isPostPage = location.pathname.includes('/status/');

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleAdditionalMedia = () => {
    setIsAdditionalMediaExpanded(!isAdditionalMediaExpanded);
  };

  // Handle navigation to post page - FIXED: Don't navigate if already on post page
  const handlePostClick = () => {
    if (!isPostPage) {
      navigate(`/${post.userId}/status/${post.id}`);
    }
    // If we're already on the post page, do nothing
  };

  // Handle navigation to specific photo
  // const handlePhotoClick = (photoIndex, e) => {
  //   e.stopPropagation(); // Prevent post click event
  //   if (!isPostPage) {
  //     navigate(`/${post.userId}/status/${post.id}/photo/${photoIndex + 1}`);
  //   }
  // };

  // Handle navigation to tag search
  const handleTagClick = (tagName, e) => {
    e.stopPropagation(); // Prevent post click event
    navigate(`/search?q=${encodeURIComponent(`#${tagName}`)}`);
  };

  // Navigation functions for carousel
  const goToPrevious = (e) => {
    e.stopPropagation();
    const allMedia = getAllMedia();
    setCurrentMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    const allMedia = getAllMedia();
    setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
  };

  // Get all media items combined
  const getAllMedia = () => {
    const hasImages = post.images && post.images.length > 0;
    const hasVideos = post.videos && post.videos.length > 0;

    if (!hasImages && !hasVideos) return [];

    const allMedia = [];
    let imageIndex = 0;
    
    if (hasImages) {
      post.images.forEach((imageUrl, index) => {
        allMedia.push({
          type: 'image',
          url: imageUrl,
          key: `image-${index}`,
          imageIndex: imageIndex++
        });
      });
    }

    if (hasVideos) {
      post.videos.forEach((videoUrl, index) => {
        allMedia.push({
          type: 'video',
          url: videoUrl,
          key: `video-${index}`,
          imageIndex: null
        });
      });
    }

    return allMedia;
  };

  // Reset carousel when changing posts
  useEffect(() => {
    setCurrentMediaIndex(0);
  }, [post.id]);

  const renderMediaCarousel = () => {
    const allMedia = getAllMedia();
    if (allMedia.length === 0) return null;

    return (
      <div className="post-media">
        <div className="post-media-carousel">
          <div className="post-media-carousel-container">
            {/* Navigation buttons */}
            {allMedia.length > 1 && (
              <>
                {/* Previous button - only show if not on first media */}
                {currentMediaIndex > 0 && (
                  <button
                    className="post-media-nav-btn post-media-nav-prev"
                    onClick={goToPrevious}
                    aria-label="Previous media"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                
                {/* Next button - only show if not on last media */}
                {currentMediaIndex < allMedia.length - 1 && (
                  <button
                    className="post-media-nav-btn post-media-nav-next"
                    onClick={goToNext}
                    aria-label="Next media"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </>
            )}

            {/* Media slider */}
            <div 
              className="post-media-carousel-slider"
              style={{ 
                transform: `translateX(-${currentMediaIndex * 100}%)`,
                transition: 'transform 0.3s ease-in-out'
              }}
            >
              {allMedia.map((media, index) => (
                <div key={media.key} className="post-media-carousel-item">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={`Media ${index + 1} of ${allMedia.length}`}
                      className="post-media-carousel-content post-image"
                      loading="lazy"
                      // onClick={(e) => handlePhotoClick(media.imageIndex, e)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="post-media-carousel-content post-video"
                      controls
                      preload="metadata"
                      onClick={(e) => e.stopPropagation()}
                      onPlay={(e) => e.stopPropagation()}
                      onPause={(e) => e.stopPropagation()}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Media counter */}
          {allMedia.length > 1 && (
            <div className="post-media-counter">
              <span>{currentMediaIndex + 1} / {allMedia.length}</span>
            </div>
          )}

          {/* Dots indicator */}
          {allMedia.length > 1 && (
            <div className="post-media-dots">
              {allMedia.map((_, index) => (
                <button
                  key={index}
                  className={`post-media-dot ${index === currentMediaIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentMediaIndex(index);
                  }}
                  aria-label={`Go to media ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMediaGrid = () => {
    const hasImages = post.images && post.images.length > 0;
    const hasVideos = post.videos && post.videos.length > 0;

    if (!hasImages && !hasVideos) return null;

    // Combine all media items into a single array with proper indexing
    const allMedia = [];
    let imageIndex = 0;
    
    if (hasImages) {
      post.images.forEach((imageUrl, index) => {
        allMedia.push({
          type: 'image',
          url: imageUrl,
          key: `image-${index}`,
          imageIndex: imageIndex++
        });
      });
    }

    if (hasVideos) {
      post.videos.forEach((videoUrl, index) => {
        allMedia.push({
          type: 'video',
          url: videoUrl,
          key: `video-${index}`,
          imageIndex: null // Videos don't have image index
        });
      });
    }

    // Split media into grid items (max 4) and scrollable items
    const gridMedia = allMedia.slice(0, 4);
    const scrollableMedia = allMedia.slice(4);

    // Enhanced grid class logic with max 4 items
    const getGridClass = (count) => {
      if (count === 1) return 'post-media-grid-1';
      if (count === 2) return 'post-media-grid-2';
      if (count === 3) return 'post-media-grid-3-custom'; // Custom 3-item layout
      if (count === 4) return 'post-media-grid-4';
      return 'post-media-grid-4'; // Fallback for any edge cases
    };

    return (
      <div className="post-media">
        {/* Main grid for up to 4 items */}
        <div className={`post-media-grid ${getGridClass(gridMedia.length)}`}>
          {gridMedia.map((media, index) => (
            <div key={media.key} className="post-media-item">
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt={`Post media ${index + 1}`}
                  className="post-media-content post-image"
                  loading="lazy"
                  // onClick={(e) => handlePhotoClick(media.imageIndex, e)}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <video
                  src={media.url}
                  className="post-media-content post-video"
                  controls
                  preload="metadata"
                  onClick={(e) => e.stopPropagation()} // Prevent post click, only video controls work
                  onPlay={(e) => e.stopPropagation()} // Prevent post click on play
                  onPause={(e) => e.stopPropagation()} // Prevent post click on pause
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>

        {/* Scrollable section for additional media */}
        {scrollableMedia.length > 0 && (
          <div className="post-media-scroll">
            <div 
              className="post-media-scroll-header" 
              onClick={(e) => {
                e.stopPropagation(); // Prevent post navigation
                toggleAdditionalMedia();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation(); // Prevent post navigation
                  toggleAdditionalMedia();
                }
              }}
              aria-expanded={isAdditionalMediaExpanded}
              aria-controls="additional-media-content"
            >
              <span className="post-media-scroll-title">
                Additional Media ({scrollableMedia.length})
              </span>
              {isAdditionalMediaExpanded ? (
                <ChevronUp size={16} color="#adb5bd" />
              ) : (
                <ChevronDown size={16} color="#adb5bd" />
              )}
            </div>
            <div 
              id="additional-media-content"
              className={`post-media-scroll-container ${isAdditionalMediaExpanded ? 'expanded' : ''}`}
            >
              {scrollableMedia.map((media, index) => (
                <div key={media.key} className="post-media-scroll-item">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={`Additional media ${index + 1}`}
                      className="post-media-scroll-content"
                      loading="lazy"
                      // onClick={(e) => handlePhotoClick(media.imageIndex, e)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="post-media-scroll-content"
                      controls
                      preload="metadata"
                      onClick={(e) => e.stopPropagation()} // Prevent post click, only video controls work
                      onPlay={(e) => e.stopPropagation()} // Prevent post click on play
                      onPause={(e) => e.stopPropagation()} // Prevent post click on pause
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTags = () => {
    if (!post.tags || post.tags.length === 0) return null;

    return (
      <div className="post-tags">
        {post.tags.map((tag, index) => (
          <span 
            key={index} 
            className="post-tag"
            onClick={(e) => handleTagClick(tag, e)}
            style={{ cursor: 'pointer' }}
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="post-content" 
      onClick={isPostPage ? undefined : handlePostClick}
      style={{ cursor: isPostPage ? 'default' : 'pointer' }}
    >
      <h5 className="post-title">{post.title}</h5>
      <p className="post-body" style={{color: '#000', backgroundColor: '#fff'}}>{post.body}</p>
      
      {/* Always use carousel on mobile, or on post pages. Use grid on desktop for non-post pages */}
      {(isPostPage || isMobile) ? renderMediaCarousel() : renderMediaGrid()}
      {renderTags()}
    </div>
  );
}