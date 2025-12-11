import React from "react";
import { NavLink } from "react-router-dom";

const sidebarOptions = [
  { name: "Accounts Management", path: "accounts" },
  { name: "Staff Management", path: "staff" },
  { name: "Customer KYC", path: "kyc" },
  { name: "All Transactions", path: "transactions" },
  { name: "Loan Approval", path: "loans" },
  { name: "Reports", path: "reports" },
  { name: "Requests", path: "requests" },
  { name: "Settings", path: "settings" },
];

const AdminSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-6 text-center">Admin Menu</h2>
      <nav className="flex-1 flex flex-col gap-2">
        {sidebarOptions.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block p-3 rounded cursor-pointer hover:bg-gray-200 ${isActive ? "bg-blue-200 font-semibold" : ""
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
