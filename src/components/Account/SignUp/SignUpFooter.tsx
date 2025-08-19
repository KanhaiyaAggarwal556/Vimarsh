import React from "react";

const SignUpFooter: React.FC = () => {
  return (
    <div className="signup-prompt">
      <p className="signup-text">
        Already have an account?{" "}
        <a href="/i/account/login" className="signin-link">
          Sign in
        </a>
      </p>
    </div>
  );
};

export default SignUpFooter;