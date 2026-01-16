import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getTransactionSummaryAPI, type Transaction, type TransactionDashboardData } from "../services/transaction.api";

const TransactionDashboard: React.FC = () => {
  const [filter, setFilter] = useState<"today" | "month" | "year">("today");
  const [showDetails, setShowDetails] = useState(false);
  const [summary, setSummary] = useState<TransactionDashboardData["summary"]>({
    total_transactions: 0,
    total_amount: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getTransactionSummaryAPI(filter);
      if (data) {
        setSummary(data.summary);
        setTransactions(data.transactions);
      } else {
        setSummary({ total_transactions: 0, total_amount: 0 });
        setTransactions([]);
        toast.error("No transactions found for this filter");
      }
      setLoading(false);
    };

    fetchData();
  }, [filter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Transaction Dashboard</h2>

      {/* Filter Buttons */}
      <div className="space-x-2 mb-4">
        {(["today", "month", "year"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded ${filter === t
              ? "bg-blue-600 text-white"
              : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-gray-500 text-sm">Total Transactions</p>
          <p className="text-2xl font-bold text-green-600">
            {loading ? "..." : summary.total_transactions}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-gray-500 text-sm">Total Amount (INR)</p>
          <p className="text-2xl font-bold text-blue-600">
            {loading ? "..." : `₹${summary.total_amount.toLocaleString("en-IN")}`}
          </p>
        </div>
      </div>

      {/* Show Details Button */}
      <div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Transaction Table */}
      {showDetails && (
        <div className="overflow-x-auto bg-white border rounded mt-4">
          {loading ? (
            <p className="p-4 text-gray-500">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="p-4 text-gray-500">No transactions found</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Account No</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">From</th>
                  <th className="p-3 text-left">To</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{tx.id}</td>
                    <td className="p-3 font-mono">{tx.account_number}</td>
                    <td className="p-3 capitalize">{tx.transaction_type}</td>
                    <td className="p-3">₹{tx.amount.toLocaleString("en-IN")}</td>
                    <td className="p-3 font-mono">{tx.from_account || "-"}</td>
                    <td className="p-3 font-mono">{tx.to_account || "-"}</td>
                    <td className="p-3">{tx.description || "-"}</td>
                    <td className="p-3 capitalize">{tx.status}</td>
                    <td className="p-3">{new Date(tx.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionDashboard;
