import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@store/useAuthStore";
import EmailStep from "@/components/Account/ForgotPassword/EmailStep";
import OtpStep from "@/components/Account/ForgotPassword/OtpStep";
import ResetStep from "@/components/Account/ForgotPassword/ResetStep";
import SuccessStep from "@/components/Account/ForgotPassword/SuccessStep";
import './PasswordReset.css';

// Type definitions
export interface FormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  email?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
}

export type PageType = "email" | "otp" | "reset" | "success";

export default function PasswordResetSystem(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<PageType>("email");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [resetToken, setResetToken] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [otpTimer, setOtpTimer] = useState<number>(0);

  const navigate = useNavigate();
  
  const { 
    forgotPassword, 
    verifyOTP, 
    resetPassword, 
    resendOTP,
    error: authError,
    isLoading: authLoading,
    clearError 
  } = useAuthStore();

  const handleBackToLogin = (): void => {
    navigate("/i/account/login");
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

  const commonProps = {
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
  };

  const renderCurrentStep = () => {
    switch (currentPage) {
      case "email":
        return (
          <EmailStep
            {...commonProps}
            forgotPassword={forgotPassword}
            startOtpTimer={startOtpTimer}
          />
        );
      case "otp":
        return (
          <OtpStep
            {...commonProps}
            verifyOTP={verifyOTP}
            resendOTP={resendOTP}
            setResetToken={setResetToken}
            otpTimer={otpTimer}
            startOtpTimer={startOtpTimer}
          />
        );
      case "reset":
        return (
          <ResetStep
            {...commonProps}
            resetPassword={resetPassword}
            resetToken={resetToken}
          />
        );
      case "success":
        return <SuccessStep handleBackToLogin={handleBackToLogin} />;
      default:
        return null;
    }
  };

  return (
    <div className="pwd-reset-container">
      {renderCurrentStep()}
    </div>
  );
}