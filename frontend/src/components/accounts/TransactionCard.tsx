import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyCheckAlt,
  FaArrowUp,
  FaPiggyBank,
  FaShieldAlt,
  FaEye,
  FaQrcode,
} from "react-icons/fa";

const TransactionCard: React.FC = () => {
  const navigate = useNavigate();

  const transactionList = [
    { label: "transfer", title: "Debit / Transfer Money", icon: <FaArrowUp size={16} className="text-red-500" /> },
    { label: "upi", title: "UPI / QR Payments", icon: <FaQrcode size={16} className="text-indigo-600" /> },
    { label: "loan", title: "Pay Loan EMI", icon: <FaPiggyBank size={16} className="text-blue-600" /> },
    { label: "insurance", title: "Pay Insurance Premium", icon: <FaShieldAlt size={16} className="text-purple-600" /> },
    { label: "balance", title: "View Account Balance", icon: <FaEye size={16} className="text-gray-700" /> },
  ];

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-4">
        <FaMoneyCheckAlt size={26} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Transaction Services</h3>
      </div>

      <div className="space-y-3">
        {transactionList.map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(`/transaction/${item.label}`)}
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:text-blue-700"
          >
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionCard;
