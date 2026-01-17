import React from "react";
import { Link, useOutlet } from "react-router-dom";

const KYCVerification: React.FC = () => {
  const outlet = useOutlet();
  const isChildActive = !!outlet;

  const actions = [
    {
      label: "Create KYC",
      desc: "Verify customer KYC requests",
      link: "create",
    },
    {
      label: "Verified KYC",
      desc: "View approved KYC records",
      link: "verified",
    },
    {
      label: "Rejected KYC",
      desc: "View rejected KYC cases",
      link: "rejected",
    },
    {
      label: "Re-KYC Requests",
      desc: "Handle re-verification cases",
      link: "re-kyc",
    },
    {
      label: "Upload Documents",
      desc: "Add missing KYC documents",
      link: "upload-docs",
    },
    {
      label: "KYC Audit Logs",
      desc: "View verification history",
      link: "audit",
    },
  ];

  return (
    <div className="min-h-screen">
      {!isChildActive && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Staff KYC Management</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {actions.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className="block bg-green-600 text-white rounded-xl shadow
                           hover:bg-green-700 transition text-center
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

export default KYCVerification;
