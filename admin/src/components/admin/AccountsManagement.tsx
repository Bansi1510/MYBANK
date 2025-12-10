import React from "react";

const AccountsManagement: React.FC = () => {
  // Array of buttons with title and optional description
  const actions = [
    { title: "New Account Requests", description: "View and approve new accounts" },
    { title: "Loan Requests", description: "Check and approve loans" },
    { title: "Transaction History", description: "View all transactions" },
    { title: "Active Accounts", description: "Manage all active accounts" },
    { title: "Closed Accounts", description: "View closed accounts" },
    { title: "Account Reports", description: "Generate account reports" },
    { title: "Account Alerts", description: "Monitor account alerts" },
    { title: "Settings", description: "Manage account settings" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Accounts Management</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="bg-blue-600 text-white p-4 rounded-lg shadow hover:bg-blue-700 transition-colors flex flex-col justify-between"
          >
            <span className="font-semibold">{action.title}</span>
            <span className="text-sm text-blue-100">{action.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountsManagement;
