import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../common/PageHeader";

const LoanService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <PageHeader
        title="Loan Services"
        subtitle="Manage your loan payments and view loan details."
      />

      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Loan EMI */}
        <div
          onClick={() => navigate("/services/loan/emi")}
          className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-md transition"
        >
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Pay Loan EMI
          </h3>
          <p className="text-gray-500 text-sm">
            Make EMI payments securely for your active loans.
          </p>
        </div>

        {/* Loan Details */}
        <div
          onClick={() => navigate("/services/loan/details")}
          className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-md transition"
        >
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Loan Details
          </h3>
          <p className="text-gray-500 text-sm">
            View loan summary, tenure, and repayment information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanService;
