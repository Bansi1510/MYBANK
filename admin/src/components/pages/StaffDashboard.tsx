import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PopupMenu from "../PopupMenu";
import StaffSidebar from "./StaffSidebar";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/Slices/authSlice";
import type { RootState } from "../../redux/store";

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/")
  }
  const staff = useSelector((state: RootState) => state.auth.userData);

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
          <PopupMenu adminStaff={staff} onLogout={handleLogout} />
        </div>

        {/* Nested (child) pages */}
        <Outlet />
      </div>
    </div>
  );
};

export default StaffDashboard;
