import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../common/PageHeader";

const UPIService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50   p-6 md:p-10">
      <PageHeader
        title="UPI Payments"
        subtitle="Fast, secure transfers. Choose between sending to a mobile number or directly to a bank account."
      />

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          onClick={() => navigate("/services/upi/mobile")}
          className="bg-white  border border-gray-200 dark:border-gray-800 rounded-2xl p-6 cursor-pointer hover:shadow-md transition"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg className="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5h18v2H3zM3 11h18v2H3zM3 17h18v2H3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Send to Mobile</h3>
              <p className="text-gray-500 text-sm">Instant transfer using recipient's mobile number.</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate("/services/upi/account")}
          className="bg-white   border border-gray-200 dark:border-gray-800 rounded-2xl p-6 cursor-pointer hover:shadow-md transition"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg className="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 7l10 5v7l-10-5-10 5v-7l10-5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Send to Account</h3>
              <p className="text-gray-500 text-sm">Transfer directly to a bank account with IFSC verification.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPIService;
