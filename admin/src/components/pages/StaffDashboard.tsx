import React from "react";
import { Outlet } from "react-router-dom";
import PopupMenu from "../PopupMenu";
import StaffSidebar from "./StaffSidebar";

const StaffDashboard: React.FC = () => {
  const handleLogout = () => alert("Staff Logged Out");

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
          <PopupMenu username="Staff User" role="Staff" onLogout={handleLogout} />
        </div>

        {/* Nested (child) pages */}
        <Outlet />
      </div>
    </div>
  );
};

export default StaffDashboard;
