import React from "react";
import LoanCard from "./LoanCard";
import { FaHome, FaCar, FaBook, FaBriefcase } from "react-icons/fa";

const LoanCategoryGrid: React.FC = () => {
  const categories = [
    {
      icon: FaHome,
      title: "Home Loan",
      desc: "Buy your dream home with flexible EMI options.",
    },
    {
      icon: FaCar,
      title: "Vehicle Loan",
      desc: "Drive your dream car with simple documentation.",
    },
    {
      icon: FaBriefcase,
      title: "Business Loan",
      desc: "Finance and grow your business easily.",
    },
    {
      icon: FaBook,
      title: "Education Loan",
      desc: "Low-interest loans for higher studies.",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        Loan Categories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, index) => (
          <LoanCard
            key={index}
            icon={cat.icon}
            title={cat.title}
            description={cat.desc}
          />
        ))}
      </div>
    </div>
  );
};

export default LoanCategoryGrid;
