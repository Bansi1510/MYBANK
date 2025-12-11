import React from "react";

const DailyTransactions: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Daily Transactions</h2>
      <p>
        Staff can view deposits, withdrawals, and other customer transactions.
      </p>
      {/* Add transactions table here */}
    </div>
  );
};

export default DailyTransactions;
