import React from "react";
import PopupMenu from "../PopupMenu";

const StaffDashboard: React.FC = () => {
  const handleLogout = () => alert("Staff Logged Out");

  const options = [
    "Create Account",
    "Deposit",
    "Withdraw",
    "Account Search",
    "Customer Profile",
    "Passbook Issue",
    "Fund Transfer",
    "Daily Reports"
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <PopupMenu username="Staff User" role="Staff" onLogout={handleLogout} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {options.map((item) => (
          <div
            key={item}
            className="p-6 border shadow-sm rounded-lg cursor-pointer hover:bg-gray-50 text-center font-medium"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
