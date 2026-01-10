// CustomerAccounts.tsx
import React from "react";
import { Outlet, Link, useMatch } from "react-router-dom";

const CustomerAccounts: React.FC = () => {
  const match = useMatch("/staff/customer-accounts/*");
  const isChildActive = !!match?.pathname.split("/")[3];

  const actions = [
    { label: "New Bank Account Request", desc: "Create a new customer account", link: "new-account" },
    { label: "Update Customer Details", desc: "Modify customer information", link: "update-customer" },
    { label: "View All Accounts", desc: "Check all active accounts", link: "all-accounts" },
    { label: "Block/Unblock Account", desc: "Manage account status", link: "block-account" },
    { label: "KYC Verification", desc: "Verify customer identity", link: "kyc" },
    { label: "Close Account", desc: "Permanently close an account", link: "close-account" },
    { label: "Transaction History", desc: "View customer transactions", link: "transactions" },
  ];

  return (
    <div className="min-h-screen">
      {/* Show grid only if no child is active */}
      {!isChildActive && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Customer Accounts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((item) => (
              <Link
                key={item.link}
                to={item.link} // relative link
                className="block bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition text-center font-medium py-8 px-4 w-full"
              >
                <div className="text-lg font-semibold">{item.label}</div>
                <div className="text-sm opacity-80 mt-1">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className={isChildActive ? "min-h-screen flex items-center justify-center bg-gray-50" : "mt-6"}>
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerAccounts;
