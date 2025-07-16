import "./UserPageLayout.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import UserProvider from "../../../Store/user-list-store.jsx";
import RightSidebar from "../../../components/RightSidebar/RightSidebar.jsx";
function UserPageLayout() {
  return (
    <UserProvider>
      <div className="main">
        <Sidebar />
        <div className="body">
          <Outlet />
        </div>
        <RightSidebar/>
      </div>
    </UserProvider>
  );
}

export default UserPageLayout;
