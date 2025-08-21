import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/Vimarsh-logo2.png"; // Adjust the path as necessary

const SidebarLogo: React.FC = () => (
  <div
    className="w-100 d-none d-sm-flex align-items-center mb-4 px-3"
    style={{
      justifyContent: "flex-start",
      gap: "0.75rem",
      position: "absolute",
      top: "0.7rem",
      left: "3rem",
      height: "5rem",
    }}
  >
    <Link to="/" className="d-flex align-items-center text-decoration-none">
      <div
        style={{
          width: 35, // Increased from 30 to 40
          height: 35, // Increased from 30 to 40
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}
      >
        <img 
          src={logo} 
          alt="Vimarsh Logo" 
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      </div>
      <span 
        className="fs-3 fw-bold ms-2" // Changed from fs-4 to fs-3 for larger text
        style={{
          fontWeight: "600",
          letterSpacing: "0.3px",
          textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
          background: "linear-gradient(180deg, #6d7197f3 0%, #002486ec 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}
      >
        Vimarsh
      </span>
    </Link>
  </div>
);

export default SidebarLogo;