import React from "react";

const AccountHeader: React.FC = () => {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <h2 className="text-3xl font-semibold text-gray-900">Your Accounts</h2>
      <p className="text-gray-600 mt-1">
        Manage balances, insights and recent transactions.
      </p>
    </div>
  );
};

export default AccountHeader;
