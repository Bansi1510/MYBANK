import React from "react";

interface Account {
  balance: number;
}

interface Props {
  accounts: Account[];
}

const InsightsPanel: React.FC<Props> = ({ accounts }) => {
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h3 className="text-xl font-semibold text-gray-900">Financial Insights</h3>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-gray-600">Total Balance</span>
        <span className="text-green-600 text-2xl font-bold">
          ₹ {totalBalance.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default InsightsPanel;
