import React from "react";
import { NavLink } from "react-router-dom";

const staffOptions = [
  { name: "Customer Accounts", path: "customer-accounts" },
  { name: "Customer Loans", path: "customer-loan" },
  { name: "customer cards ", path: "cutomer-card" },
  { name: "KYC Verification", path: "kyc" },
  { name: "Daily Transactions", path: "transactions" },
  { name: "Cash Deposit / Withdraw", path: "cash" },
  { name: "Passbook Printing", path: "passbook" },
  { name: "Fund Transfer", path: "fund-transfer" },
  { name: "Customer Requests", path: "requests" },
  { name: "Settings", path: "settings" }
];

const StaffSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-6 text-center">Staff Menu</h2>

      <nav className="flex-1 flex flex-col gap-2">
        {staffOptions.map((item) => (
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

export default StaffSidebar;
