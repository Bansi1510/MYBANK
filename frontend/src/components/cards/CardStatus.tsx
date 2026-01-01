import React from "react";

const CardStatus: React.FC = () => {
  return (
    <div className="border rounded-lg bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Card Request Status
      </h3>

      <div className="flex justify-between items-center text-xs text-gray-600">
        <div>
          <p className="font-medium text-gray-700">Debit Card</p>
          <p className="text-gray-500">New Card Request</p>
        </div>

        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600">
          Under Process
        </span>
      </div>
    </div>
  );
};

export default CardStatus;
