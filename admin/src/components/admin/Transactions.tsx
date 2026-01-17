import React from "react";
import { Outlet, Link, useOutlet } from "react-router-dom";

const Transactions: React.FC = () => {
  const outlet = useOutlet();
  const isChildActive = !!outlet;

  const actions = [
    {
      label: "All Transactions",
      desc: "View all customer transactions",
      link: "all-transactions",
    },
    {
      label: "Staff Transactions",
      desc: "Transactions performed by staff",
      link: "staff-transactions",
    },
    {
      label: "Cash Deposit",
      desc: "Deposit cash into customer account",
      link: "cash-deposit",
    },
    {
      label: "Cash Withdrawal",
      desc: "Withdraw cash from customer account",
      link: "cash-withdrawal",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {!isChildActive && (
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6 text-gray-900">
            Transaction Management
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className="bg-green-600 text-white rounded-lg p-5 shadow-sm hover:bg-green-700 transition"
              >
                <div className="font-semibold">
                  {item.label}
                </div>
                <div className="text-sm text-green-100 mt-1">
                  {item.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className={isChildActive ? "p-4 bg-gray-100 min-h-screen" : ""}>
        <Outlet />
      </div>
    </div>
  );
};

export default Transactions;
