import React from "react";

import AccountHeader from "../accounts/AccountHeader";
import AccountContainer from "../accounts/AccountContainer";
import InsightsPanel from "../accounts/InsightsPanel";
import AccountActions from "../accounts/AccountActions";
import RecentTransactions from "../accounts/RecentTransactions";

const Accounts: React.FC = () => {
  const accounts = [
    {
      account_number: "27069615575690",
      account_type: "Savings",
      balance: 70000,
      status: "active",
      created_at: "2025-11-20T01:04:47.251Z",
    },
  ];

  const recentTx = [
    { id: 1, title: "UPI Payment", amount: -1299, date: "2025-11-21" },
    { id: 2, title: "Salary Credit", amount: 42000, date: "2025-11-20" },
  ];

  return (
    <div className="w-full px-6 py-6 bg-[#f8fafc] flex flex-col gap-8">
      <AccountHeader />

      <AccountContainer accounts={accounts} />

      <InsightsPanel accounts={accounts} />

      <AccountActions />

      <RecentTransactions transactions={recentTx} />
    </div>
  );
};

export default Accounts;
