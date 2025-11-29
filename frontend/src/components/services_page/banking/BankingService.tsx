import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../common/PageHeader";

const BankingService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50  p-6 md:p-10">
      <PageHeader title="Banking Services" subtitle="Manage accounts, view balance, and transfer funds securely." />

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          onClick={() => navigate("/services/banking/balance")}
          className="bg-white   border border-gray-200 dark:border-gray-800 rounded-2xl p-6 cursor-pointer hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Check Balance</h3>
          <p className="text-gray-500 text-sm">View available balance for your accounts instantly.</p>
        </div>

        <div
          onClick={() => navigate("/services/banking/transfer")}
          className="bg-white   border border-gray-200 dark:border-gray-800 rounded-2xl p-6 cursor-pointer hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Money Transfer</h3>
          <p className="text-gray-500 text-sm">Transfer money between accounts using UPI or account details.</p>
        </div>
      </div>
    </div>
  );
};

export default BankingService;
