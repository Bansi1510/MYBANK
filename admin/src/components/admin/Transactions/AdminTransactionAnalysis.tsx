import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminTransactionAnalysis: React.FC = () => {
  const [data, setData] = useState<AnalysisData | null>(null);

  useEffect(() => {

  }, []);

  if (!data) return <p className="text-center text-gray-500 mt-10">Loading dashboard...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Transaction Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-semibold">{data.summary.total_transactions}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-semibold">{data.summary.total_amount}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Deposits</p>
          <p className="text-2xl font-semibold">{data.summary.total_deposit}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Withdrawals</p>
          <p className="text-2xl font-semibold">{data.summary.total_withdraw}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Transactions Line Chart */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Daily Transactions</h2>
          <Line data={data.daily} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>

        {/* Monthly Credit vs Debit Bar Chart */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Monthly Credit vs Debit</h2>
          <Bar data={data.monthly} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>

        {/* Transaction Type Distribution Pie Chart */}
        <div className="bg-white p-5 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Transaction Type Distribution</h2>
          <Pie data={data.typeDistribution} options={{ responsive: true, plugins: { legend: { position: "right" } } }} />
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionAnalysis;
