import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

const NavigationItem = ({ to, icon, label, pathname, onClick }) => (
  <li className="w-100">
    <Link
      to={to}
      className="nav-link text-white w-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: pathname === to ? SIDEBAR_CONFIG.activeColor : "transparent",
        color: "#fff",
        fontWeight: pathname === to ? "bold" : "normal",
        borderRadius: SIDEBAR_CONFIG.itemBorderRadius,
        transition: "background-color 0.3s, color 0.3s, border-radius 0.3s",
        minHeight: 48,
      }}
      onClick={onClick}
    >
      {icon}
      {label}
    </Link>
  </li>
);

NavigationItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default NavigationItem;