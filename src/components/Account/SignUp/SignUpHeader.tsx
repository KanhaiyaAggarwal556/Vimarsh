import React from "react";
import logo from "@/assets/Vimarsh-logo2.png";

const SignUpHeader: React.FC = () => {
  return (
    <div className="brand-section">
      <div className="logo">
        <div className="logo-icon">
          <img src={logo} alt="Vimarsh Logo" className="logo-image" />
        </div>
        <h1 className="brand-name">Vimarsh</h1>
      </div>
      <p className="brand-tagline">Your gateway to endless possibilities</p>
    </div>
  );
};

export default SignUpHeader;