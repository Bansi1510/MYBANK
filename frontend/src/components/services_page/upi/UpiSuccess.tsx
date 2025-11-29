import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const UpiSuccess: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h2>No Transaction Data Found</h2>;
  }

  const txn = state;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#f4f7fb]">

      <FaCheckCircle size={80} color="#22c55e" />

      <h1 className="text-2xl font-bold mt-4 text-gray-800">
        Payment Successful
      </h1>

      <p className="text-gray-600 mt-1">{txn.timestamp}</p>

      <div className="w-full max-w-md mt-6 bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between py-2">
          <span className="font-semibold">Transaction ID:</span>
          <span>{txn.transaction_id}</span>
        </div>

        <div className="flex justify-between py-2">
          <span className="font-semibold">Amount:</span>
          <span>₹ {txn.amount}</span>
        </div>

        <div className="flex justify-between py-2">
          <span className="font-semibold">From:</span>
          <span>{txn.sender.name}</span>
        </div>

        <div className="flex justify-between py-2">
          <span className="font-semibold">To:</span>
          <span>{txn.receiver.name}</span>
        </div>

        <div className="flex justify-between py-2">
          <span className="font-semibold">Mobile:</span>
          <span>{txn.receiver.mobile}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md"
      >
        Back to Home
      </button>
    </div>
  );
};

export default UpiSuccess;
