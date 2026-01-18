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

interface Summary {
  total_transactions: number;
  total_amount: number;
  total_deposit: number;
  total_withdraw: number;
}

interface MonthlyData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

interface DailyData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface AnalysisData {
  daily: DailyData;
  monthly: MonthlyData;
  typeDistribution: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  summary: Summary;
}

const AdminTransactionAnalysis: React.FC = () => {
  const [data, setData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    // Dummy Data
    const dummyData: AnalysisData = {
      daily: {
        labels: ["2026-01-15", "2026-01-16", "2026-01-17", "2026-01-18"],
        datasets: [{ label: "Transactions", data: [5, 8, 3, 7], borderColor: "#3B82F6", backgroundColor: "#3B82F6" }],
      },
      monthly: {
        labels: ["2026-01", "2026-02", "2026-03"],
        datasets: [
          { label: "Credit", data: [15000, 12000, 18000], backgroundColor: "#10B981" },
          { label: "Debit", data: [7000, 5000, 9000], backgroundColor: "#EF4444" },
        ],
      },
      typeDistribution: {
        labels: ["TRANSFER", "DEPOSIT", "WITHDRAW"],
        datasets: [
          {
            label: "Transactions",
            data: [8, 10, 5],
            backgroundColor: ["#3B82F6", "#10B981", "#EF4444"],
          },
        ],
      },
      summary: {
        total_transactions: 23,
        total_amount: 37000,
        total_deposit: 12000,
        total_withdraw: 5000,
      },
    };

    setData(dummyData);
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
