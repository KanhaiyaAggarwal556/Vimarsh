import PropTypes from "prop-types";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

const MobileToggleButton = ({ open, setOpen }) => (
  <button
    className="btn d-lg-none position-fixed"
    style={{ 
      top: 15, 
      width: 20,
      zIndex:10,
      backgroundColor: SIDEBAR_CONFIG.backgroundColor,
      // border: "1px solid #333",
      color: "#fff"
    }}
    onClick={() => setOpen((v) => !v)}
    aria-label="Toggle sidebar"
  >
    {open ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
  </button>
);

MobileToggleButton.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default MobileToggleButton;