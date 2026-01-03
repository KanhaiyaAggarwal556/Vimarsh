import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/Vimarsh-logo2.png"; // Adjust the path as necessary

const SidebarLogo: React.FC = () => (
  <div className="w-full hidden sm:flex items-center mb-4 px-3 justify-start gap-3 absolute top-3 left-12 h-20">
    <Link to="/" className="flex items-center no-underline">
      <div className="w-[35px] h-[35px] rounded-full overflow-hidden flex items-center justify-center shadow-md">
        <img 
          src={logo} 
          alt="Vimarsh Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      <span 
        className="text-3xl font-bold ml-2"
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