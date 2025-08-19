import React from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  X,
  AtSign,
  AlertCircle,
} from "lucide-react";
import { FormData, FormErrors, SocialProvider } from "@/types/login.types";
import "./styles/LoginForm.css";

interface LoginFormProps {
  formData: FormData;
  errors: FormErrors;
  showPassword: boolean;
  isLoading: boolean;
  showSuccessMessage: string;
  displayError: string;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onSubmit: (e?: React.FormEvent) => Promise<void>;
  onForgotPassword: (e: React.MouseEvent<HTMLButtonElement>) => void; // Changed from HTMLAnchorElement
  onSignup: (e: React.MouseEvent<HTMLButtonElement>) => void; // Changed from HTMLAnchorElement
  onSocialLogin: (provider: SocialProvider) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  errors,
  showPassword,
  isLoading,
  showSuccessMessage,
  displayError,
  onFormChange,
  onTogglePassword,
  onSubmit,
  onForgotPassword,
  onSignup,
  onSocialLogin,
}) => {
  // Helper function to determine if input looks like email
  const isEmailFormat = (input: string): boolean => {
    return /\S+@\S+\.\S+/.test(input);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  // Social login providers configuration
  const socialProviders = [
    { 
      id: 'google' as SocialProvider, 
      label: 'Continue with Google', 
      icon: 'G', 
      className: 'social-google',
      disabled: isLoading 
    },
    { 
      id: 'facebook' as SocialProvider, 
      label: 'Continue with Facebook', 
      icon: 'f', 
      className: 'social-facebook',
      disabled: isLoading 
    },
    { 
      id: 'linkedin' as SocialProvider, 
      label: 'Continue with LinkedIn', 
      icon: 'in', 
      className: 'social-linkedin',
      disabled: isLoading 
    },
    { 
      id: 'twitter' as SocialProvider, 
      label: 'Continue with X (Coming Soon)', 
      icon: '𝕏', 
      className: 'social-x',
      disabled: true 
    },
  ];

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2 className="login-title">Sign In</h2>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="success-message" role="alert" aria-live="polite">
            <AlertCircle size={16} aria-hidden="true" />
            {showSuccessMessage}
          </div>
        )}

        {/* Global Error Message */}
        {displayError && (
          <div className="error-message global-error" role="alert" aria-live="polite">
            <X size={16} aria-hidden="true" />
            {displayError}
          </div>
        )}

        {/* Email or Username Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="emailOrUsername">
            Email or Username
          </label>
          <div className="input-wrapper">
            {isEmailFormat(formData.emailOrUsername) ? (
              <Mail className="input-icon" aria-hidden="true" />
            ) : (
              <AtSign className="input-icon" aria-hidden="true" />
            )}
            <input
              id="emailOrUsername"
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={onFormChange}
              className={`form-input ${
                errors.emailOrUsername ? "form-input-error" : ""
              }`}
              placeholder="Enter your email or username"
              disabled={isLoading}
              autoComplete="username"
              aria-invalid={errors.emailOrUsername ? "true" : "false"}
              aria-describedby={errors.emailOrUsername ? "emailOrUsername-error" : undefined}
              required
            />
          </div>
          {errors.emailOrUsername && errors.emailOrUsername !== displayError && (
            <div 
              className="error-message" 
              id="emailOrUsername-error"
              role="alert" 
              aria-live="polite"
            >
              <X size={16} aria-hidden="true" />
              {errors.emailOrUsername}
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <div className="input-wrapper">
            <Lock className="input-icon" aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={onFormChange}
              className={`form-input password-input ${
                errors.password ? "form-input-error" : ""
              }`}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              required
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="password-toggle"
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <div 
              className="error-message" 
              id="password-error"
              role="alert" 
              aria-live="polite"
            >
              <X size={16} aria-hidden="true" />
              {errors.password}
            </div>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={onFormChange}
              className="checkbox"
              disabled={isLoading}
              id="rememberMe"
            />
            <span className="checkbox-text">Remember me</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="forgot-link"
            disabled={isLoading}
            aria-label="Forgot password"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`submit-button ${
            isLoading ? "submit-button-disabled" : ""
          }`}
          aria-label={isLoading ? "Signing in..." : "Sign in to your account"}
        >
          {isLoading ? (
            <div className="loading-content">
              <div className="spinner" aria-hidden="true"></div>
              Signing In...
            </div>
          ) : (
            <>
              Sign In
              <ArrowRight size={20} className="button-icon" aria-hidden="true" />
            </>
          )}
        </button>

        {/* Social Login Section */}
        <div className="social-login-section">
          <div className="or-divider">
            <span className="or-text">or</span>
          </div>
          <div className="social-icons" role="group" aria-label="Social login options">
            {socialProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => onSocialLogin(provider.id)}
                className={`social-icon-button ${provider.className}`}
                title={provider.label}
                type="button"
                disabled={provider.disabled}
                aria-label={provider.label}
              >
                <div className="social-icon" aria-hidden="true">
                  {provider.icon}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="signup-prompt">
          <p className="signup-text">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSignup}
              className="signup-link"
              disabled={isLoading}
              aria-label="Create a new account"
            >
              Create one now
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;