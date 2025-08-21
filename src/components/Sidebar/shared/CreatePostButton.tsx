import React from "react";
import { Link } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { SIDEBAR_CONFIG } from "@/config/navigationConfig";

interface CreatePostButtonProps {
  pathname: string;
  onLinkClick?: () => void;
  isResponsive?: boolean;
}

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ 
  pathname, 
  onLinkClick, 
  isResponsive = false 
}) => (
  <div
    className="d-flex justify-content-center pe-3"
    style={{
      marginLeft: isResponsive ? 0 : "11rem",
      width: "100%",
      justifyContent: "center",
      marginTop: "0", // Removed margin to eliminate gap with navigation
    }}
  >
    <Link
      to="/createpost"
      className="btn fw-bold d-flex align-items-center justify-content-center"
      style={{
        backgroundColor:
          pathname === "/createpost" // Fixed: changed from "/create-post" to "/createpost"
            ? SIDEBAR_CONFIG.createPostActiveColor 
            : "#fff",
        color: pathname === "/createpost" ? "#fff" : "#3949ab", // Fixed: changed from "/create-post" to "/createpost"
        border: "none",
        fontWeight: "bold",
        borderRadius: SIDEBAR_CONFIG.createPostBorderRadius,
        transition: "background-color 0.3s, color 0.3s, border-radius 0.3s, box-shadow 0.3s",
        boxShadow:
          pathname === "/createpost" // Fixed: changed from "/create-post" to "/createpost"
            ? "0 0 0 0.2rem rgba(57, 72, 171, 0.22)"
            : "none",
        minHeight: 52,
        maxWidth: 200,
        padding: "0rem 1.5rem",
      }}
      onClick={onLinkClick}
    >
      <AiOutlinePlusCircle className="me-2" />
      Create Post
    </Link>
  </div>
);

export default CreatePostButton;