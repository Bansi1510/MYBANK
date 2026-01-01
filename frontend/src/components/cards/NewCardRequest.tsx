import React from "react";
import { Link } from "react-router-dom";

const NewCardRequest: React.FC = () => {
  return (
    <div className="border rounded-lg bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-1">
        Request New Card
      </h3>

      <p className="text-xs text-gray-500 mb-4">
        Apply for a new debit card or request a replacement.
      </p>

      <Link
        to="/cards/new-request"
        className="inline-block text-xs font-medium px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition"
      >
        Request Card
      </Link>
    </div>
  );
};

export default NewCardRequest;
