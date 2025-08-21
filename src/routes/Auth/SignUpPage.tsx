import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@store/useAuthStore";
import SignUpHeader from "@/components/Account/SignUp/SignUpHeader";
import SignUpForm from "@/components/Account/SignUp/SignUpForm";
import SocialLogin from "@/components/Account/SignUp/SocialLogin";
import SignUpFooter from "@/components/Account/SignUp/SignUpFooter";
import Footer from "@/components/Account/Login/Footer";
import "./Signup.css";

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

interface SignupData {
  fullName: string;
  userName: string;
  email: string;
  password: string;
}

export default function Signup(): JSX.Element {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Check for social login completion
  useEffect(() => {
    const checkSocialLoginCompletion = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hasError = urlParams.get("error");
      
      if (hasError) {
        console.error("Social login error:", hasError);
        const errorMessages: Record<string, string> = {
          'google_auth_failed': 'Google authentication failed. Please try again.',
          'facebook_auth_failed': 'Facebook authentication failed. Please try again.',
          'linkedin_auth_failed': 'LinkedIn authentication failed. Please try again.',
          'oauth_no_user': 'Social login failed. Please try again.',
          'oauth_error': 'Authentication error occurred. Please try again.'
        };
        
        const errorMessage = errorMessages[hasError] || 'Authentication failed. Please try again.';
        setErrors({ email: errorMessage });
        
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    checkSocialLoginCompletion();
  }, [navigate]);

  const handleSignup = async (userData: SignupData) => {
    try {
      const result = await register(userData);
      
      if (result.success && result.user) {
        console.log("Signup successful:", result);
        navigate("/home");
      } else {
        setErrors({ email: result.message || "Signup failed" });
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setErrors({ email: "An unexpected error occurred. Please try again." });
    }
  };

  const handleFormSubmit = async () => {
    const signupData: SignupData = {
      fullName: formData.name.trim(),
      userName: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    await handleSignup(signupData);
  };

  const handleFormChange = (newFormData: FormData) => {
    setFormData(newFormData);
  };

  const handleErrorsChange = (newErrors: FormErrors) => {
    setErrors(newErrors);
  };

  return (
    <div className="signup-page-container">
      <div className="signup-page-content">
        <div className="signup-container">
          <div className="signup-wrapper">
            <SignUpHeader />
            
            <div className="signup-form">
              {/* Display general error message */}
              {errors.email && !formData.email && (
                <div className="error-message general-error">
                  {errors.email}
                </div>
              )}

              <SignUpForm 
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                onFormChange={handleFormChange}
                onErrorsChange={handleErrorsChange}
                onSubmit={handleFormSubmit}
              />

              <SocialLogin isLoading={isLoading} />

              <SignUpFooter />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}