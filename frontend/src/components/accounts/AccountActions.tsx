import React from "react";
import { FiSend, FiPlusCircle } from "react-icons/fi";

const AccountActions: React.FC = () => {
  return (
    <div className="bg-white border shadow-sm rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>

      <div className="flex gap-4">
        <button className="px-5 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2 shadow">
          <FiSend /> Transfer
        </button>

        <button className="px-5 py-2 rounded-xl bg-green-600 text-white flex items-center gap-2 shadow">
          <FiPlusCircle /> Deposit
        </button>
      </div>
    </div>
  );
};

export default AccountActions;
