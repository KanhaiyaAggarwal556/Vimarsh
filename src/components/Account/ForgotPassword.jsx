import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import styles from "./resetPageStyle";

// CSS animations
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translateY(0);
    }
    40%, 43% {
      transform: translateY(-10px);
    }
    70% {
      transform: translateY(-5px);
    }
  }
`;

export default function PasswordResetSystem() {
  const [currentPage, setCurrentPage] = useState("forgot"); // "forgot", "reset", "success", "login"
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    birthdate: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForgotForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.birthdate) {
      newErrors.birthdate = "Birth date is required";
    } else {
      const today = new Date();
      const birthDate = new Date(formData.birthdate);
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13) {
        newErrors.birthdate = "You must be at least 13 years old";
      } else if (birthDate > today) {
        newErrors.birthdate = "Birth date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength <= 2) return "#EF4444";
    if (strength === 3) return "#F59E0B";
    if (strength === 4) return "#10B981";
    return "#059669";
  };

  const getStrengthText = (strength) => {
    if (strength <= 2) return "Weak";
    if (strength === 3) return "Fair";
    if (strength === 4) return "Good";
    return "Strong";
  };

  const validateResetForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (getPasswordStrength(formData.password) < 3) {
      newErrors.password = "Password is too weak";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForgotForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setCurrentPage("reset");
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateResetForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setCurrentPage("success");
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };
  const getInputStyle = (fieldName) => ({
    ...styles.formInput,
    ...(fieldName === "password" || fieldName === "confirmPassword" ? styles.formInputWithToggle : {}),
    ...(focusedInput === fieldName ? styles.formInputFocus : {}),
    ...(errors[fieldName] ? styles.formInputError : {}),
  });

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow = "0 10px 20px rgba(102, 126, 234, 0.3)";
    } else {
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "none";
    }
  };

  const handleSecondaryButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.background = "#667eea";
      e.target.style.color = "white";
    } else {
      e.target.style.background = "transparent";
      e.target.style.color = "#667eea";
    }
  };

  // Login Page (placeholder)
  if (currentPage === "login") {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.container}>
          <div style={styles.pageContainer}>
            <div style={styles.header}>
              <div style={styles.headerIcon}>
                <Lock size={30} />
              </div>
              <h1 style={styles.headerTitle}>Login</h1>
              <p style={styles.headerSubtitle}>
                Welcome back! Please sign in to your account
              </p>
            </div>
            
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>
                <User size={40} color="white" />
              </div>
              
              <h2 style={styles.successTitle}>Login Page</h2>
              <p style={styles.successMessage}>
                This is your login page. You can implement your login form here.
              </p>
              
              <div style={styles.successActions}>
                <button
                  onClick={() => setCurrentPage("forgot")}
                  style={styles.secondaryButton}
                  onMouseEnter={(e) => handleSecondaryButtonHover(e, true)}
                  onMouseLeave={(e) => handleSecondaryButtonHover(e, false)}
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Reset Password Page
  if (currentPage === "reset") {
    const passwordStrength = getPasswordStrength(formData.password);
    
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.container}>
          <div style={styles.pageContainer}>
            <div style={styles.header}>
              <button
                style={styles.backButton}
                onClick={() => setCurrentPage("forgot")}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.3)";
                  e.target.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  e.target.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                <ArrowLeft size={20} />
              </button>
              
              <div style={styles.headerIcon}>
                <Shield size={30} />
              </div>
              <h1 style={styles.headerTitle}>Reset Password</h1>
              <p style={styles.headerSubtitle}>
                Create a new secure password for your account
              </p>
            </div>
            
            <div style={styles.formContainer}>
              <div style={styles.infoBox}>
                <AlertCircle size={20} color="#3B82F6" />
                <div style={styles.infoText}>
                  Your password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.
                </div>
              </div>

              <form onSubmit={handleResetSubmit}>
                {/* New Password Field */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>New Password</label>
                  <div style={styles.inputWrapper}>
                    <Lock style={styles.inputIcon} size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      style={getInputStyle("password")}
                      placeholder="Enter new password"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      style={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div style={styles.passwordStrength}>
                      <div style={styles.strengthBar}>
                        <div
                          style={{
                            ...styles.strengthFill,
                            width: `${(passwordStrength / 5) * 100}%`,
                            background: getStrengthColor(passwordStrength),
                          }}
                        />
                      </div>
                      <span style={{ color: getStrengthColor(passwordStrength) }}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                  )}
                  {errors.password && (
                    <div style={styles.errorMessage}>
                      <AlertCircle size={16} />
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Confirm Password</label>
                  <div style={styles.inputWrapper}>
                    <Lock style={styles.inputIcon} size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedInput("confirmPassword")}
                      onBlur={() => setFocusedInput(null)}
                      style={getInputStyle("confirmPassword")}
                      placeholder="Confirm new password"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      style={styles.passwordToggle}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div style={styles.errorMessage}>
                      <AlertCircle size={16} />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    ...styles.submitButton,
                    ...(isSubmitting ? styles.submitButtonDisabled : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) handleButtonHover(e, true);
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) handleButtonHover(e, false);
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={styles.loadingSpinner}></div>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Set Password
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Forgot Password Page
  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={styles.pageContainer}>
          <div style={styles.header}>
            <button
              style={styles.backButton}
              onClick={handleBackToLogin}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              <ArrowLeft size={20} />
            </button>
            
            <div style={styles.headerIcon}>
              <Lock size={30} />
            </div>
            <h1 style={styles.headerTitle}>Forgot Password?</h1>
            <p style={styles.headerSubtitle}>
              Enter your details to reset your password
            </p>
          </div>
          
          <div style={styles.formContainer}>
                          <div>
              {/* Username Field */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Username</label>
                <div style={styles.inputWrapper}>
                  <User style={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("username")}
                    onBlur={() => setFocusedInput(null)}
                    style={getInputStyle("username")}
                    placeholder="Enter your username"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.username && (
                  <div style={styles.errorMessage}>
                    <AlertCircle size={16} />
                    {errors.username}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <Mail style={styles.inputIcon} size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                    style={getInputStyle("email")}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <div style={styles.errorMessage}>
                    <AlertCircle size={16} />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Birth Date Field */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Birth Date</label>
                <div style={styles.inputWrapper}>
                  <Calendar style={styles.inputIcon} size={20} />
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("birthdate")}
                    onBlur={() => setFocusedInput(null)}
                    style={getInputStyle("birthdate")}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.birthdate && (
                  <div style={styles.errorMessage}>
                    <AlertCircle size={16} />
                    {errors.birthdate}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleForgotSubmit}
                disabled={isSubmitting}
                style={{
                  ...styles.submitButton,
                  ...(isSubmitting ? styles.submitButtonDisabled : {}),
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) handleButtonHover(e, true);
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) handleButtonHover(e, false);
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={styles.loadingSpinner}></div>
                    Verifying Details...  
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}