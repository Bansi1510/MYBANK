import React from "react";
import { Outlet } from "react-router-dom";
import PopupMenu from "../PopupMenu";
import Sidebar from "./Sidebar";

const AdminDashboard: React.FC = () => {
  const handleLogout = () => alert("Admin Logged Out");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <PopupMenu username="Admin User" role="Admin" onLogout={handleLogout} />
        </div>

        {/* Nested route content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
