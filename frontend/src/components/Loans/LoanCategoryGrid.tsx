import React from "react";
import {
  FaHome,
  FaCar,
  FaBook,
  FaBriefcase,
  FaUser,
  FaCoins,
  FaWarehouse,
  FaTractor,
} from "react-icons/fa";

const LoanCategoryGrid: React.FC = () => {
  const categories = [
    {
      icon: FaHome,
      title: "Home Loan",
      desc: "Purchase or construct residential property.",
    },
    {
      icon: FaCar,
      title: "Vehicle Loan",
      desc: "Finance for car or two-wheeler purchase.",
    },
    {
      icon: FaUser,
      title: "Personal Loan",
      desc: "Unsecured loan for personal needs.",
    },
    {
      icon: FaBook,
      title: "Education Loan",
      desc: "Higher education financing in India or abroad.",
    },
    {
      icon: FaCoins,
      title: "Gold Loan",
      desc: "Loan against gold ornaments.",
    },
    {
      icon: FaBriefcase,
      title: "Business Loan",
      desc: "Funds to expand or manage business.",
    },
    {
      icon: FaWarehouse,
      title: "Loan Against Property",
      desc: "Mortgage loan against owned property.",
    },
    {
      icon: FaTractor,
      title: "Agriculture Loan",
      desc: "Financial support for farming activities.",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Available Loan Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) => {
          const Icon = cat.icon;

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6
                         hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-3">
                <Icon className="text-blue-600 text-3xl" />
                <h3 className="text-lg font-medium text-gray-800">
                  {cat.title}
                </h3>
              </div>

              <p className="text-gray-600 text-sm">
                {cat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoanCategoryGrid;
