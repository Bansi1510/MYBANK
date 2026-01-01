import React from "react";

const MyCards: React.FC = () => {
  return (
    <div className="border rounded-lg bg-white p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800">
          My Cards
        </h3>
        <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-600">
          Active
        </span>
      </div>

      <div className="text-xs text-gray-600 space-y-1">
        <p className="font-medium text-gray-700">Debit Card</p>
        <p className="tracking-widest">**** 4821</p>
      </div>
    </div>
  );
};

export default MyCards;
