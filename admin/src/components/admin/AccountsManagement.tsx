import React from "react";
import { Outlet, Link, useMatch } from "react-router-dom";

const AccountsManagement: React.FC = () => {
  const match = useMatch("/admin/accounts/*");
  const isChildActive = !!match?.pathname.split("/")[3];

  const actions = [
    { title: "New Account Requests", desc: "View and approve new accounts", link: "new-requests" },
    { title: "New Account Requests History", desc: "View approved and rejected  new account req", link: "acc-req-history" },
    { title: "Active Accounts", desc: "Manage all active accounts", link: "active" },
    { title: "Closed Accounts", desc: "View closed accounts", link: "closed" },
  ];

  return (
    <div className="min-h-screen">

      {!isChildActive && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Accounts Management</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="block bg-blue-600 text-white p-6 rounded-xl shadow hover:bg-blue-700 transition text-center"
              >
                <div className="text-lg font-semibold">{item.title}</div>
                <div className="text-sm opacity-80 mt-1">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Child Components Appear Here (TOP ALIGNED) */}
      <div className={isChildActive ? "min-h-screen bg-gray-50 p-6" : "mt-6"}>
        <Outlet />
      </div>
    </div>
  );
};

export default AccountsManagement;
