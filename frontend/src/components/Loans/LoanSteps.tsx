import React from "react";

const LoanSteps: React.FC = () => {
  const steps = [
    "Choose the loan type",
    "Fill in your application",
    "Upload required documents",
    "Verification & approval",
    "Funds credited to account",
  ];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works?</h2>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
              {index + 1}
            </div>
            <p className="text-gray-700 font-medium">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanSteps;
