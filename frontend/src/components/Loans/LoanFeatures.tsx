import React from "react";
import { FaMoneyBillTrendUp, FaClock, FaUserShield } from "react-icons/fa6";

const LoanFeatures: React.FC = () => {
  const features = [
    {
      icon: FaMoneyBillTrendUp,
      title: "Low Interest Rates",
      text: "Flexible EMI options with reduced interest burden.",
    },
    {
      icon: FaClock,
      title: "Quick Approval",
      text: "Most loan applications get approved within 24 hours.",
    },
    {
      icon: FaUserShield,
      title: "Secure & Trusted",
      text: "Your data and funds are protected with bank-grade security.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((item, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition"
        >
          <item.icon className="text-4xl text-blue-600 mb-3" />
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <p className="text-gray-500 text-sm mt-1">{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default LoanFeatures;
