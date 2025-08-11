import "./MainLayoutPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import React from "react";
// import RightSidebar from "../../components/RightSidebar/RightSidebar";

const SearchPageLayout: React.FC = () => {
  return (
      <div className="main">
        <Sidebar />
        <div className="body">
          <Outlet />
        </div>
      </div>
  );
};

export default SearchPageLayout;