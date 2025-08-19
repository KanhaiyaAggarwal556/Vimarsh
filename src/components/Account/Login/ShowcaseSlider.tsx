import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  TrendingUp,
  type LucideIcon
} from "lucide-react";
import "./styles/ShowcaseSlider.css";

// Type definitions
interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

interface FeatureSlide {
  type: "feature";
  title: string;
  description: string;
  image: string;
  stats: StatItem[];
}

interface VideoSlide {
  type: "video";
  title: string;
  description: string;
  videoUrl: string;
  features: string[];
}

type SlideData = FeatureSlide | VideoSlide;

// Social media app mock data
const socialMediaSlides: SlideData[] = [
  {
    type: "feature",
    title: "Connect & Share Moments",
    description: "Share your life's best moments with friends and family through photos, videos, and stories that matter.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    stats: [
      { icon: Users, value: "2M+", label: "Active Users" },
      { icon: MessageCircle, value: "50M+", label: "Messages Daily" },
      { icon: Heart, value: "100M+", label: "Likes Per Day" }
    ]
  },
  {
    type: "video",
    title: "Social Media App Demo",
    description: "Experience the future of social networking with our intuitive interface and powerful features.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    features: [
      "Real-time messaging and video calls",
      "AI-powered content recommendations",
      "Advanced privacy and security controls",
      "Cross-platform synchronization"
    ]
  },
  {
    type: "feature",
    title: "Discover & Engage",
    description: "Find trending content, connect with influencers, and build your community with powerful engagement tools.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    stats: [
      { icon: Eye, value: "500M+", label: "Daily Views" },
      { icon: Share2, value: "10M+", label: "Shares Daily" },
      { icon: TrendingUp, value: "95%", label: "User Retention" }
    ]
  },
  {
    type: "feature",
    title: "Stories & Live Streaming",
    description: "Share ephemeral moments with Stories and broadcast live to your followers in real-time.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop",
    stats: [
      { icon: Users, value: "1M+", label: "Daily Stories" },
      { icon: Eye, value: "50K+", label: "Live Streams" },
      { icon: Heart, value: "200M+", label: "Story Views" }
    ]
  }
];

const ShowcaseSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  const slides = socialMediaSlides;

  // Auto-slide functionality (paused when video is playing)
  useEffect(() => {
    if (!isVideoPlaying && slides.length > 1) {
      autoSlideRef.current = setInterval(() => {
        handleNextSlide();
      }, 5000);
    } else {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
        autoSlideRef.current = null;
      }
    }

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
        autoSlideRef.current = null;
      }
    };
  }, [isVideoPlaying, currentSlide]);

  // Stop video when slide changes
  useEffect(() => {
    if (slides[currentSlide]?.type !== "video") {
      setIsVideoPlaying(false);
    }
  }, [currentSlide]);

  const handleSlideTransition = (callback: () => void) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setIsVideoPlaying(false); // Stop video during transition
    
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevSlide = () => {
    handleSlideTransition(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    });
  };

  const handleNextSlide = () => {
    handleSlideTransition(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    });
  };

  const handleSlideChange = (index: number) => {
    if (index === currentSlide || isTransitioning) return;
    
    handleSlideTransition(() => {
      setCurrentSlide(index);
    });
  };

  const handleVideoToggle = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="showcase-container">
      {/* Slide Navigation */}
      <div className="slide-navigation">
        <button 
          onClick={handlePrevSlide} 
          className="nav-button"
          disabled={isTransitioning}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`slide-indicator ${
                index === currentSlide ? "slide-indicator-active" : ""
              }`}
              onClick={() => handleSlideChange(index)}
              role="button"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={handleNextSlide} 
          className="nav-button"
          disabled={isTransitioning}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Slide Content */}
      <div className={`slide-content ${isTransitioning ? 'transitioning' : ''}`}>
        {currentSlideData.type === "feature" ? (
          <div className="feature-slide">
            <div className="feature-image">
              <img
                src={currentSlideData.image}
                alt="Social media feature showcase"
                className="showcase-image"
                loading="lazy"
              />
              <div className="image-overlay">
                <div className="overlay-content">
                  <h3 className="feature-title">{currentSlideData.title}</h3>
                  <p className="feature-description">
                    {currentSlideData.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="stats-container">
              {currentSlideData.stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <stat.icon size={20} className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="video-slide">
            <div className="video-container">
              {!isVideoPlaying ? (
                <div className="video-placeholder" onClick={handleVideoToggle}>
                  <img
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop"
                    alt="Social media app demo video thumbnail"
                    className="video-thumbnail"
                    loading="lazy"
                  />
                  <button className="play-button" aria-label="Play demo video">
                    <Play size={24} fill="currentColor" />
                  </button>
                </div>
              ) : (
                <div className="video-wrapper">
                  <iframe
                    ref={videoRef}
                    src={`${currentSlideData.videoUrl}?autoplay=1`}
                    className="video-frame"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    title="Social Media App Demo Video"
                    loading="lazy"
                  />
                  <button 
                    className="video-control-button"
                    onClick={handleVideoToggle}
                    aria-label="Stop video"
                  >
                    <Pause size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="video-info">
              <h3 className="video-title">{currentSlideData.title}</h3>
              <p className="video-description">
                {currentSlideData.description}
              </p>
              <div className="features-list">
                {currentSlideData.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="feature-bullet"></div>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowcaseSlider;