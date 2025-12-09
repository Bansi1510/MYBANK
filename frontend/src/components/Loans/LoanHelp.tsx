import React from "react";

const LoanHelp: React.FC = () => {
  return (
    <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-md text-center">
      <h2 className="text-2xl font-bold">Need Assistance?</h2>
      <p className="mt-1 text-sm text-blue-100">Our loan support team is available 24/7.</p>

      <div className="mt-4 space-y-1">
        <p className="text-lg font-semibold">📞 1800-123-456</p>
        <p className="text-sm">✉️ support@mybank.com</p>
      </div>
    </div>
  );
};

export default LoanHelp;
