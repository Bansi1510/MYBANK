import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PopupMenu from "../PopupMenu";
import AdminSidebar from "./AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { clearUser } from "../../redux/Slices/authSlice";


const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/")
  }
  const admin = useSelector((state: RootState) => state.auth.userData);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <PopupMenu adminStaff={admin || null} onLogout={handleLogout} />
        </div>

        {/* Nested route content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
