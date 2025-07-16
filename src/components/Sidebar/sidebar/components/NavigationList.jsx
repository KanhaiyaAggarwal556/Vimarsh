import PropTypes from "prop-types";
import NavigationItem from "./NavigationItem";
import { NAV_ITEMS } from "../config/sidebarConfig";

const NavigationList = ({ pathname, onLinkClick, isResponsive = false }) => (
  <ul
    className="nav nav-pills flex-column mb-auto w-100"
    style={{
      gap: "0.5rem",
      marginTop: isResponsive ? "1rem" : "2rem",
      marginBottom: isResponsive ? "1rem" : "2rem",
      alignItems: "center",
      paddingRight: isResponsive ? 0 : "1rem",
      paddingLeft: isResponsive ? 0 : "11rem",
    }}
  >
    {NAV_ITEMS.map(({ to, icon, label }) => (
      <NavigationItem
        key={to}
        to={to}
        icon={icon}
        label={label}
        pathname={pathname}
        onClick={onLinkClick}
      />
    ))}
  </ul>
);

NavigationList.propTypes = {
  pathname: PropTypes.string.isRequired,
  onLinkClick: PropTypes.func,
  isResponsive: PropTypes.bool,
};

export default NavigationList;