import React from "react";

const NewCardRequest: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Request New Card
      </h3>

      <p className="text-xs text-gray-500 mb-3">
        Apply for a new debit or replacement card.
      </p>

      <button className="px-4 py-1.5 text-xs rounded border border-gray-300 hover:bg-gray-50">
        New Card Request
      </button>
    </div>
  );
};

export default NewCardRequest;
