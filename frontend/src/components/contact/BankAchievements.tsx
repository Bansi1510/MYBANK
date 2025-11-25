import React from "react";
import { FaAward } from "react-icons/fa";

const BankAchievements: React.FC = () => {
  const achievements = [
    "Ranked top 10 most trusted banks worldwide (2023).",
    "Winner of Global Digital Banking Excellence Award (2022).",
    "Launched the world’s fastest cross-border payment system.",
    "Leader in financial inclusion efforts across Asia.",
    "Achieved 98% customer satisfaction rate.",
  ];

  return (
    <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
      <div className="flex items-center mb-6 gap-4">
        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-2xl">
          <FaAward />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Global Achievements</h2>
      </div>

      <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
        {achievements.map((item, index) => (
          <li key={index} className="pl-1">{item}</li>
        ))}
      </ul>
    </section>
  );
};

export default BankAchievements;
