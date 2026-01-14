import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { FormData, FormErrors, SocialProvider } from "@/types/login.types";

// Import components
import BrandHeader from "@/components/Account/Login/BrandHeader";
import LoginForm from "@/components/Account/Login/LoginForm";
import ShowcaseSlider from "@/components/Account/Login/ShowcaseSlider";
import Footer from "@/components/Account/Login/Footer";
import "./login.css";

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  // Use Zustand store methods directly
  const { login, isLoading, error, clearError, isAuthenticated, currentUser } =
    useAuthStore();

  // State management
  const [formData, setFormData] = useState<FormData>({
    emailOrUsername: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState<string>("");

  // Effects for URL params handling and auth redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const oauthSuccess = urlParams.get("oauth_success");
    const oauthError = urlParams.get("error");
    const errorDetails = urlParams.get("details");

    if (oauthSuccess) {
      setShowSuccessMessage("Successfully logged in via social media!");
      navigate("/login", { replace: true });
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    }

    if (oauthError) {
      let errorMessage = "Social login failed. Please try again.";
      switch (oauthError) {
        case "google_auth_failed":
          errorMessage = "Google authentication failed. Please try again.";
          break;
        case "facebook_auth_failed":
          errorMessage = "Facebook authentication failed. Please try again.";
          break;
        case "linkedin_auth_failed":
          errorMessage = "LinkedIn authentication failed. Please try again.";
          break;
        case "oauth_no_user":
          errorMessage =
            "Authentication successful but user data not received. Please try again.";
          break;
        case "oauth_error":
        case "oauth_handler_error":
          errorMessage = errorDetails
            ? decodeURIComponent(errorDetails)
            : "OAuth authentication failed. Please try again.";
          break;
        default:
          errorMessage = "Social login encountered an error. Please try again.";
      }
      setErrors({ general: errorMessage });
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (
      isAuthenticated &&
      currentUser &&
      !location.search.includes("oauth_success")
    ) {
      const redirectTo =
        new URLSearchParams(location.search).get("redirect") || "/home";
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, currentUser, location, navigate]);

  useEffect(() => {
    clearError();
    setErrors({});
  }, [clearError]);

  // Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (error || errors.general) {
      clearError();
      setErrors((prev) => ({ ...prev, general: "" }));
    }

    if (showSuccessMessage) {
      setShowSuccessMessage("");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Email or username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent): Promise<void> => {
    e?.preventDefault();

    if (!validateForm()) return;

    try {
      setErrors({});
      clearError();

      console.log("Attempting login with:", {
        emailOrUsername: formData.emailOrUsername,
        hasPassword: !!formData.password,
      });

      const result = await login(formData.emailOrUsername, formData.password);

      console.log("Login result:", result);

      if (result.success) {
        setShowSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => {
          const redirectTo =
            new URLSearchParams(location.search).get("redirect") || "/home";
          navigate(redirectTo, { replace: true });
        }, 1000);
      } else {
        console.error("Login failed:", result.message);

        // Enhanced error message handling
        if (result.message?.includes("Cannot connect to server")) {
          setErrors({
            general:
              "Cannot connect to server. Please check your internet connection and try again.",
          });
        } else if (result.message?.includes("timeout")) {
          setErrors({
            general: "Request timed out. Please try again.",
          });
        } else if (result.message?.toLowerCase().includes("credential")) {
          setErrors({
            general:
              "Invalid email/username or password. Please check your credentials.",
          });
        } else if (result.message?.toLowerCase().includes("social")) {
          setErrors({
            general:
              "This account is linked to social media. Please use the social login buttons below.",
          });
        } else {
          setErrors({
            general: result.message || "Login failed. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Login error caught:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleSocialLogin = (provider: SocialProvider): void => {
    setErrors({});
    clearError();

    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

    const socialUrls: Record<SocialProvider, string> = {
      google: `${baseURL}/auth/google`,
      facebook: `${baseURL}/auth/facebook`,
      linkedin: `${baseURL}/auth/linkedin`,
      twitter: `${baseURL}/auth/twitter`,
    };

    const currentUrl = window.location.href;
    sessionStorage.setItem("socialLoginReturn", currentUrl);

    if (provider === "twitter") {
      setErrors({ general: "Twitter login is coming soon!" });
      return;
    }

    window.location.href = socialUrls[provider];
  };

  // Updated to handle button click events instead of anchor click events
  const handleForgotPassword = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/i/account/forgotpassword");
  };

  // Updated to handle button click events instead of anchor click events
  const handleSignup = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/i/account/signup");
  };

  // Get the current error to display
  const displayError = errors.general || errors.emailOrUsername || error || "";

  return (
    <div className="login-page-container">
      <div className="main-content">
        {/* Left Side - Login Form */}
        <div className="left-side">
          <div className="login-section">
            <BrandHeader />
            <LoginForm
              formData={formData}
              errors={errors}
              showPassword={showPassword}
              isLoading={isLoading}
              showSuccessMessage={showSuccessMessage}
              displayError={displayError}
              onFormChange={handleChange}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onSubmit={handleSubmit}
              onForgotPassword={handleForgotPassword}
              onSignup={handleSignup}
              onSocialLogin={handleSocialLogin}
            />
          </div>
        </div>

        {/* Right Side - Showcase Slider */}
        <div className="right-side">
          <ShowcaseSlider />
        </div>
      </div>

      <Footer />
    </div>
  );
}
