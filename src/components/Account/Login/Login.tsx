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
  LucideIcon,
  X,
  AtSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@store/useAuthStore"; // Import the Zustand store
import logo from "../../../assets/Vimarsh-logo2.png";
import "./login.css";

interface FormData {
  emailOrUsername: string;
  password: string;
}

interface FormErrors {
  emailOrUsername?: string;
  password?: string;
}

interface LoginData {
  emailOrUsername: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

interface Stat {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface FeatureSlide {
  type: "feature";
  title: string;
  description: string;
  image: string;
  stats: Stat[];
}

interface VideoSlide {
  type: "video";
  title: string;
  description: string;
  videoUrl: string;
  features: string[];
}

type ShowcaseSlide = FeatureSlide | VideoSlide;
type SocialProvider = "Google" | "Facebook" | "LinkedIn" | "X";

// API Functions
const loginUser = async (userData: LoginData): Promise<ApiResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for JWT tokens
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to login");
  }

  return data;
};

export default function Login(): JSX.Element {
  const navigate = useNavigate();

  // Get the setCurrentUser function from Zustand store
  const { setCurrentUser } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    emailOrUsername: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  const showcaseSlides: ShowcaseSlide[] = [
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
      title: "See Vimarsh in Action",
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
  }, [showcaseSlides.length]);

  // TanStack Query mutation for login
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // console.log("Login successful:", data);

      // Store user data in Zustand store
      if (data.data && data.data.user) {
        setCurrentUser(data.data.user);
      } else if (data.data) {
        // In case the user data is directly in data object
        setCurrentUser(data.data);
      } else {
        // Fallback: store the entire response data
        setCurrentUser(data);
      }

      // Navigate to home page after successful login
      navigate("/home");
    },
    onError: (error: Error) => {
      console.error("Login failed:", error);
      // Set form errors
      setErrors({ emailOrUsername: error.message });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Email or username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    // Prepare data for API call
    const loginData: LoginData = {
      emailOrUsername: formData.emailOrUsername,
      password: formData.password,
    };

    // Use TanStack Query mutation
    loginMutation.mutate(loginData);
  };

  // Updated handleSocialLogin function
  const handleSocialLogin = (provider: SocialProvider): void => {
    // OAuth URLs that redirect to your backend
    const socialUrls: Record<SocialProvider, string> = {
      Google: `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
      Facebook: `${import.meta.env.VITE_API_BASE_URL}/auth/facebook`,
      LinkedIn: `${import.meta.env.VITE_API_BASE_URL}/auth/linkedin`,
      X: `${import.meta.env.VITE_API_BASE_URL}/auth/twitter`, // Will be implemented later
    };

    // Store current URL to return after social login
    sessionStorage.setItem("socialLoginReturn", window.location.href);

    // Redirect to OAuth provider
    window.location.href = socialUrls[provider];
  };

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % showcaseSlides.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide(
      (prev) => (prev - 1 + showcaseSlides.length) % showcaseSlides.length
    );
  };

  const handleForgotPassword = (
    e: React.MouseEvent<HTMLAnchorElement>
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/i/account/forgotpassword");
  };

  const handleSignup = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/i/account/signup");
  };

  // Helper function to determine if input looks like email
  const isEmailFormat = (input: string): boolean => {
    return /\S+@\S+\.\S+/.test(input);
  };

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
                  <img src={logo} alt="Vimarsh Logo" className="logo-image" />
                </div>
                <h1 className="brand-name">Vimarsh</h1>
              </div>
              <p className="brand-tagline">
                Welcome back to your social universe
              </p>
            </div>

            {/* Login Form */}
            <div className="login-form">
              <h2 className="login-title">Sign In</h2>

              {/* Email or Username Field */}
              <div className="form-group">
                <label className="form-label">Email or Username</label>
                <div className="input-wrapper">
                  {isEmailFormat(formData.emailOrUsername) ? (
                    <Mail className="input-icon" />
                  ) : (
                    <AtSign className="input-icon" />
                  )}
                  <input
                    type="text"
                    name="emailOrUsername"
                    value={formData.emailOrUsername}
                    onChange={handleChange}
                    className={`form-input ${
                      errors.emailOrUsername ? "form-input-error" : ""
                    }`}
                    placeholder="Enter your email or username"
                  />
                </div>
                {errors.emailOrUsername && (
                  <div className="error-message">
                    <X className="error-icon" />
                    {errors.emailOrUsername}
                  </div>
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
                    className={`form-input password-input ${
                      errors.password ? "form-input-error" : ""
                    }`}
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
                  <div className="error-message">
                    <X className="error-icon" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox" />
                  <span className="checkbox-text">Remember me</span>
                </label>
                <a onClick={handleForgotPassword} className="forgot-link">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loginMutation.isPending}
                className={`submit-button ${
                  loginMutation.isPending ? "submit-button-disabled" : ""
                }`}
              >
                {loginMutation.isPending ? (
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

              {/* Social Login Section */}
              <div className="social-login-section">
                <div className="or-divider">
                  <span className="or-text">or</span>
                </div>
                <div className="social-icons">
                  <button
                    onClick={() => handleSocialLogin("Google")}
                    className="social-icon-button social-google"
                    title="Continue with Google"
                    type="button"
                  >
                    <div className="social-icon google-icon">G</div>
                  </button>
                  <button
                    onClick={() => handleSocialLogin("Facebook")}
                    className="social-icon-button social-facebook"
                    title="Continue with Facebook"
                    type="button"
                  >
                    <div className="social-icon facebook-icon">f</div>
                  </button>
                  <button
                    onClick={() => handleSocialLogin("LinkedIn")}
                    className="social-icon-button social-linkedin"
                    title="Continue with LinkedIn"
                    type="button"
                  >
                    <div className="social-icon linkedin-icon">in</div>
                  </button>
                  <button
                    onClick={() => alert("Twitter OAuth coming soon!")}
                    className="social-icon-button social-x"
                    title="Continue with X (Coming Soon)"
                    type="button"
                    disabled
                  >
                    <div className="social-icon x-icon">𝕏</div>
                  </button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="signup-prompt">
                <p className="signup-text">
                  Don't have an account?{" "}
                  <a onClick={handleSignup} className="signup-link">
                    Create one now
                  </a>
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
                    className={`slide-indicator ${
                      index === currentSlide ? "slide-indicator-active" : ""
                    }`}
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
                <div className="footer-logo-icon">
                  <img
                    src={logo}
                    alt="Vimarsh Logo"
                    className="footer-logo-image"
                  />
                </div>
                <span className="footer-brand-name">Vimarsh</span>
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
            © 2024 Vimarsh. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
