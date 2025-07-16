import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

const CreatePostButton = ({ pathname, onLinkClick, isResponsive = false }) => (
  <div
    className="d-flex justify-content-center pe-3"
    style={{
      marginLeft: isResponsive ? 0 : "11rem",
      width: "100%",
      justifyContent: "center",
    }}
  >
    <Link
      to="/createpost"
      className="btn fw-bold d-flex align-items-center justify-content-center"
      style={{
        backgroundColor:
          pathname === "/create-post" 
            ? SIDEBAR_CONFIG.createPostActiveColor 
            : "#fff",
        color: pathname === "/create-post" ? "#fff" : "#3949ab",
        border: "none",
        fontWeight: "bold",
        borderRadius: SIDEBAR_CONFIG.createPostBorderRadius,
        transition: "background-color 0.3s, color 0.3s, border-radius 0.3s, box-shadow 0.3s",
        boxShadow:
          pathname === "/create-post"
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

CreatePostButton.propTypes = {
  pathname: PropTypes.string.isRequired,
  onLinkClick: PropTypes.func,
  isResponsive: PropTypes.bool,
};

export default CreatePostButton;