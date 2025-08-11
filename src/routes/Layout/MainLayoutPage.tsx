// MainLayoutPage.tsx
import "./MainLayoutPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import React from "react";

const MainLayoutPage: React.FC = () => {
  return (
      <div className="main">
        <Sidebar />
        <div className="body">
          <Outlet />
        </div>
        <RightSidebar />
      </div>
  );
};

export default MainLayoutPage;