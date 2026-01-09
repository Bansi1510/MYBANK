// StaffTransactions.tsx
import React from "react";
import { Link, useOutlet } from "react-router-dom";

const StaffTransactions: React.FC = () => {
  const outlet = useOutlet();
  const isChildActive = !!outlet;

  const actions = [
    {
      label: "Account to Account Transfer",
      desc: "Transfer funds between accounts",
      link: "account-transfer",
    },
    {
      label: "Cash Transaction",
      desc: "Deposit or withdraw cash",
      link: "cash-transaction",
    },
    {
      label: "Transaction History",
      desc: "View all transactions",
      link: "transaction-history",
    },
    {
      label: "Revert Transaction",
      desc: "Reverse a failed transaction",
      link: "revert-transaction",
    },
    {
      label: "Pending Transactions",
      desc: "Approve pending transactions",
      link: "pending-transactions",
    },
    {
      label: "Daily Transaction Report",
      desc: "View daily transaction summary",
      link: "daily-report",
    },
    {
      label: "Transaction Limits",
      desc: "Manage transaction limits",
      link: "transaction-limits",
    },
  ];

  return (
    <div className="min-h-screen">
      {!isChildActive && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Staff Transactions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className="block bg-blue-500 text-white rounded-xl shadow
                           hover:bg-blue-600 transition text-center
                           font-medium py-8 px-4"
              >
                <div className="text-lg font-semibold">{item.label}</div>
                <div className="text-sm opacity-80 mt-1">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isChildActive && (
        <div className="min-h-screen bg-gray-50 p-6">
          {outlet}
        </div>
      )}
    </div>
  );
};

export default StaffTransactions;
