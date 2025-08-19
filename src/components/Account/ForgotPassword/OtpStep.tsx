import { useState, FormEvent, ChangeEvent } from "react";
import {
  ArrowLeft,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import {
  FormData,
  FormErrors,
  PageType,
} from "@/routes/Auth/PasswordResetSystem";

interface OtpStepProps {
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
  verifyOTP: (email: string, otp: string) => Promise<any>;
  resendOTP: (email: string) => Promise<any>;
  setResetToken: React.Dispatch<React.SetStateAction<string>>;
  otpTimer: number;
  startOtpTimer: () => void;
}

export default function OtpStep({
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
  verifyOTP,
  resendOTP,
  setResetToken,
  otpTimer,
  startOtpTimer,
}: OtpStepProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    // Only allow numbers for OTP
    if (name === "otp" && !/^\d*$/.test(value)) {
      return;
    }

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
      const result = await verifyOTP(formData.email, formData.otp);

      if (result.success && result.resetToken) {
        setResetToken(result.resetToken);
        setCurrentPage("reset");
      } else {
        setErrors({ otp: result.message || "Invalid OTP" });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setErrors({
        otp:
          error instanceof Error
            ? error.message
            : "Failed to verify OTP. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    if (otpTimer > 0 || isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const result = await resendOTP(formData.email);

      if (result.success) {
        setSuccessMessage("New OTP sent to your email");
        setFormData((prev) => ({ ...prev, otp: "" }));
        startOtpTimer();
      } else {
        setErrors({ otp: result.message || "Failed to resend OTP" });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setErrors({
        otp:
          error instanceof Error
            ? error.message
            : "Failed to resend OTP. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentLoading = authLoading || isSubmitting;

  return (
    <div className="pwd-reset-page">
      <div className="pwd-reset-header">
        <button
          className="pwd-reset-back-btn"
          onClick={() => setCurrentPage("email")}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="pwd-reset-icon">
          <Mail size={32} />
        </div>
        <h1 className="pwd-reset-title">Enter OTP</h1>
        <p className="pwd-reset-subtitle">
          We've sent a 6-digit code to {formData.email}
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
            <label className="pwd-reset-label">Verification Code</label>
            <div className="pwd-reset-input-wrapper">
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className={`pwd-reset-input pwd-reset-otp-input ${
                  errors.otp ? "pwd-reset-input-error" : ""
                }`}
                placeholder="000000"
                maxLength={6}
                disabled={currentLoading}
                autoComplete="one-time-code"
              />
            </div>
            {errors.otp && (
              <div className="pwd-reset-error-msg">
                <AlertCircle size={14} />
                {errors.otp}
              </div>
            )}

            <button
              type="button"
              className={`pwd-reset-resend-btn ${
                otpTimer > 0 || currentLoading ? "pwd-reset-btn-disabled" : ""
              }`}
              onClick={handleResendOtp}
              disabled={otpTimer > 0 || currentLoading}
            >
              <RefreshCw size={14} />
              {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Resend OTP"}
            </button>
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
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
