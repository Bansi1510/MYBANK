import React from "react";
import { FaHistory } from "react-icons/fa";

const BankHistory: React.FC = () => {
  return (
    <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
      <div className="flex items-center mb-6 gap-4">
        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-sky-50 text-sky-700 text-2xl">
          <FaHistory />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Bank History</h2>
      </div>

      <div className="max-w-3xl text-gray-700 space-y-5 leading-relaxed text-base sm:text-lg">
        <p>
          Founded in 1965, MyBank began as a cooperative financial institution
          focused on supporting local families in managing their savings.
        </p>
        <p>
          Over the years, MyBank has grown into a trusted global banking brand,
          serving over 80 million customers across 12 countries with commitment
          to innovation and customer service.
        </p>
        <p>
          Early adopter of digital transformation, launching one of India’s
          first mobile banking platforms in 2004, pushing the boundaries of
          modern banking.
        </p>
      </div>
    </section>
  );
};

export default BankHistory;
