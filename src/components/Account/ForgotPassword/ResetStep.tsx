import { useState, FormEvent, ChangeEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  FormData,
  FormErrors,
  PageType,
} from "@/routes/Auth/PasswordResetSystem";

interface ResetStepProps {
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
  resetPassword: (
    email: string,
    token: string,
    password: string
  ) => Promise<any>;
  resetToken: string;
}

export default function ResetStep({
  formData,
  setFormData,
  errors,
  setErrors,
  authError,
  authLoading,
  clearError,
  setCurrentPage,
  resetPassword,
  resetToken,
}: ResetStepProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

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
    if (strength <= 2) return "#ef4444";
    if (strength === 3) return "#f59e0b";
    if (strength === 4) return "#10b981";
    return "#059669";
  };

  const getStrengthText = (strength: number): string => {
    if (strength <= 2) return "Weak";
    if (strength === 3) return "Fair";
    if (strength === 4) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
      const result = await resetPassword(
        formData.email,
        resetToken,
        formData.password
      );

      if (result.success) {
        setCurrentPage("success");
      } else {
        setErrors({ password: result.message || "Failed to reset password" });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({
        password:
          error instanceof Error
            ? error.message
            : "Failed to reset password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const currentLoading = authLoading || isSubmitting;

  return (
    <div className="pwd-reset-page">
      <div className="pwd-reset-header">
        <button
          className="pwd-reset-back-btn"
          onClick={() => setCurrentPage("otp")}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="pwd-reset-icon">
          <Shield size={32} />
        </div>
        <h1 className="pwd-reset-title">Set New Password</h1>
        <p className="pwd-reset-subtitle">
          Create a strong password for your account
        </p>
      </div>

      <div className="pwd-reset-form-container">
        <div className="pwd-reset-info-box">
          <CheckCircle size={18} />
          <div className="pwd-reset-info-text">
            Your password must be at least 8 characters long and include a mix
            of uppercase, lowercase, numbers, and special characters.
          </div>
        </div>

        {authError && (
          <div className="pwd-reset-error-msg">
            <AlertCircle size={16} />
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="pwd-reset-form">
          <div className="pwd-reset-form-group">
            <label className="pwd-reset-label">New Password</label>
            <div className="pwd-reset-input-wrapper">
              <Lock className="pwd-reset-input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`pwd-reset-input pwd-reset-input-with-toggle ${
                  errors.password ? "pwd-reset-input-error" : ""
                }`}
                placeholder="Enter new password"
                disabled={currentLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pwd-reset-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <div className="pwd-reset-strength">
                <div className="pwd-reset-strength-bar">
                  <div
                    className="pwd-reset-strength-fill"
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getStrengthColor(passwordStrength),
                    }}
                  />
                </div>
                <span style={{ color: getStrengthColor(passwordStrength) }}>
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
            )}
            {errors.password && (
              <div className="pwd-reset-error-msg">
                <AlertCircle size={14} />
                {errors.password}
              </div>
            )}
          </div>

          <div className="pwd-reset-form-group">
            <label className="pwd-reset-label">Confirm Password</label>
            <div className="pwd-reset-input-wrapper">
              <Lock className="pwd-reset-input-icon" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pwd-reset-input pwd-reset-input-with-toggle ${
                  errors.confirmPassword ? "pwd-reset-input-error" : ""
                }`}
                placeholder="Confirm new password"
                disabled={currentLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pwd-reset-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="pwd-reset-error-msg">
                <AlertCircle size={14} />
                {errors.confirmPassword}
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
                Updating Password...
              </>
            ) : (
              <>
                Update Password
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
