import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMoneyBillWave,
  FaMobileAlt,
  FaLandmark,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";

type TransactionType =
  | "transfer"
  | "upi"
  | "loan"
  | "insurance"
  | "balance";

interface TransactionConfig {
  title: string;
  description: string;
  fields: string[];
  icon: React.ReactNode;
  button: string;
  accent: string;
}

const TRANSACTION_CONFIG: Record<TransactionType, TransactionConfig> = {
  transfer: {
    title: "Money Transfer",
    description: "Send money securely to any bank account using NEFT, RTGS, or IMPS.",
    icon: <FaMoneyBillWave size={28} className="text-blue-700" />,
    fields: ["Recipient Account Number", "IFSC Code", "Amount"],
    button: "Transfer Now",
    accent: "blue",
  },

  upi: {
    title: "UPI / QR Payment",
    description: "Instant payment via UPI ID or scanning a QR code.",
    icon: <FaMobileAlt size={28} className="text-indigo-700" />,
    fields: ["UPI ID (example@upi)", "Amount"],
    button: "Pay via UPI",
    accent: "indigo",
  },

  loan: {
    title: "Loan EMI Payment",
    description: "Pay your monthly EMI securely and keep your loan active.",
    icon: <FaLandmark size={28} className="text-green-700" />,
    fields: ["Loan Account Number", "EMI Amount"],
    button: "Pay EMI",
    accent: "green",
  },

  insurance: {
    title: "Insurance Premium",
    description: "Pay your policy premium to avoid lapses and continue benefits.",
    icon: <FaShieldAlt size={28} className="text-purple-700" />,
    fields: ["Policy Number", "Premium Amount"],
    button: "Pay Premium",
    accent: "purple",
  },

  balance: {
    title: "Account Balance",
    description: "Check your real-time available balance.",
    icon: <FaInfoCircle size={28} className="text-emerald-700" />,
    fields: [],
    button: "",
    accent: "emerald",
  },
};

const TransactionScreen: React.FC = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const pageType = (type as TransactionType) || "transfer";
  const data = TRANSACTION_CONFIG[pageType];

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6 flex flex-col">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <FaArrowLeft
          size={22}
          onClick={() => navigate(-1)}
          className="cursor-pointer text-gray-700 hover:text-black"
        />
        <h1 className="text-3xl font-semibold text-gray-800">{data.title}</h1>
      </div>

      {/* FULL WIDTH INFORMATION CARD */}
      <div className="bg-white p-6 rounded-xl shadow-md border max-w-3xl w-full mx-auto mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-4 rounded-full">{data.icon}</div>
          <p className="text-gray-700 text-lg">{data.description}</p>
        </div>
      </div>

      {/* BALANCE PAGE */}
      {pageType === "balance" ? (
        <div className="bg-emerald-50 border p-10 rounded-xl shadow-sm max-w-3xl mx-auto text-center">
          <p className="text-5xl font-bold text-emerald-700">₹ 70,000.00</p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl border shadow-md max-w-3xl w-full mx-auto space-y-5">

          {/* FORM FIELDS */}
          {data.fields.map((field) => (
            <input
              key={field}
              placeholder={field}
              className="w-full p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}

          {/* ACTION BUTTON */}
          <button
            className={`w-full py-3 text-white text-lg font-semibold rounded-lg bg-${data.accent}-600 hover:bg-${data.accent}-700 transition`}
          >
            {data.button}
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionScreen;
