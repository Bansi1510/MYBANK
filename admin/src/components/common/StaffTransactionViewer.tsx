import React, { useState } from "react";
import { getTransactionDetailsByAccNo, type Transaction } from "../services/transaction.api";
const StaffTransactionViewer: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleGetDetails = async () => {
    console.log("Input Data:", { accountNumber, startDate, endDate });
    const data = await getTransactionDetailsByAccNo(accountNumber, startDate, endDate);
    setTransactions(data);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Staff/Admin Transaction Viewer
      </h1>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Account Number
          </label>
          <input
            type="text"
            placeholder="Enter account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleGetDetails}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Get Details
        </button>
      </div>

      {/* Transactions Table */}
      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg bg-white">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3 border-b">Date</th>
                <th className="px-4 py-3 border-b">Type</th>
                <th className="px-4 py-3 border-b text-right">Amount</th>
                <th className="px-4 py-3 border-b">From</th>
                <th className="px-4 py-3 border-b">To</th>
                <th className="px-4 py-3 border-b">Description</th>
                <th className="px-4 py-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-2 border-b">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b capitalize">{t.transaction_type}</td>
                  <td className="px-4 py-2 border-b text-right">{t.amount.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b">{t.from_account || "-"}</td>
                  <td className="px-4 py-2 border-b">{t.to_account || "-"}</td>
                  <td className="px-4 py-2 border-b">{t.description || "-"}</td>
                  <td className="px-4 py-2 border-b capitalize">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No transactions to display</p>
      )}
    </div>
  );
};

export default StaffTransactionViewer;
