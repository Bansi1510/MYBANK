import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const LOAN_CATEGORIES = [
    {
      icon: FaHome,
      title: "Home Loan",
      description: "Purchase or construct residential property.",
      link: "home-loan", // URL-friendly slug
    },
    {
      icon: FaCar,
      title: "Vehicle Loan",
      description: "Finance for car or two-wheeler purchase.",
      link: "vehicle-loan",
    },
    {
      icon: FaUser,
      title: "Personal Loan",
      description: "Unsecured loan for personal needs.",
      link: "personal-loan",
    },
    {
      icon: FaBook,
      title: "Education Loan",
      description: "Higher education financing in India or abroad.",
      link: "education-loan",
    },
    {
      icon: FaCoins,
      title: "Gold Loan",
      description: "Loan against gold ornaments.",
      link: "gold-loan",
    },
    {
      icon: FaBriefcase,
      title: "Business Loan",
      description: "Funds to expand or manage business.",
      link: "business-loan",
    },
    {
      icon: FaWarehouse,
      title: "Loan Against Property",
      description: "Mortgage loan against owned property.",
      link: "loan-against-property",
    },
    {
      icon: FaTractor,
      title: "Agriculture Loan",
      description: "Financial support for farming activities.",
      link: "agriculture-loan",
    },
  ];
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Loan Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {LOAN_CATEGORIES.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(`/loan/${encodeURIComponent(cat.link)}`)}
              className="border rounded-lg p-6 cursor-pointer hover:shadow-lg transition bg-white"
            >
              <div className="flex items-center mb-3">
                <Icon className="text-blue-600 text-3xl mr-3" />
                <h3 className="text-xl font-semibold">{cat.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{cat.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoanCategoryGrid;
