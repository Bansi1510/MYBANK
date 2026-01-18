import React, { useEffect, useMemo, useState } from "react";
import { getAllTransactionsAPI } from "../../services/tranasctionAnaystics.api";
import type { Transaction } from "../../services/tranasctionAnaystics.api";

const AllTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<
    "all" | "deposit" | "transfer" | "upi" | "card" | "loan_payment" | "credit"
  >("all");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllTransactionsAPI();
      if (data) setTransactions(data);
    };
    fetchData();
  }, []);

  const filteredTransactions = useMemo(() => {
    if (filterType === "all") return transactions;
    return transactions.filter(
      (t) => t.transaction_type === filterType
    );
  }, [filterType, transactions]);

  const typeBadge = (type: Transaction["transaction_type"]) => {
    const base = "px-2 py-1 rounded text-xs font-semibold capitalize";

    if (type === "credit" || type === "deposit")
      return `${base} bg-green-100 text-green-700`;
    if (type === "transfer")
      return `${base} bg-blue-100 text-blue-700`;
    if (type === "upi")
      return `${base} bg-purple-100 text-purple-700`;
    if (type === "card")
      return `${base} bg-indigo-100 text-indigo-700`;
    if (type === "loan_payment")
      return `${base} bg-orange-100 text-orange-700`;

    return base;
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-800">
          All Transactions
        </h2>

        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as typeof filterType)
          }
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="credit">Credit</option>
          <option value="deposit">Deposit</option>
          <option value="transfer">Transfer</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="loan_payment">Loan Payment</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">ID</th>
              <th className="p-3 text-left text-sm font-semibold">From</th>
              <th className="p-3 text-left text-sm font-semibold">To</th>
              <th className="p-3 text-left text-sm font-semibold">Amount</th>
              <th className="p-3 text-left text-sm font-semibold">Type</th>
              <th className="p-3 text-left text-sm font-semibold">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3">{t.from_account || "-"}</td>
                  <td className="p-3">{t.to_account || "-"}</td>
                  <td className="p-3 font-medium">
                    ₹{Number(t.amount).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className={typeBadge(t.transaction_type)}>
                      {t.transaction_type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTransactions;
