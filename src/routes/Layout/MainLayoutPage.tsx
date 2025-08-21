// MainLayoutPage.tsx - Enhanced with HomeContext for home button functionality
import "./MainLayoutPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import { HomeProvider } from "../../contexts/HomeContext";
import React from "react";

const MainLayoutPage: React.FC = () => {
  return (
    <HomeProvider>
      <div className="main">
        <Sidebar />
        <div className="body">
          <Outlet />
        </div>
        <RightSidebar />
      </div>
    </HomeProvider>
  );
};

export default MainLayoutPage;