import React from "react";

interface Tx {
  id: number;
  title: string;
  amount: number;
  date: string;
}

interface Props {
  transactions: Tx[];
}

const RecentTransactions: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Recent Transactions
      </h3>

      <div className="flex flex-col divide-y">
        {transactions.map((t) => (
          <div key={t.id} className="py-3 flex justify-between">
            <div>
              <p className="font-medium text-gray-800">{t.title}</p>
              <p className="text-gray-500 text-sm">{t.date}</p>
            </div>

            <span
              className={`font-semibold ${t.amount < 0 ? "text-red-600" : "text-green-600"
                }`}
            >
              {t.amount < 0 ? "-" : "+"}₹{Math.abs(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
