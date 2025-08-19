import React from "react";
import logo from "@/assets/Vimarsh-logo2.png";
import "./styles/BrandHeader.css"; // Assuming you have a CSS file for styling

const BrandHeader: React.FC = () => {
  return (
    <div className="brand-section">
      <div className="logo">
        <div className="logo-icon">
          <img src={logo} alt="Vimarsh Logo" className="logo-image" />
        </div>
        <h1 className="brand-name">Vimarsh</h1>
      </div>
      <p className="brand-tagline">
        Welcome back to your social universe
      </p>
    </div>
  );
};

export default BrandHeader;