import React from "react";
import { FaUniversity, FaCheckCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

interface Props {
  account: {
    id: number;
    account_number: string;
    account_type: string;
    status: string;
    name: string;
    email: string;
    mobile_number: string;
    address: string;
    balance: string;
    created_at: string;
  };
}

const AccountCard: React.FC<Props> = ({ account }) => {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-4">
        <FaUniversity size={26} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
      </div>

      <div className="space-y-2 text-gray-700">
        <p><strong>Account Number:</strong> {account.account_number}</p>
        <p><strong>Type:</strong> {account.account_type.toUpperCase()}</p>

        <p className="flex items-center gap-2">
          <strong>Status:</strong> {account.status}
          <FaCheckCircle size={16} className="text-green-600" />
        </p>

        <p><strong>Name:</strong> {account.name}</p>
        <p className="flex items-center gap-2">
          <FaEnvelope size={14} /> {account.email}
        </p>
        <p className="flex items-center gap-2">
          <FaPhone size={14} /> {account.mobile_number}
        </p>
        <p className="flex items-center gap-2">
          <FaMapMarkerAlt size={14} /> {account.address}
        </p>

        <p><strong>Balance:</strong> ₹ {account.balance}</p>
        <p><strong>Created At:</strong> {new Date(account.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default AccountCard;