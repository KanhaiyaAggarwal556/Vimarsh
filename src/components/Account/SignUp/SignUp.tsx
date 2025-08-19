import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, Check, X, AtSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@store/useAuthStore";
import logo from "../../../assets/Vimarsh-logo2.png";
import "./SignUp.css";

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface EmailValidation {
  isChecking: boolean;
  isValid: boolean | null;
  message: string;
}

interface UsernameValidation {
  isChecking: boolean;
  isValid: boolean | null;
  message: string;
}

interface PasswordStrength {
  strength: number;
  label: string;
  className: string;
}

interface SignupData {
  fullName: string;
  userName: string;
  email: string;
  password: string;
}


type SocialProvider = "Google" | "Facebook" | "LinkedIn" | "X";



const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/email/${encodeURIComponent(email)}/availability`,
      {
        credentials: 'include',
      }
    );
    
    if (response.status === 404) {
      // Email not found means it's available
      return true;
    } else if (response.ok) {
      // Email found means it's taken
      return false;
    } else {
      throw new Error("Failed to check email availability");
    }
  } catch (error) {
    console.error('Email availability check error:', error);
    throw error;
  }
};

const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/username/${encodeURIComponent(username)}/availability`,
      {
        credentials: 'include',
      }
    );
    
    if (response.status === 404) {
      // Username not found means it's available
      return true;
    } else if (response.ok) {
      // Username found means it's taken
      return false;
    } else {
      throw new Error("Failed to check username availability");
    }
  } catch (error) {
    console.error('Username availability check error:', error);
    throw error;
  }
};


