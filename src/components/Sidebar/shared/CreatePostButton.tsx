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
  <div className="flex justify-center pe-3 w-full justify-center mt-0" style={{ marginLeft: isResponsive ? 0 : "11rem" }}>
    <Link
      to="/createpost"
      className="btn fw-bold flex items-center justify-center min-h-[52px] max-w-[200px] px-6 transition-all duration-300"
      style={{
        backgroundColor:
          pathname === "/createpost"
            ? SIDEBAR_CONFIG.createPostActiveColor 
            : "#fff",
        color: pathname === "/createpost" ? "#fff" : "#3949ab",
        border: "none",
        fontWeight: "bold",
        borderRadius: SIDEBAR_CONFIG.createPostBorderRadius,
        boxShadow:
          pathname === "/createpost"
            ? "0 0 0 0.2rem rgba(57, 72, 171, 0.22)"
            : "none",
      }}
      onClick={onLinkClick}
    >
      <AiOutlinePlusCircle className="me-2" />
      Create Post
    </Link>
  </div>
);

export default CreatePostButton;