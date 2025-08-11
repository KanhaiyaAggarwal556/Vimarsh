import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, Check, X, AtSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@store/useAuthStore"; // Add this import
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

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

type SocialProvider = "Google" | "Facebook" | "LinkedIn" | "X";

// API Functions
const checkEmailAvailability = async (email: string): Promise<boolean> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/users/email/${encodeURIComponent(
      email
    )}`
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
};

const checkUsernameAvailability = async (
  username: string
): Promise<boolean> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/users/username/${encodeURIComponent(
      username
    )}`
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
};

const createUser = async (userData: SignupData): Promise<ApiResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/users/auth/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create user");
  }

  return data;
};

const createBoard = async (userId: string): Promise<ApiResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/boards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      bio: "",
      location: "",
      website: "",
      socialStats: {
        followers: 0,
        following: 0,
        posts: 0,
      },
      interests: [],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create board");
  }

  return data;
};

// New function to check if board exists for a user
const checkBoardExists = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/boards/user/${userId}`
    );
    return response.ok;
  } catch (error) {
    console.error("Error checking board existence:", error);
    return false;
  }
};

// New function to get current user (for social login scenarios)
const getCurrentUser = async (): Promise<any> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
      {
        credentials: "include", // Include cookies for session-based auth
      }
    );

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export default function SignUp(): JSX.Element {
  const navigate = useNavigate();

  // Get Zustand store actions
  const { setCurrentUser } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [emailValidation, setEmailValidation] = useState<EmailValidation>({
    isChecking: false,
    isValid: null,
    message: "",
  });
  const [usernameValidation, setUsernameValidation] =
    useState<UsernameValidation>({
      isChecking: false,
      isValid: null,
      message: "",
    });

  // Check for social login completion and handle board creation
  useEffect(() => {
    const checkSocialLoginCompletion = async () => {
      // Check if user just completed social login (you can use URL params or other indicators)
      const urlParams = new URLSearchParams(window.location.search);
      const socialLoginSuccess = urlParams.get("social_login_success");

      if (socialLoginSuccess === "true") {
        try {
          const currentUser = await getCurrentUser();

          if (currentUser && currentUser.data?._id) {
            // Set user data in Zustand store
            setCurrentUser(currentUser.data);

            const boardExists = await checkBoardExists(currentUser.data._id);

            if (!boardExists) {
              // console.log("Creating board for social login user...");
              await createBoard(currentUser.data._id);
              // console.log("Board created successfully for social login user");
            }

            // Navigate to home after ensuring board exists
            navigate("/home");
          }
        } catch (error) {
          console.error("Error handling social login completion:", error);
        }
      }
    };

    checkSocialLoginCompletion();
  }, [navigate, setCurrentUser]);

  // TanStack Query mutations
  const signupMutation = useMutation({
    mutationFn: async (userData: SignupData) => {
      // First create the user
      const userResponse = await createUser(userData);

      // Then create the board for the user
      if (userResponse.success && userResponse.data?._id) {
        await createBoard(userResponse.data._id);
      }

      return userResponse;
    },
    onSuccess: (data) => {
      console.log("Signup successful:", data);

      // Set user data in Zustand store
      if (data.success && data.data) {
        setCurrentUser(data.data);
      }

      // Navigate to home page after successful signup
      navigate("/home");
    },
    onError: (error: Error) => {
      console.error("Signup failed:", error);
      // You can set form errors here if needed
      setErrors({ email: error.message });
    },
  });

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
        message: "Username too short",
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Only letters, numbers, and underscores allowed";
    } else if (usernameValidation.isValid === false) {
      newErrors.username = "Please choose a different username";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    } else if (emailValidation.isValid === false) {
      newErrors.email = "Please use a different email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one letter and one number";
    }

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
          validateEmail(value);
        }
      }, 1000);
    }

    // Validate username on change with debouncing
    if (name === "username") {
      setUsernameValidation({ isChecking: false, isValid: null, message: "" });
      clearTimeout((window as any).usernameTimeout);
      (window as any).usernameTimeout = setTimeout(() => {
        if (
          value.trim() &&
          value.length >= 3 &&
          /^[a-zA-Z0-9_]+$/.test(value)
        ) {
          validateUsername(value);
        }
      }, 800);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    // Prepare data for API call
    const signupData: SignupData = {
      fullName: formData.name,
      userName: formData.username,
      email: formData.email,
      password: formData.password,
    };

    // Use TanStack Query mutation
    signupMutation.mutate(signupData);
  };

  // Updated handleSocialLogin function with board creation handling
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
                className={`form-input ${
                  errors.name ? "form-input-error" : ""
                }`}
                placeholder="Enter your full name"
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
                className={`form-input ${
                  errors.username ? "form-input-error" : ""
                } ${
                  usernameValidation.isValid === true ? "form-input-valid" : ""
                }`}
                placeholder="Choose a username"
              />
              {usernameValidation.isChecking && (
                <div className="validation-icon">
                  <div className="spinner-small"></div>
                </div>
              )}
              {usernameValidation.isValid === true &&
                !usernameValidation.isChecking && (
                  <div className="validation-icon">
                    <Check size={16} color="#198754" />
                  </div>
                )}
              {usernameValidation.isValid === false &&
                !usernameValidation.isChecking && (
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
                className={`form-input ${
                  errors.email ? "form-input-error" : ""
                } ${
                  emailValidation.isValid === true ? "form-input-valid" : ""
                }`}
                placeholder="Enter your email"
              />
              {emailValidation.isChecking && (
                <div className="validation-icon">
                  <div className="spinner-small"></div>
                </div>
              )}
              {emailValidation.isValid === true &&
                !emailValidation.isChecking && (
                  <div className="validation-icon">
                    <Check size={16} color="#198754" />
                  </div>
                )}
              {emailValidation.isValid === false &&
                !emailValidation.isChecking && (
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
            {errors.email && (
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
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
                      className={`strength-bar strength-bar-${
                        passwordStrength.className
                      } ${
                        i < passwordStrength.strength
                          ? "strength-bar-active"
                          : ""
                      }`}
                    />
                  ))}
                </div>
                <p className="strength-label">
                  Strength: {passwordStrength.label}
                </p>
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
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
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
            disabled={signupMutation.isPending}
            className={`submit-button ${
              signupMutation.isPending ? "submit-button-disabled" : ""
            }`}
          >
            {signupMutation.isPending ? (
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