export default function SignUp(): JSX.Element {
  const navigate = useNavigate();

  // Get Zustand store actions - Updated to use register function
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [emailValidation, setEmailValidation] = useState<EmailValidation>({
    isChecking: false,
    isValid: null,
    message: "",
  });
  const [usernameValidation, setUsernameValidation] = useState<UsernameValidation>({
    isChecking: false,
    isValid: null,
    message: "",
  });

  // Check for social login completion
  useEffect(() => {
    const checkSocialLoginCompletion = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hasError = urlParams.get("error");
      
      if (hasError) {
        console.error("Social login error:", hasError);
        // Set appropriate error message based on the error type
        const errorMessages: Record<string, string> = {
          'google_auth_failed': 'Google authentication failed. Please try again.',
          'facebook_auth_failed': 'Facebook authentication failed. Please try again.',
          'linkedin_auth_failed': 'LinkedIn authentication failed. Please try again.',
          'oauth_no_user': 'Social login failed. Please try again.',
          'oauth_error': 'Authentication error occurred. Please try again.'
        };
        
        const errorMessage = errorMessages[hasError] || 'Authentication failed. Please try again.';
        setErrors({ email: errorMessage });
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // If no error in URL params, user might have been authenticated
      // The backend should have set cookies, so we can check auth status
      // This is handled by the useAuthStore initialization
    };

    checkSocialLoginCompletion();
  }, [navigate]);

  // Use Zustand register function instead of TanStack Query
  const handleSignup = async (userData: SignupData) => {
    try {
      const result = await register(userData);
      
      if (result.success && result.user) {
        console.log("Signup successful:", result);
        // Navigate to home page after successful signup
        navigate("/home");
      } else {
        // Handle signup error
        setErrors({ email: result.message || "Signup failed" });
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setErrors({ email: "An unexpected error occurred. Please try again." });
    }
  };

  const validateEmail = async (email: string): Promise<boolean> => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailValidation({
        isChecking: false,
        isValid: false,
        message: "Invalid email format",
      });
      return false;
    }

    setEmailValidation({
      isChecking: true,
      isValid: null,
      message: "Checking email availability...",
    });

    try {
      const isAvailable = await checkEmailAvailability(email);

      if (isAvailable) {
        setEmailValidation({
          isChecking: false,
          isValid: true,
          message: "Email is available",
        });
        return true;
      } else {
        setEmailValidation({
          isChecking: false,
          isValid: false,
          message: "Email is already taken",
        });
        return false;
      }
    } catch (error) {
      console.error("Email validation error:", error);
      setEmailValidation({
        isChecking: false,
        isValid: false,
        message: "Unable to verify email",
      });
      return false;
    }
  };

  const validateUsername = async (username: string): Promise<boolean> => {
    if (!username || username.length < 3) {
      setUsernameValidation({
        isChecking: false,
        isValid: false,
        message: "Username must be at least 3 characters",
      });
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameValidation({
        isChecking: false,
        isValid: false,
        message: "Only letters, numbers, and underscores allowed",
      });
      return false;
    }

    setUsernameValidation({
      isChecking: true,
      isValid: null,
      message: "Checking availability...",
    });

    try {
      const isAvailable = await checkUsernameAvailability(username);

      if (isAvailable) {
        setUsernameValidation({
          isChecking: false,
          isValid: true,
          message: "Username is available",
        });
        return true;
      } else {
        setUsernameValidation({
          isChecking: false,
          isValid: false,
          message: "Username is already taken",
        });
        return false;
      }
    } catch (error) {
      console.error("Username validation error:", error);
      setUsernameValidation({
        isChecking: false,
        isValid: false,
        message: "Unable to check username",
      });
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation - updated to match backend requirements
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Only letters, numbers, and underscores allowed";
    } else if (usernameValidation.isValid === false) {
      newErrors.username = "Please choose a different username";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    } else if (emailValidation.isValid === false) {
      newErrors.email = "Please use a different email address";
    }

    // Password validation - updated to match backend requirements
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one letter and one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear existing error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Validate email on change with debouncing
    if (name === "email") {
      setEmailValidation({ isChecking: false, isValid: null, message: "" });
      clearTimeout((window as any).emailTimeout);
      (window as any).emailTimeout = setTimeout(() => {
        if (value.trim() && /\S+@\S+\.\S+/.test(value)) {
          validateEmail(value.trim().toLowerCase());
        }
      }, 1000);
    }

    // Validate username on change with debouncing
    if (name === "username") {
      setUsernameValidation({ isChecking: false, isValid: null, message: "" });
      clearTimeout((window as any).usernameTimeout);
      (window as any).usernameTimeout = setTimeout(() => {
        if (value.trim() && value.length >= 3 && /^[a-zA-Z0-9_]+$/.test(value)) {
          validateUsername(value.trim());
        }
      }, 800);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    // Prepare data for API call - matching backend expectations
    const signupData: SignupData = {
      fullName: formData.name.trim(),
      userName: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    // Use the handleSignup function which uses Zustand store
    await handleSignup(signupData);
  };

  // Updated handleSocialLogin function
  const handleSocialLogin = (provider: SocialProvider): void => {
    // Updated OAuth URLs to match backend routes
    const socialUrls: Record<SocialProvider, string> = {
      Google: `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
      Facebook: `${import.meta.env.VITE_API_BASE_URL}/auth/facebook`,
      LinkedIn: `${import.meta.env.VITE_API_BASE_URL}/auth/linkedin`,
      X: `${import.meta.env.VITE_API_BASE_URL}/auth/twitter`, // Note: backend uses 'twitter'
    };

    // Store current URL for potential redirect back
    sessionStorage.setItem('preAuthUrl', window.location.pathname);

    // Redirect to OAuth provider
    window.location.href = socialUrls[provider];
  };

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { strength: 0, label: "", className: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-zA-Z]/.test(password) && /\d/.test(password)) strength++;
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ["Too Weak", "Weak", "Good", "Strong"];
    const classNames = ["too-weak", "weak", "good", "strong"];

    return {
      strength,
      label: labels[strength - 1] || "",
      className: classNames[strength - 1] || "",
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        {/* Logo and Brand */}
        <div className="brand-section">
          <div className="logo">
            <div className="logo-icon">
              <img src={logo} alt="Vimarsh Logo" className="logo-image" />
            </div>
            <h1 className="brand-name">Vimarsh</h1>
          </div>
          <p className="brand-tagline">Your gateway to endless possibilities</p>
        </div>

        <div className="signup-form">
          {/* Display general error message */}
          {errors.email && !formData.email && (
            <div className="error-message general-error">
              <X className="error-icon" />
              {errors.email}
            </div>
          )}

          {/* Name Field */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? "form-input-error" : ""}`}
                placeholder="Enter your full name"
                maxLength={100} // Add reasonable limits
              />
            </div>
            {errors.name && (
              <div className="error-message">
                <X className="error-icon" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <AtSign className="input-icon" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? "form-input-error" : ""} ${
                  usernameValidation.isValid === true ? "form-input-valid" : ""
                }`}
                placeholder="Choose a username"
                maxLength={30}
              />
              {usernameValidation.isChecking && (
                <div className="validation-icon">
                  <div className="spinner-small"></div>
                </div>
              )}
              {usernameValidation.isValid === true && !usernameValidation.isChecking && (
                <div className="validation-icon">
                  <Check size={16} color="#198754" />
                </div>
              )}
              {usernameValidation.isValid === false && !usernameValidation.isChecking && (
                <div className="validation-icon">
                  <X size={16} color="#dc3545" />
                </div>
              )}
            </div>
            {usernameValidation.message && (
              <div
                className={`validation-message ${
                  usernameValidation.isValid === true
                    ? "validation-success"
                    : usernameValidation.isValid === false
                    ? "validation-error"
                    : "validation-checking"
                }`}
              >
                {usernameValidation.message}
              </div>
            )}
            {errors.username && (
              <div className="error-message">
                <X className="error-icon" />
                {errors.username}
              </div>
            )}
          </div>

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
                className={`form-input ${errors.email && formData.email ? "form-input-error" : ""} ${
                  emailValidation.isValid === true ? "form-input-valid" : ""
                }`}
                placeholder="Enter your email"
                maxLength={100}
              />
              {emailValidation.isChecking && (
                <div className="validation-icon">
                  <div className="spinner-small"></div>
                </div>
              )}
              {emailValidation.isValid === true && !emailValidation.isChecking && (
                <div className="validation-icon">
                  <Check size={16} color="#198754" />
                </div>
              )}
              {emailValidation.isValid === false && !emailValidation.isChecking && (
                <div className="validation-icon">
                  <X size={16} color="#dc3545" />
                </div>
              )}
            </div>
            {emailValidation.message && (
              <div
                className={`validation-message ${
                  emailValidation.isValid === true
                    ? "validation-success"
                    : emailValidation.isValid === false
                    ? "validation-error"
                    : "validation-checking"
                }`}
              >
                {emailValidation.message}
              </div>
            )}
            {errors.email && formData.email && (
              <div className="error-message">
                <X className="error-icon" />
                {errors.email}
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
                placeholder="Create a password"
                maxLength={128}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`strength-bar strength-bar-${passwordStrength.className} ${
                        i < passwordStrength.strength ? "strength-bar-active" : ""
                      }`}
                    />
                  ))}
                </div>
                <p className="strength-label">Strength: {passwordStrength.label}</p>
              </div>
            )}

            {errors.password && (
              <div className="error-message">
                <X className="error-icon" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input password-input ${
                  errors.confirmPassword ? "form-input-error" : ""
                }`}
                placeholder="Confirm your password"
                maxLength={128}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-message">
                <X className="error-icon" />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`submit-button ${isLoading ? "submit-button-disabled" : ""}`}
          >
            {isLoading ? (
              <div className="loading-content">
                <div className="spinner"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
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
                disabled={isLoading}
              >
                <div className="social-icon google-icon">G</div>
              </button>
              <button
                onClick={() => handleSocialLogin("Facebook")}
                className="social-icon-button social-facebook"
                title="Continue with Facebook"
                type="button"
                disabled={isLoading}
              >
                <div className="social-icon facebook-icon">f</div>
              </button>
              <button
                onClick={() => handleSocialLogin("LinkedIn")}
                className="social-icon-button social-linkedin"
                title="Continue with LinkedIn"
                type="button"
                disabled={isLoading}
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

          {/* Footer */}
          <div className="signup-footer">
            <p className="footer-text">
              Already have an account?{" "}
              <a href="/i/account/login" className="signin-link">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}