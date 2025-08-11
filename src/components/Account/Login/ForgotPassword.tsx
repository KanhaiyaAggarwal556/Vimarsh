import { useState, FormEvent, MouseEvent, ChangeEvent } from "react";
import {
  ArrowLeft,
  Mail,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Type definitions
interface FormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
}

type PageType = "email" | "otp" | "reset" | "success";
type FocusedInput = keyof FormData | null;

// CSS styles (inline for demo)
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  pageContainer: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(10px)",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "30px",
    position: "relative" as const,
  },
  backButton: {
    position: "absolute" as const,
    top: "50%",
    left: "0",
    transform: "translateY(-50%)",
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "#667eea",
  },
  headerIcon: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    color: "white",
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    margin: "0 0 10px",
  },
  headerSubtitle: {
    color: "#666",
    fontSize: "16px",
    margin: "0",
  },
  formContainer: {
    width: "100%",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formLabel: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
    fontSize: "14px",
  },
  inputWrapper: {
    position: "relative" as const,
  },
  inputIcon: {
    position: "absolute" as const,
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#999",
    zIndex: 1,
  },
  formInput: {
    width: "100%",
    padding: "15px 15px 15px 50px",
    border: "2px solid #e1e5e9",
    borderRadius: "12px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
    boxSizing: "border-box" as const,
  },
  formInputWithToggle: {
    paddingRight: "50px",
  },
  formInputFocus: {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    outline: "none",
  },
  formInputError: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
  },
  passwordToggle: {
    position: "absolute" as const,
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#999",
    padding: "5px",
  },
  submitButton: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: "14px",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  successMessage: {
    color: "#10b981",
    fontSize: "14px",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  loadingSpinner: {
    width: "20px",
    height: "20px",
    border: "2px solid transparent",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  infoBox: {
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  infoText: {
    color: "#3B82F6",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  resendButton: {
    background: "none",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  otpInput: {
    textAlign: "center" as const,
    fontSize: "24px",
    letterSpacing: "5px",
    fontWeight: "bold",
  },
  passwordStrength: {
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  strengthBar: {
    flex: 1,
    height: "4px",
    backgroundColor: "#e1e5e9",
    borderRadius: "2px",
    overflow: "hidden" as const,
  },
  strengthFill: {
    height: "100%",
    transition: "all 0.3s ease",
  },
};

// CSS animations
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function PasswordResetSystem(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<PageType>("email");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<FocusedInput>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [resetToken, setResetToken] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [otpTimer, setOtpTimer] = useState<number>(0);

  const navigate = useNavigate();

  // API base URL - Fixed for Vite environment
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    return strength;
  };

  const getStrengthColor = (strength: number): string => {
    if (strength <= 2) return "#EF4444";
    if (strength === 3) return "#F59E0B";
    if (strength === 4) return "#10B981";
    return "#059669";
  };

  const getStrengthText = (strength: number): string => {
    if (strength <= 2) return "Weak";
    if (strength === 3) return "Fair";
    if (strength === 4) return "Good";
    return "Strong";
  };

  const handleEmailSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // console.log(
      //   "Attempting to call API:",
      //   `${API_BASE_URL}/auth/forgot-password`
      // );

      // TEMPORARY: Mock response for testing (remove when backend is ready)
      // Uncomment the next 6 lines and comment out the fetch block to test without backend
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      // setSuccessMessage("OTP sent to your email address");
      // setCurrentPage("otp");
      // startOtpTimer();
      // return;

      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      // console.log("Response status:", response.status);
      // console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Response data:", data);

      if (data.success) {
        setSuccessMessage("OTP sent to your email address");
        setCurrentPage("otp");
        startOtpTimer();
      } else {
        setErrors({ email: data.message || "Failed to send OTP" });
      }
    } catch (error) {
      console.error("Network error details:", error);

      // More specific error messages
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setErrors({
          email:
            "Cannot connect to server. Please check if the backend is running.",
        });
      } else if (
        error instanceof Error &&
        error.message.includes("HTTP error")
      ) {
        setErrors({ email: `Server error: ${error.message}` });
      } else {
        setErrors({ email: "Network error. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!formData.otp.trim()) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    if (formData.otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResetToken(data.resetToken);
        setCurrentPage("reset");
      } else {
        setErrors({ otp: data.message || "Invalid OTP" });
      }
    } catch (error) {
      setErrors({ otp: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const newErrors: FormErrors = {};

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          resetToken: resetToken,
          newPassword: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentPage("success");
      } else {
        setErrors({ password: data.message || "Failed to reset password" });
      }
    } catch (error) {
      setErrors({ password: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    if (otpTimer > 0) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("New OTP sent to your email");
        setFormData((prev) => ({ ...prev, otp: "" }));
        startOtpTimer();
      }
    } catch (error) {
      console.error("Failed to resend OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startOtpTimer = () => {
    setOtpTimer(60);
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBackToLogin = (): void => {
    navigate("/i/account/login");
  };

  const getInputStyle = (fieldName: keyof FormData): React.CSSProperties => ({
    ...styles.formInput,
    ...(fieldName === "password" || fieldName === "confirmPassword"
      ? styles.formInputWithToggle
      : {}),
    ...(fieldName === "otp" ? styles.otpInput : {}),
    ...(focusedInput === fieldName ? styles.formInputFocus : {}),
    ...(errors[fieldName] ? styles.formInputError : {}),
  });

  const handleButtonHover = (
    e: MouseEvent<HTMLButtonElement>,
    isHover: boolean
  ): void => {
    const target = e.target as HTMLButtonElement;
    if (isHover) {
      target.style.transform = "translateY(-2px)";
      target.style.boxShadow = "0 10px 20px rgba(102, 126, 234, 0.3)";
    } else {
      target.style.transform = "translateY(0)";
      target.style.boxShadow = "none";
    }
  };

  const handleBackButtonHover = (
    e: MouseEvent<HTMLButtonElement>,
    isHover: boolean
  ): void => {
    const target = e.target as HTMLButtonElement;
    if (isHover) {
      target.style.background = "rgba(255, 255, 255, 0.3)";
      target.style.transform = "translateY(-50%) scale(1.1)";
    } else {
      target.style.background = "rgba(255, 255, 255, 0.2)";
      target.style.transform = "translateY(-50%) scale(1)";
    }
  };

  // Success Page
  if (currentPage === "success") {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.container}>
          <div style={styles.pageContainer}>
            <div style={styles.header}>
              <div style={styles.headerIcon}>
                <CheckCircle size={30} />
              </div>
              <h1 style={styles.headerTitle}>Password Reset Successful!</h1>
              <p style={styles.headerSubtitle}>
                Your password has been updated successfully
              </p>
            </div>

            <button
              style={styles.submitButton}
              onClick={handleBackToLogin}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              Back to Login
              <ArrowRight size={20} />
            </button>
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
                onClick={() => setCurrentPage("otp")}
                onMouseEnter={(e) => handleBackButtonHover(e, true)}
                onMouseLeave={(e) => handleBackButtonHover(e, false)}
              >
                <ArrowLeft size={20} />
              </button>

              <div style={styles.headerIcon}>
                <Shield size={30} />
              </div>
              <h1 style={styles.headerTitle}>Set New Password</h1>
              <p style={styles.headerSubtitle}>
                Create a strong password for your account
              </p>
            </div>

            <div style={styles.formContainer}>
              <div style={styles.infoBox}>
                <AlertCircle size={20} color="#3B82F6" />
                <div style={styles.infoText}>
                  Your password must be at least 8 characters long and include a
                  mix of uppercase, lowercase, numbers, and special characters.
                </div>
              </div>

              <form onSubmit={handleResetSubmit}>
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
                      <span
                        style={{ color: getStrengthColor(passwordStrength) }}
                      >
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div style={styles.errorMessage}>
                      <AlertCircle size={16} />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

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
                      Updating Password...
                    </>
                  ) : (
                    <>
                      Update Password
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

  // OTP Verification Page
  if (currentPage === "otp") {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.container}>
          <div style={styles.pageContainer}>
            <div style={styles.header}>
              <button
                style={styles.backButton}
                onClick={() => setCurrentPage("email")}
                onMouseEnter={(e) => handleBackButtonHover(e, true)}
                onMouseLeave={(e) => handleBackButtonHover(e, false)}
              >
                <ArrowLeft size={20} />
              </button>

              <div style={styles.headerIcon}>
                <Mail size={30} />
              </div>
              <h1 style={styles.headerTitle}>Enter OTP</h1>
              <p style={styles.headerSubtitle}>
                We've sent a 6-digit code to {formData.email}
              </p>
            </div>

            <div style={styles.formContainer}>
              {successMessage && (
                <div style={styles.successMessage}>
                  <CheckCircle size={16} />
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleOtpSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Verification Code</label>
                  <div style={styles.inputWrapper}>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      onFocus={() => setFocusedInput("otp")}
                      onBlur={() => setFocusedInput(null)}
                      style={getInputStyle("otp")}
                      placeholder="000000"
                      maxLength={6}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.otp && (
                    <div style={styles.errorMessage}>
                      <AlertCircle size={16} />
                      {errors.otp}
                    </div>
                  )}

                  <button
                    type="button"
                    style={styles.resendButton}
                    onClick={handleResendOtp}
                    disabled={otpTimer > 0 || isSubmitting}
                  >
                    <RefreshCw size={14} />
                    {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Resend OTP"}
                  </button>
                </div>

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
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
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

  // Email Input Page (Default)
  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={styles.pageContainer}>
          <div style={styles.header}>
            <button
              style={styles.backButton}
              onClick={handleBackToLogin}
              onMouseEnter={(e) => handleBackButtonHover(e, true)}
              onMouseLeave={(e) => handleBackButtonHover(e, false)}
            >
              <ArrowLeft size={20} />
            </button>

            <div style={styles.headerIcon}>
              <Lock size={30} />
            </div>
            <h1 style={styles.headerTitle}>Forgot Password?</h1>
            <p style={styles.headerSubtitle}>
              Enter your email address to receive a verification code
            </p>
          </div>

          <div style={styles.formContainer}>
            <form onSubmit={handleEmailSubmit}>
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
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
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
