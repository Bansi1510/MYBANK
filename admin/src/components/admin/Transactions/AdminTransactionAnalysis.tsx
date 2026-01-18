import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  getTransactionAnalysisAPI,
  type AnalysisData,
} from "../../services/tranasctionAnaystics.api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const AdminTransactionAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const res = await getTransactionAnalysisAPI();
      if (res) setAnalysis(res);
      setLoading(false);
    };
    fetchAnalysis();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading analytics...</p>;

  if (!analysis)
    return (
      <p className="text-center text-red-500 mt-10">
        Unable to load transaction analytics
      </p>
    );

  /* ================= CHART DATA ================= */

  const dailyChart = {
    labels: analysis.daily.labels,
    datasets: analysis.daily.datasets.map(ds => ({
      ...ds,
      borderColor: "#2563eb",
      backgroundColor: "rgba(37,99,235,0.2)",
      tension: 0.4,
      fill: true,
    })),
  };

  const monthlyChart = {
    labels: analysis.monthly.labels,
    datasets: analysis.monthly.datasets.map((ds, i) => ({
      ...ds,
      backgroundColor: i === 0 ? "#16a34a" : "#dc2626",
    })),
  };

  const typeChart = {
    labels: analysis.typeDistribution.labels,
    datasets: analysis.typeDistribution.datasets.map(ds => ({
      ...ds,
      backgroundColor: [
        "#2563eb",
        "#16a34a",
        "#dc2626",
        "#f59e0b",
        "#9333ea",
        "#0ea5e9",
      ],
    })),
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Bank Transaction Analytics
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Overview of transaction volume, financial flow, and distribution
        </p>
      </header>

      {/* ===== SUMMARY ===== */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Key Financial Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Transactions"
            value={analysis.summary.total_transactions}
          />
          <SummaryCard
            title="Total Amount Processed"
            value={`₹${Number(analysis.summary.total_amount).toLocaleString()}`}
          />
          <SummaryCard
            title="Total Deposits"
            value={`₹${Number(analysis.summary.total_deposit).toLocaleString()}`}
          />
          <SummaryCard
            title="Total Withdrawals"
            value={`₹${Number(analysis.summary.total_withdraw).toLocaleString()}`}
          />
        </div>
      </section>

      {/* ===== CHARTS ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard
          title="Daily Transaction Volume"
          subtitle="Number of transactions recorded per day"
        >
          <Line data={dailyChart} />
        </ChartCard>

        <ChartCard
          title="Monthly Credit vs Debit"
          subtitle="Comparison of incoming and outgoing funds"
        >
          <Bar data={monthlyChart} />
        </ChartCard>

        <ChartCard
          title="Transaction Type Distribution"
          subtitle="Breakdown by transaction channel"
          full
        >
          <div className="h-[320px]">
            <Pie
              data={typeChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "right" },
                },
              }}
            />
          </div>
        </ChartCard>
      </section>
    </div>
  );
};

/* ================= REUSABLE UI ================= */

const SummaryCard: React.FC<{ title: string; value: string | number }> = ({
  title,
  value,
}) => (
  <div className="bg-white p-5 rounded-lg shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
  </div>
);

const ChartCard: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  full?: boolean;
}> = ({ title, subtitle, children, full }) => (
  <div
    className={`bg-white p-5 rounded-lg shadow ${full ? "lg:col-span-2" : ""
      }`}
  >
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    {subtitle && (
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
    )}
    {children}
  </div>
);

export default AdminTransactionAnalysis;
