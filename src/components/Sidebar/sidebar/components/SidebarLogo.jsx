import { Link } from "react-router-dom";
import logo from "../../../../assets/twooter-logo2.png"; // Adjust the path as necessary
const SidebarLogo = () => (
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
      <img
        src={logo}
        alt="Twooter Logo"
        className="rounded-circle"
        style={{ width: 40, height: 40, objectFit: "cover" }}
      />
      <span className="fs-4 fw-bold text-white ms-2">Twooter</span>
    </Link>
  </div>
);

export default SidebarLogo;