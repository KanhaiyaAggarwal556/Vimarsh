import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Check, X, AtSign } from "lucide-react";
import { validateEmail, validateUsername } from "@/utils/validation";

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

interface Props {
  formData: FormData;
  errors: FormErrors;
  isLoading: boolean;
  onFormChange: (formData: FormData) => void;
  onErrorsChange: (errors: FormErrors) => void;
  onSubmit: () => Promise<void>;
}

const SignUpForm: React.FC<Props> = ({
  formData,
  errors,
  isLoading,
  onFormChange,
  onErrorsChange,
  onSubmit
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
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

    // Password validation
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

    onErrorsChange(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    onFormChange(newFormData);

    // Clear existing error for this field
    if (errors[name as keyof FormErrors]) {
      const newErrors = { ...errors };
      delete newErrors[name as keyof FormErrors];
      onErrorsChange(newErrors);
    }

    // Email validation with debouncing
    if (name === "email") {
      setEmailValidation({ isChecking: false, isValid: null, message: "" });
      clearTimeout((window as any).emailTimeout);
      (window as any).emailTimeout = setTimeout(async () => {
        if (value.trim() && /\S+@\S+\.\S+/.test(value)) {
          const result = await validateEmail(value.trim().toLowerCase());
          setEmailValidation(result);
        }
      }, 1000);
    }

    // Username validation with debouncing
    if (name === "username") {
      setUsernameValidation({ isChecking: false, isValid: null, message: "" });
      clearTimeout((window as any).usernameTimeout);
      (window as any).usernameTimeout = setTimeout(async () => {
        if (value.trim() && value.length >= 3 && /^[a-zA-Z0-9_]+$/.test(value)) {
          const result = await validateUsername(value.trim());
          setUsernameValidation(result);
        }
      }, 800);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;
    await onSubmit();
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
    <>
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
            maxLength={100}
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
    </>
  );
};

export default SignUpForm;