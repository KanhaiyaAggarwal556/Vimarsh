import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Check, X } from "lucide-react";
import logo from "../../assets/twooter-logo2.png";
import LoginPage from "./Login";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailValidation, setEmailValidation] = useState({
    isChecking: false,
    isValid: null,
    message: ""
  });

  const validateEmail = async (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailValidation({ isChecking: false, isValid: false, message: "Invalid email format" });
      return false;
    }

    setEmailValidation({ isChecking: true, isValid: null, message: "Checking email..." });
    
    try {
      // Simulate email validation API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation logic - in real app, you'd call an actual email validation service
      const isValidEmail = !email.includes('invalid') && !email.includes('fake');
      
      if (isValidEmail) {
        setEmailValidation({ isChecking: false, isValid: true, message: "Email is valid" });
        return true;
      } else {
        setEmailValidation({ isChecking: false, isValid: false, message: "Email address not found or invalid" });
        return false;
      }
    } catch (error) {
      setEmailValidation({ isChecking: false, isValid: false, message: "Unable to verify email" });
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    } else if (emailValidation.isValid === false) {
      newErrors.email = "Please use a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    // Validate email on change with debouncing
    if (name === 'email') {
      setEmailValidation({ isChecking: false, isValid: null, message: "" });
      clearTimeout(window.emailTimeout);
      window.emailTimeout = setTimeout(() => {
        if (value.trim() && /\S+@\S+\.\S+/.test(value)) {
          validateEmail(value);
        }
      }, 1000);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setEmailValidation({ isChecking: false, isValid: null, message: "" });
    }, 3000);
  };

  const handleSocialLogin = (provider) => {
    // Replace these URLs with your actual website pages
    const socialUrls = {
      'Google': 'https://yourwebsite.com/auth/google',
      'Facebook': 'https://yourwebsite.com/auth/facebook',
      'LinkedIn': 'https://yourwebsite.com/auth/linkedin',
      'X': 'https://yourwebsite.com/auth/twitter'
    };
    
    // Open the URL in a new tab
    window.open(socialUrls[provider], '_blank');
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", className: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const classNames = ["very-weak", "weak", "fair", "good", "strong"];

    return {
      strength,
      label: labels[strength - 1] || "",
      className: classNames[strength - 1] || "",
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (isSuccess) {
    return (
      <div style={styles.successScreen}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>
            <Check size={32} color="white" />
          </div>
          <h2 style={styles.successTitle}>Welcome aboard!</h2>
          <p style={styles.successMessage}>
            Your account has been created successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.signupContainer}>
      <div style={styles.signupWrapper}>
        {/* Logo and Brand */}
        <div style={styles.brandSection}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <img
                  src={logo}
                  alt="Twooter Logo"
                  className="rounded-circle"
                  style={{ width: 40, height: 40, objectFit: "cover" }}
              />
            </div>
            <h1 style={styles.brandName}>Twooter</h1>
          </div>
          <p style={styles.brandTagline}>Your gateway to endless possibilities</p>
        </div>

        <div style={styles.signupForm}>
          {/* Name Field */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Full Name</label>
            <div style={styles.inputWrapper}>
              <User style={styles.inputIcon} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  ...styles.formInput,
                  ...(errors.name ? styles.formInputError : {}),
                }}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && (
              <div style={styles.errorMessage}>
                <X style={styles.errorIcon} />
                {errors.name}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...styles.formInput,
                  ...(errors.email ? styles.formInputError : {}),
                  ...(emailValidation.isValid === true ? styles.formInputValid : {}),
                }}
                placeholder="Enter your email"
              />
              {emailValidation.isChecking && (
                <div style={styles.emailValidationIcon}>
                  <div style={styles.spinnerSmall}></div>
                </div>
              )}
              {emailValidation.isValid === true && !emailValidation.isChecking && (
                <div style={styles.emailValidationIcon}>
                  <Check size={16} color="#198754" />
                </div>
              )}
              {emailValidation.isValid === false && !emailValidation.isChecking && (
                <div style={styles.emailValidationIcon}>
                  <X size={16} color="#dc3545" />
                </div>
              )}
            </div>
            {emailValidation.message && (
              <div style={{
                ...styles.validationMessage,
                color: emailValidation.isValid === true ? '#198754' : 
                       emailValidation.isValid === false ? '#dc3545' : 
                       'rgba(255, 255, 255, 0.7)'
              }}>
                {emailValidation.message}
              </div>
            )}
            {errors.email && (
              <div style={styles.errorMessage}>
                <X style={styles.errorIcon} />
                {errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.formInput,
                  ...styles.passwordInput,
                  ...(errors.password ? styles.formInputError : {}),
                }}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div style={styles.passwordStrength}>
                <div style={styles.strengthBars}>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.strengthBar,
                        ...styles[`strengthBar${passwordStrength.className}`],
                        ...(i < passwordStrength.strength ? styles.strengthBarActive : {}),
                      }}
                    />
                  ))}
                </div>
                <p style={styles.strengthLabel}>
                  Strength: {passwordStrength.label}
                </p>
              </div>
            )}

            {errors.password && (
              <div style={styles.errorMessage}>
                <X style={styles.errorIcon} />
                {errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Confirm Password</label>
            <div style={styles.inputWrapper}>
              <Lock style={styles.inputIcon} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  ...styles.formInput,
                  ...styles.passwordInput,
                  ...(errors.confirmPassword ? styles.formInputError : {}),
                }}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.passwordToggle}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div style={styles.errorMessage}>
                <X style={styles.errorIcon} />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              ...styles.submitButton,
              ...(isSubmitting ? styles.submitButtonDisabled : {}),
            }}
          >
            {isSubmitting ? (
              <div style={styles.loadingContent}>
                <div style={styles.spinner}></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Social Login Section - Moved here */}
          <div style={styles.socialLoginSection}>
            <div style={styles.orDivider}>
              <span style={styles.orText}>or </span>
            </div>
            <div style={styles.socialIcons}>
              <button
                onClick={() => handleSocialLogin('Google')}
                style={{...styles.socialIconButton, background: '#4285f4'}}
                title="Continue with Google"
              >
                <div style={styles.googleIcon}>G</div>
              </button>
              <button
                onClick={() => handleSocialLogin('Facebook')}
                style={{...styles.socialIconButton, background: '#1877f2'}}
                title="Continue with Facebook"
              >
                <div style={styles.facebookIcon}>f</div>
              </button>
              <button
                onClick={() => handleSocialLogin('LinkedIn')}
                style={{...styles.socialIconButton, background: '#0077b5'}}
                title="Continue with LinkedIn"
              >
                <div style={styles.linkedinIcon}>in</div>
              </button>
              <button
                onClick={() => handleSocialLogin('X')}
                style={{...styles.socialIconButton, background: '#000'}}
                title="Continue with X"
              >
                <div style={styles.xIcon}>𝕏</div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.signupFooter}>
            <p style={styles.footerText}>
              Already have an account?{" "}
              <a href="./login" style={styles.signinLink}>
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  signupContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#000000", // Changed to black
    padding: "1rem",
  },
  signupWrapper: {
    width: "100%",
    maxWidth: "450px",
  },
  brandSection: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    marginBottom: "0.5rem",
  },
  logoIcon: {
    width: "48px",
    height: "48px",
    background: "linear-gradient(135deg, #5c71d181 0%, #764ba27b 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  brandName: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "white",
    margin: "0",
  },
  brandTagline: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.9rem",
    margin: "0",
  },
  signupForm: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "2rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  formLabel: {
    color: "white",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
    display: "block",
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255, 255, 255, 0.5)",
    width: "20px",
    height: "20px",
    zIndex: 1,
  },
  formInput: {
    width: "100%",
    padding: "12px 16px 12px 44px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    color: "white",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },
  formInputError: {
    borderColor: "#dc3545",
  },
  formInputValid: {
    borderColor: "#198754",
  },
  passwordInput: {
    paddingRight: "44px",
  },
  passwordToggle: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
    padding: "0",
    width: "20px",
    height: "20px",
    transition: "color 0.2s ease",
    zIndex: 1,
  },
  emailValidationIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
  },
  spinnerSmall: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  validationMessage: {
    fontSize: "0.75rem",
    marginTop: "0.25rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  passwordStrength: {
    marginTop: "0.5rem",
  },
  strengthBars: {
    display: "flex",
    gap: "4px",
    marginBottom: "4px",
  },
  strengthBar: {
    height: "4px",
    flex: 1,
    borderRadius: "2px",
    background: "rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
  },
  strengthBarActive: {
    background: "currentColor",
  },
  "strengthBarvery-weak": { color: "#dc3545" },
  strengthBarweak: { color: "#fd7e14" },
  strengthBarfair: { color: "#ffc107" },
  strengthBargood: { color: "#0dcaf0" },
  strengthBarstrong: { color: "#198754" },
  strengthLabel: {
    fontSize: "0.75rem",
    color: "rgba(255, 255, 255, 0.7)",
    margin: "0",
  },
  errorMessage: {
    color: "#dc3545",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  errorIcon: {
    width: "16px",
    height: "16px",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "1.5rem",
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  loadingContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  // New social login section styles
  socialLoginSection: {
    marginBottom: "1.5rem",
  },
  orDivider: {
    textAlign: "center",
    margin: "1rem 0",
    position: "relative",
  },
  orText: {
    color: "rgba(255, 255, 255, 0.79)",
    fontSize: "0.875rem",
    padding: "0 1rem",
    position: "relative",
    zIndex: 1,
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  socialIconButton: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
  googleIcon: {
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
  },
  facebookIcon: {
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
  },
  linkedinIcon: {
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
  },
  xIcon: {
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
  },
  signupFooter: {
    textAlign: "center",
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.875rem",
    margin: "0",
  },
  signinLink: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.2s ease",
  },
  successScreen: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#000000", // Changed to black
    padding: "1rem",
  },
  successCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "2rem",
    textAlign: "center",
    animation: "pulse 2s ease-in-out infinite",
    maxWidth: "400px",
  },
  successIcon: {
    width: "64px",
    height: "64px",
    background: "#198754",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
  },
  successTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "white",
    marginBottom: "0.5rem",
  },
  successMessage: {
    color: "rgba(255, 255, 255, 0.8)",
    margin: "0 0 2rem 0",
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  input::placeholder, select {
    color: rgba(255, 255, 255, 0.5) !important;
  }
  
  select option {
    background: #333;
    color: white;
  }
  
  input:focus, select:focus {
    outline: none !important;
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3) !important;
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  button:active {
    transform: translateY(0);
  }
  
  [style*="socialIconButton"]:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  /* Add line through or divider effect */
  [style*="orDivider"]:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    z-index: 0;
  }
`;
document.head.appendChild(styleSheet);