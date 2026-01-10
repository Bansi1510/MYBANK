import React, { useEffect, useState } from "react";
import { downloadStatementAPI, getMyTransactionHistory, type Transaction } from "../services/transaction.service";
import { CheckCircle, XCircle, AlertTriangle, ArrowUp, ArrowDown, Repeat } from "lucide-react";

const MyTransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchTransactions = async (start?: string, end?: string) => {
    setLoading(true);
    const data = await getMyTransactionHistory(start, end);
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilter = () => {
    fetchTransactions(startDate, endDate);
  };

  const handleDownload = async () => {
    console.log("Download Statement:", { start_date: startDate, end_date: endDate });
    await downloadStatementAPI(startDate, endDate);
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading transactions...
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="p-10 text-center text-gray-500">
        No transactions found
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="text-green-600 w-5 h-5 inline mr-1" />;
      case "failed":
        return <XCircle className="text-red-600 w-5 h-5 inline mr-1" />;
      default:
        return <AlertTriangle className="text-yellow-600 w-5 h-5 inline mr-1" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDown className="text-green-600 w-5 h-5 inline mr-1" />;
      case "withdraw":
        return <ArrowUp className="text-red-600 w-5 h-5 inline mr-1" />;
      case "transfer":
        return <Repeat className="text-blue-600 w-5 h-5 inline mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Transaction History
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition self-end"
        >
          Apply Filter
        </button>
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow transition"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">

              <div>
                <p className="font-medium text-gray-900">Type</p>
                <p className="capitalize flex items-center">
                  {getTypeIcon(tx.transaction_type)}
                  {tx.transaction_type}
                </p>
              </div>

              <div>
                <p className="font-medium text-gray-900">Amount</p>
                <p>₹{Number(tx.amount).toLocaleString()} ({tx.currency})</p>
              </div>

              <div>
                <p className="font-medium text-gray-900">From Account</p>
                <p>{tx.from_account || "-"}</p>
              </div>

              <div>
                <p className="font-medium text-gray-900">To Account</p>
                <p>{tx.to_account || "-"}</p>
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <p className="font-medium text-gray-900">Description</p>
                <p>{tx.description || "-"}</p>
              </div>

              <div>
                <p className="font-medium text-gray-900">Status</p>
                <p className="capitalize flex items-center text-xs font-semibold px-2 py-1 rounded-full
                  bg-gray-100 text-gray-800">
                  {getStatusIcon(tx.status)}
                  {tx.status}
                </p>
              </div>

              <div>
                <p className="font-medium text-gray-900">Created At</p>
                <p>{new Date(tx.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Download Button */}
      <div className="mt-6 text-right">
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
        >
          Download Statement
        </button>
      </div>
    </div>
  );
};

export default MyTransactionHistory;
