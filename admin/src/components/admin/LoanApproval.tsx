import React from "react";
import { Outlet, Link, useMatch } from "react-router-dom";

const LoanApproval: React.FC = () => {
  const match = useMatch("/admin/loan/*");
  const isChildActive = !!match?.pathname.split("/")[3];

  const actions = [
    {
      label: "Pending Loan Requests",
      desc: "Review and approve new loan applications",
      link: "pending",
    },
    {
      label: "Approved Loans",
      desc: "View approved loan records",
      link: "approved",
    },
    {
      label: "Rejected Loans",
      desc: "View rejected loan applications",
      link: "rejected",
    },
    {
      label: "Loan Disbursements",
      desc: "Track disbursed loan amounts",
      link: "disbursements",
    },
    {
      label: "Loan Documents",
      desc: "Verify submitted loan documents",
      link: "documents",
    },
    {
      label: "Loan Reports",
      desc: "Generate loan analytics and reports",
      link: "reports",
    },
    {
      label: "Interest Settings",
      desc: "Manage loan interest configurations",
      link: "interest-settings",
    },
    {
      label: "Loan Alerts",
      desc: "Monitor loan-related alerts",
      link: "alerts",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* DASHBOARD GRID */}
      {!isChildActive && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Loan Approval & Management</h2>

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

export default LoanApproval;
