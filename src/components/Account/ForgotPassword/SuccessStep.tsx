import { ArrowRight, CheckCircle } from "lucide-react";

interface SuccessStepProps {
  handleBackToLogin: () => void;
}

export default function SuccessStep({ handleBackToLogin }: SuccessStepProps): JSX.Element {
  return (
    <div className="pwd-reset-page pwd-reset-success-page">
      <div className="pwd-reset-header">
        <div className="pwd-reset-icon pwd-reset-success-icon">
          <CheckCircle size={40} />
        </div>
        <h1 className="pwd-reset-title">Password Reset Successful!</h1>
        <p className="pwd-reset-subtitle">
          Your password has been updated successfully. You can now sign in with your new password.
        </p>
      </div>

      <div className="pwd-reset-form-container">
        <button
          className="pwd-reset-submit-btn pwd-reset-success-btn"
          onClick={handleBackToLogin}
        >
          Back to Login
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}