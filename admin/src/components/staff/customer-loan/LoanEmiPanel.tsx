import React, { useState } from "react";
import { getLoanPaymentDetailsAPI, type LoanEMIData } from "../../services/loan.api";

/* =======================
   INTERFACE
======================= */


/* =======================
   COMPONENT
======================= */
const LoanEmiPanel: React.FC = () => {
  const [policyNumber, setPolicyNumber] = useState("");
  const [loan, setLoan] = useState<LoanEMIData | null>(null);
  const [showPayForm, setShowPayForm] = useState(false);

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  /* =======================
     HANDLERS
  ======================= */

  // Allow only numeric (string, no decimal)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const getLoanDetails = async () => {

    const loanData = await getLoanPaymentDetailsAPI(policyNumber);
    console.log(loanData);
    if (!loanData) return;
    setLoan(loanData);
    setShowPayForm(false);
    setAmount("");
    setPaymentMethod("");
  };

  // 🔹 MOCK: Pay EMI (Replace with API later)
  const payEmi = () => {
    // 👉 API CALL WILL COME HERE
    // axios.post("/api/loan-payments/pay-emi", { policyNumber, amount, paymentMethod })

    console.log({
      policyNumber,
      amount,
      paymentMethod,
    });

    alert("EMI paid successfully (mock)");
  };

  /* =======================
     JSX
  ======================= */

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-md text-sm">

      {/* Header */}
      <h2 className="text-lg font-semibold mb-4">
        Loan EMI Payment
      </h2>

      {/* Policy Number Input */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Enter Policy Number"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={getLoanDetails}
        >
          Get Details
        </button>
      </div>

      {/* =======================
          LOAN DETAILS
      ======================= */}
      {loan && (
        <div className="border rounded p-4 space-y-4">

          {/* Top Info */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Policy Number</p>
              <p className="font-medium">{loan.policy_number}</p>
            </div>
            <span className="px-2 py-1 text-xs border rounded">
              {loan.status.toUpperCase()}
            </span>
          </div>

          {/* Loan Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-gray-500">Loan Type</p>
              <p className="font-medium capitalize">{loan.loan_type}</p>
            </div>
            <div>
              <p className="text-gray-500">Interest Rate</p>
              <p className="font-medium">{loan.interest_rate}%</p>
            </div>
            <div>
              <p className="text-gray-500">Loan Amount</p>
              <p className="font-medium">₹{loan.original_loan_amount}</p>
            </div>
            <div>
              <p className="text-gray-500">Tenure</p>
              <p className="font-medium">{loan.tenure} months</p>
            </div>
          </div>

          {/* EMI Info */}
          <div className="border-t pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-gray-500">Monthly EMI</p>
              <p className="font-semibold text-blue-600">
                ₹{loan.monthly_emi}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Remaining Amount</p>
              <p className="font-semibold">
                ₹{loan.remaining_amount}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Paid EMIs</p>
              <p className="font-medium">{loan.paid_emis}</p>
            </div>
            <div>
              <p className="text-gray-500">Remaining Tenure</p>
              <p className="font-medium">{loan.remaining_tenure} months</p>
            </div>
          </div>

          {/* Action */}
          <button
            className="w-full bg-green-600 text-white py-2 rounded"
            onClick={() => setShowPayForm(true)}
          >
            Pay EMI
          </button>
        </div>
      )}

      {/* =======================
          PAY EMI FORM
      ======================= */}
      {showPayForm && loan && (
        <div className="mt-4 border rounded p-4 space-y-3">
          <h3 className="font-semibold">Pay EMI</h3>

          <div>
            <p className="text-gray-500 mb-1">Policy Number</p>
            <input
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={loan.policy_number}
              disabled
            />
          </div>

          <div>
            <p className="text-gray-500 mb-1">Amount</p>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Enter EMI Amount"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>

          <div>
            <p className="text-gray-500 mb-1">Payment Method</p>
            <select
              className="w-full border rounded px-3 py-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment Method</option>
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="NET_BANKING">Net Banking</option>
            </select>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            onClick={payEmi}
          >
            Pay EMI
          </button>
        </div>
      )}

    </div>
  );
};

export default LoanEmiPanel;
