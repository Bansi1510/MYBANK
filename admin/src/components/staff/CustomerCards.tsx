import React from "react";
import { Outlet, Link, useOutlet } from "react-router-dom";

const CustomerCards: React.FC = () => {
  const outlet = useOutlet();
  const isChildActive = !!outlet;

  const actions = [
    { label: "New Card Request", desc: "Request a new debit or credit card", link: "new-card" },
    { label: "View All Cards", desc: "See all issued customer cards", link: "all-cards" },
    { label: "Replace Card", desc: "Request replacement for lost or damaged card", link: "replace-card" },
    { label: "Card PIN Services", desc: "Generate or reset card PIN", link: "card-pin" },
  ];

  return (
    <div className="min-h-screen">
      {/* Show grid ONLY when no child route */}
      {!isChildActive && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Customer Cards</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className="block bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600 transition text-center font-medium py-8 px-4"
              >
                <div className="text-lg font-semibold">{item.label}</div>
                <div className="text-sm opacity-80 mt-1">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Child routes render here */}
      <div className={isChildActive ? "min-h-screen bg-gray-50 p-4" : "mt-6"}>
        <Outlet />
      </div>

    </div>
  );
};

export default CustomerCards;
