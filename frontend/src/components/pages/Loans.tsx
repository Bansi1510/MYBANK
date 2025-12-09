import React from "react";
import LoanHeader from "../Loans/LoanHeader";
import LoanFeatures from "../Loans/LoanFeatures";
import LoanCategoryGrid from "../Loans/LoanCategoryGrid";
import LoanSteps from "../Loans/LoanSteps";
import LoanHelp from "../Loans/LoanHelp";
import Navbar from "../shared/Navbar";

const Loans: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="w-full mt-18 min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <LoanHeader />
          <LoanFeatures />
          <LoanCategoryGrid />
          <LoanSteps />
          <LoanHelp />
        </div>
      </div>
    </>
  );
};

export default Loans;
