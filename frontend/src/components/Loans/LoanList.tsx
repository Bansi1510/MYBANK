import React from "react";
import LoanCard from "./LoanCard";
import { FaHome, FaCar, FaBusinessTime, FaBook } from "react-icons/fa";

const LoanList: React.FC = () => {
  const loans = [
    {
      icon: FaHome,
      title: "Home Loan",
      description: "Affordable home loans with flexible EMIs.",
    },
    {
      icon: FaCar,
      title: "Car Loan",
      description: "Fast approval to help you buy your dream car.",
    },
    {
      icon: FaBusinessTime,
      title: "Business Loan",
      description: "Grow your business with our trusted funding.",
    },
    {
      icon: FaBook,
      title: "Education Loan",
      description: "Support your higher studies with easy loans.",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {loans.map((loan, index) => (
        <LoanCard
          key={index}
          icon={loan.icon}
          title={loan.title}
          description={loan.description}
        />
      ))}
    </div>
  );
};

export default LoanList;
