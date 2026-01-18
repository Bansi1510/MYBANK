import React, { useState, useMemo } from "react";

interface Transaction {
  id: number;
  from_account: string | null;
  to_account: string | null;
  amount: number;
  transaction_type: "TRANSFER" | "DEPOSIT" | "WITHDRAW";
  created_at: string;
}

// Dummy data
const dummyTransactions: Transaction[] = [
  {
    id: 1,
    from_account: "1234567890",
    to_account: "0987654321",
    amount: 5000,
    transaction_type: "TRANSFER",
    created_at: "2026-01-17T05:00:00Z",
  },
  {
    id: 2,
    from_account: null,
    to_account: "1234567890",
    amount: 2000,
    transaction_type: "DEPOSIT",
    created_at: "2026-01-16T12:00:00Z",
  },
  {
    id: 3,
    from_account: "1234567890",
    to_account: null,
    amount: 1500,
    transaction_type: "WITHDRAW",
    created_at: "2026-01-15T09:30:00Z",
  },
];

const AllTransactions: React.FC = () => {
  const [transactions] = useState<Transaction[]>(dummyTransactions);
  const [filterType, setFilterType] = useState<"ALL" | "TRANSFER" | "DEPOSIT" | "WITHDRAW">("ALL");

  const filteredTransactions = useMemo(() => {
    if (filterType === "ALL") return transactions;
    return transactions.filter(t => t.transaction_type === filterType);
  }, [filterType, transactions]);

  const typeBadge = (type: Transaction["transaction_type"]) => {
    const base = "px-2 py-1 rounded text-xs font-semibold";
    if (type === "TRANSFER") return `${base} bg-blue-100 text-blue-700`;
    if (type === "DEPOSIT") return `${base} bg-green-100 text-green-700`;
    if (type === "WITHDRAW") return `${base} bg-red-100 text-red-700`;
    return base;
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">All Transactions</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by type:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "ALL" | "TRANSFER" | "DEPOSIT" | "WITHDRAW")}
          className="border rounded px-2 py-1"
        >
          <option value="ALL">All</option>
          <option value="TRANSFER">Transfer</option>
          <option value="DEPOSIT">Deposit</option>
          <option value="WITHDRAW">Withdraw</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">ID</th>
              <th className="p-3 text-left text-sm font-semibold">From Account</th>
              <th className="p-3 text-left text-sm font-semibold">To Account</th>
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
              filteredTransactions.map(t => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3">{t.from_account || "-"}</td>
                  <td className="p-3">{t.to_account || "-"}</td>
                  <td className="p-3">{t.amount}</td>
                  <td className="p-3">
                    <span className={typeBadge(t.transaction_type)}>
                      {t.transaction_type}
                    </span>
                  </td>
                  <td className="p-3">{new Date(t.created_at).toLocaleString()}</td>
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
