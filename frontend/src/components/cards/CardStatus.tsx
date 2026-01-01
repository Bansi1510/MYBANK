import React from "react";

const CardStatus: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Card Request Status
      </h3>

      <div className="flex justify-between text-xs text-gray-600">
        <span>Debit Card</span>
        <span className="text-blue-600">Under Process</span>
      </div>
    </div>
  );
};

export default CardStatus;
