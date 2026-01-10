// CustomerLoan.tsx
import React from "react";
import { Outlet, Link, useMatch } from "react-router-dom";

const CustomerLoan: React.FC = () => {
  // ✅ FIXED PATH (singular loan)
  const match = useMatch("/staff/customer-loan/*");
  const isChildActive = !!match?.pathname.split("/")[3];

  const actions = [
    {
      label: "Apply New Loan",
      desc: "Submit a new loan application",
      link: "apply-loan",
    },
    {
      label: "Loan Applications",
      desc: "View all loan requests",
      link: "loan-applications",
    },
    {
      label: "Approve / Reject Loan",
      desc: "Process pending loan requests",
      link: "loan-approval",
    },
    {
      label: "Active Loans",
      desc: "View running customer loans",
      link: "active-loans",
    },
    {
      label: "Loan  EMI Payment",
      desc: "monthly loan EMI payment",
      link: "loan-emi-payment",
    },

  ];

  return (
    <div className="min-h-screen">
      {/* DASHBOARD GRID */}
      {!isChildActive && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Customer Loans</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className="block bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition text-center font-medium py-8 px-4 w-full"
              >
                <div className="text-lg font-semibold">{item.label}</div>
                <div className="text-sm opacity-80 mt-1">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CHILD ROUTES */}
      <div className={isChildActive ? "bg-gray-50 p-6" : "mt-6"}>
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerLoan;
