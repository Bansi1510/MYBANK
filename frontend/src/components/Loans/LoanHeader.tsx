import React from "react";

const LoanHeader: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h1 className="text-3xl font-bold text-gray-800">Loans</h1>
      <p className="text-gray-500 mt-1">
        Explore different loan options available for your needs.
      </p>
    </div>
  );
};

export default LoanHeader;
