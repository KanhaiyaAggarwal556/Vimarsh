import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Play,
  Users,
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Twitter,
  Facebook,
  Linkedin,
  Globe,
} from "lucide-react";
import logo from "../../assets/twooter-logo2.png";
import "./login.css"; 
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const navigate = useNavigate();

  const showcaseSlides = [
    {
      type: "feature",
      title: "Connect with the World",
      description:
        "Share your thoughts, discover new perspectives, and build meaningful connections with people from around the globe.",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      stats: [
        { icon: Users, label: "Active Users", value: "2M+" },
        { icon: MessageCircle, label: "Daily Posts", value: "50K+" },
        { icon: Star, label: "User Rating", value: "4.9/5" },
      ],
    },
    {
      type: "video",
      title: "See Twooter in Action",
      description:
        "Watch how our platform brings people together through seamless communication and innovative features.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      features: [
        "Real-time messaging",
        "Smart content discovery",
        "Advanced privacy controls",
        "Cross-platform sync",
      ],
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % showcaseSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setIsSubmitting(false);

    // Redirect to dashboard or home page
    alert("Login successful! Redirecting to dashboard...");
  };

  const handleSocialLogin = (provider) => {
    const socialUrls = {
      Google: "https://yourwebsite.com/auth/google",
      Facebook: "https://yourwebsite.com/auth/facebook",
      LinkedIn: "https://yourwebsite.com/auth/linkedin",
      X: "https://yourwebsite.com/auth/twitter",
    };

    window.open(socialUrls[provider], "_blank");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % showcaseSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + showcaseSlides.length) % showcaseSlides.length
    );
  };
  const handleForgotPassword = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    navigate("/forgotpassword");
  }
  const handleSignup = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    navigate("/signup");
  }
  const currentSlideData = showcaseSlides[currentSlide];

  return (
    <div className="container">
      {/* Main Content */}
      <div className="main-content">
        {/* Left Side - Login Form */}
        <div className="left-side">
          <div className="login-section">
            {/* Logo and Brand */}
            <div className="brand-section">
              <div className="logo">
                <div className="logo-icon">
                  <img
                    src={logo}
                    alt="Twooter Logo"
                    className="rounded-circle"
                    style={{ width: 40, height: 40, objectFit: "cover" }}
                  />
                </div>
                <h1 className="brand-name">Twooter</h1>
              </div>
              <p className="brand-tagline">
                Welcome back to your social universe
              </p>
            </div>

            {/* Login Form */}
            <div className="login-form">
              <h2 className="login-title">Sign In</h2>

              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input password-input ${errors.password ? 'form-input-error' : ''}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox" />
                  <span className="checkbox-text">Remember me</span>
                </label>
                <a onClick = {handleForgotPassword} className="forgot-link">
                  Forgot password?
                </a> 
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`submit-button ${isSubmitting ? 'submit-button-disabled' : ''}`}
              >
                {isSubmitting ? (
                  <div className="loading-content">
                    <div className="spinner"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} className="button-icon" />
                  </>
                )}
              </button>

              {/* Social Login */}
              <div className="social-login-section">
                {/* <div className="or-divider">
                  <span className="or-text">or continue with</span>
                </div> */}
                <div className="social-icons">
                  <button
                    onClick={() => handleSocialLogin("Google")}
                    className="social-icon-button google"
                    title="Continue with Google"
                  >
                    <div className="google-icon">G</div>
                  </button>
                  <button
                    onClick={() => handleSocialLogin("Facebook")}
                    className="social-icon-button facebook"
                    title="Continue with Facebook"
                  >
                    <div className="facebook-icon">f</div>
                  </button>
                  <button
                    onClick={() => handleSocialLogin("LinkedIn")}
                    className="social-icon-button linkedin"
                    title="Continue with LinkedIn"
                  >
                    <div className="linkedin-icon">in</div>
                  </button>
                  <button
                    onClick={() => handleSocialLogin("X")}
                    className="social-icon-button x"
                    title="Continue with X"
                  >
                    <div className="x-icon">𝕏</div>
                  </button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="signup-prompt">
                <p className="signup-text">
                  Don't have an account?{" "}
                  <button onClick = {handleSignup} className="signup-link">
                    Create one now
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Showcase */}
        <div className="right-side">
          <div className="showcase-container">
            {/* Slide Navigation */}
            <div className="slide-navigation">
              <button onClick={prevSlide} className="nav-button">
                <ChevronLeft size={24} />
              </button>
              <div className="slide-indicators">
                {showcaseSlides.map((_, index) => (
                  <div
                    key={index}
                    className={`slide-indicator ${index === currentSlide ? 'slide-indicator-active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
              <button onClick={nextSlide} className="nav-button">
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Slide Content */}
            <div className="slide-content">
              {currentSlideData.type === "feature" ? (
                <div className="feature-slide">
                  <div className="feature-image">
                    <img
                      src={currentSlideData.image}
                      alt="Feature showcase"
                      className="showcase-image"
                    />
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <h3 className="feature-title">
                          {currentSlideData.title}
                        </h3>
                        <p className="feature-description">
                          {currentSlideData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="stats-container">
                    {currentSlideData.stats.map((stat, index) => (
                      <div key={index} className="stat-item">
                        <stat.icon size={24} className="stat-icon" />
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
                      <div className="video-placeholder">
                        <img
                          src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=450&fit=crop"
                          alt="Video thumbnail"
                          className="video-thumbnail"
                        />
                        <button
                          onClick={() => setIsVideoPlaying(true)}
                          className="play-button"
                        >
                          <Play size={40} />
                        </button>
                      </div>
                    ) : (
                      <iframe
                        src={currentSlideData.videoUrl}
                        className="video-frame"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
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
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">T</div>
                <span className="footer-brand-name">Twooter</span>
              </div>
              <p className="footer-brand-description">
                Connecting minds, sharing stories, building communities.
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-list">
              <li>
                <a href="#" className="footer-link">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-list">
              <li>
                <a href="#" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Press
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-list">
              <li>
                <a href="#" className="footer-link">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link">
                <Linkedin size={20} />
              </a>
              <a href="#" className="social-link">
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 Twooter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}