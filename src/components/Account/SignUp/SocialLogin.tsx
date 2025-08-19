import React from "react";

type SocialProvider = "Google" | "Facebook" | "LinkedIn" | "X";

interface Props {
  isLoading: boolean;
}

const SocialLogin: React.FC<Props> = ({ isLoading }) => {
  const handleSocialLogin = (provider: SocialProvider): void => {
    const socialUrls: Record<SocialProvider, string> = {
      Google: `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
      Facebook: `${import.meta.env.VITE_API_BASE_URL}/auth/facebook`,
      LinkedIn: `${import.meta.env.VITE_API_BASE_URL}/auth/linkedin`,
      X: `${import.meta.env.VITE_API_BASE_URL}/auth/twitter`,
    };

    // Store current URL for potential redirect back
    sessionStorage.setItem('preAuthUrl', window.location.pathname);

    // Redirect to OAuth provider
    window.location.href = socialUrls[provider];
  };

  return (
    <div className="social-login-section">
      <div className="or-divider">
        <span className="or-text">or</span>
      </div>
      <div className="social-icons">
        <button
          onClick={() => handleSocialLogin("Google")}
          className="social-icon-button social-google"
          title="Continue with Google"
          type="button"
          disabled={isLoading}
        >
          <div className="social-icon google-icon">G</div>
        </button>
        <button
          onClick={() => handleSocialLogin("Facebook")}
          className="social-icon-button social-facebook"
          title="Continue with Facebook"
          type="button"
          disabled={isLoading}
        >
          <div className="social-icon facebook-icon">f</div>
        </button>
        <button
          onClick={() => handleSocialLogin("LinkedIn")}
          className="social-icon-button social-linkedin"
          title="Continue with LinkedIn"
          type="button"
          disabled={isLoading}
        >
          <div className="social-icon linkedin-icon">in</div>
        </button>
        <button
          onClick={() => alert("Twitter OAuth coming soon!")}
          className="social-icon-button social-x"
          title="Continue with X (Coming Soon)"
          type="button"
          disabled
        >
          <div className="social-icon x-icon">𝕏</div>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;