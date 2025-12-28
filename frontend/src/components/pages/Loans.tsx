import React from "react";
import Navbar from "../shared/Navbar";
import LoanHeader from "../Loans/LoanHeader";
import LoanCategoryGrid from "../Loans/LoanCategoryGrid";
import LoanHelp from "../Loans/LoanHelp";
import UserLoans from "../Loans/UserLoans";

const Loans: React.FC = () => {
  return (
    <>
      <Navbar />

      <div className="w-full mt-18 min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <LoanHeader />
          <LoanCategoryGrid />
          <UserLoans />
          <LoanHelp />

        </div>
      </div>
    </>
  );
};

export default Loans;
