import React from "react";
import { Outlet, Link, useOutlet } from "react-router-dom";

const CardManagement: React.FC = () => {
  const outlet = useOutlet();
  const isChildActive = !!outlet;

  const actions = [
    { label: "Card Requests", desc: "Review and process card requests", link: "card-requests" },
    { label: "Issued Cards", desc: "View all active customer cards", link: "issued-cards" },
    { label: "Approve / Reject", desc: "Handle pending approvals", link: "approvals" },
    { label: "Block / Unblock", desc: "Control card security status", link: "block-unblock" },
    { label: "Limit Management", desc: "Update card usage limits", link: "card-limits" },
    { label: "Card Replacement", desc: "Manage replacement requests", link: "replacements" },
    { label: "Virtual Cards", desc: "Administer virtual cards", link: "virtual-cards" },
    { label: "Card Logs", desc: "Audit card-related activities", link: "card-logs" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {!isChildActive && (
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6 text-gray-900">
            Card Management
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className="bg-blue-600 text-white rounded-lg p-5 shadow-sm hover:bg-blue-700 transition"
              >
                <div className="font-semibold">
                  {item.label}
                </div>
                <div className="text-sm text-blue-100 mt-1">
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

export default CardManagement;
