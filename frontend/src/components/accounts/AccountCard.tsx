import React from "react";
import { FiCreditCard } from "react-icons/fi";

interface Account {
  account_number: string;
  account_type: string;
  balance: number;
  status: string;
  created_at: string;
}

interface Props {
  account: Account;
}

const AccountCard: React.FC<Props> = ({ account }) => {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-xl">
          <FiCreditCard className="text-blue-700" size={26} />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {account.account_type} Account
          </h3>
          <p className="text-gray-500 text-sm">
            {account.account_number}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-gray-500 text-sm">Available Balance</p>
        <h2 className="text-3xl font-bold text-green-600">
          ₹ {account.balance.toLocaleString()}
        </h2>
      </div>

      <p className="mt-4 text-gray-400 text-sm">
        Opened on {new Date(account.created_at).toDateString()}
      </p>
    </div>
  );
};

export default AccountCard;
