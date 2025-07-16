import "../MainLayoutPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import PostsProvider from "../../../Store/post-list-store.jsx";
import RightSidebar from "../../../components/RightSidebar/RightSidebar.jsx";
function MainLayoutPage() {
  return (
    <PostsProvider>
      <div className="main">
        <Sidebar />
        <div className="body">
          <Outlet />
        </div>
        <RightSidebar/>
      </div>
    </PostsProvider>
  );
}

export default MainLayoutPage;
