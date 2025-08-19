import { useState, FormEvent, ChangeEvent } from "react";
import {
  ArrowLeft,
  Mail,
  ArrowRight,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  FormData,
  FormErrors,
  PageType,
} from "@/routes/Auth/PasswordResetSystem";

interface EmailStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  authError: string | null;
  authLoading: boolean;
  clearError: () => void;
  successMessage: string;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<PageType>>;
  handleBackToLogin: () => void;
  forgotPassword: (email: string) => Promise<any>;
  startOtpTimer: () => void;
}

export default function EmailStep({
  formData,
  setFormData,
  errors,
  setErrors,
  authError,
  authLoading,
  clearError,
  successMessage,
  setSuccessMessage,
  setCurrentPage,
  handleBackToLogin,
  forgotPassword,
  startOtpTimer,
}: EmailStepProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
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

    if (authError) {
      clearError();
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
    setSuccessMessage("");

    try {
      const result = await forgotPassword(formData.email);

      if (result.success) {
        setSuccessMessage("OTP sent to your email address");
        setCurrentPage("otp");
        startOtpTimer();
      } else {
        setErrors({ email: result.message || "Failed to send OTP" });
      }
    } catch (error) {
      console.error("Email submit error:", error);
      setErrors({
        email:
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentLoading = authLoading || isSubmitting;

  return (
    <div className="pwd-reset-page">
      <div className="pwd-reset-header">
        <button className="pwd-reset-back-btn" onClick={handleBackToLogin}>
          <ArrowLeft size={20} />
        </button>

        <div className="pwd-reset-icon">
          <Lock size={32} />
        </div>
        <h1 className="pwd-reset-title">Forgot Password?</h1>
        <p className="pwd-reset-subtitle">
          Enter your email address to receive a verification code
        </p>
      </div>

      <div className="pwd-reset-form-container">
        {successMessage && (
          <div className="pwd-reset-success-msg">
            <CheckCircle size={16} />
            {successMessage}
          </div>
        )}

        {authError && (
          <div className="pwd-reset-error-msg">
            <AlertCircle size={16} />
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="pwd-reset-form">
          <div className="pwd-reset-form-group">
            <label className="pwd-reset-label">Email Address</label>
            <div className="pwd-reset-input-wrapper">
              <Mail className="pwd-reset-input-icon" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`pwd-reset-input ${
                  errors.email ? "pwd-reset-input-error" : ""
                }`}
                placeholder="Enter your email address"
                disabled={currentLoading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <div className="pwd-reset-error-msg">
                <AlertCircle size={14} />
                {errors.email}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={currentLoading}
            className={`pwd-reset-submit-btn ${
              currentLoading ? "pwd-reset-btn-loading" : ""
            }`}
          >
            {currentLoading ? (
              <>
                <div className="pwd-reset-spinner"></div>
                Sending OTP...
              </>
            ) : (
              <>
                Send OTP
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
