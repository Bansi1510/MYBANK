import React from "react";

const MyCards: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        My Cards
      </h3>

      <div className="flex justify-between text-xs text-gray-600">
        <div>
          <p className="font-medium">Debit Card</p>
          <p>**** 4821</p>
        </div>
        <span className="text-green-600">Active</span>
      </div>
    </div>
  );
};

export default MyCards;
