import React, { useState } from "react";
import {
  getLoanPaymentDetailsAPI,
  payLoanEmiAPI,
  type LoanEMIData,
  type loanPaymentResposnes,
} from "../../services/loan.api";


const LoanEmiPanel: React.FC = () => {
  const [policyNumber, setPolicyNumber] = useState("");
  const [loan, setLoan] = useState<LoanEMIData | null>(null);
  const [showPayForm, setShowPayForm] = useState(false);

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // 🔹 NEW: payment result
  const [paymentResult, setPaymentResult] = useState<loanPaymentResposnes | null>(
    null
  );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$/.test(e.target.value)) {
      setAmount(e.target.value);
    }
  };

  const getLoanDetails = async () => {
    const loanData = await getLoanPaymentDetailsAPI(policyNumber);
    if (!loanData) return;

    setLoan(loanData);
    setShowPayForm(false);
    setPaymentResult(null);
    setAmount("");
    setPaymentMethod("");
  };

  const payEmi = async () => {
    const res = await payLoanEmiAPI(
      Number(amount),
      paymentMethod,
      policyNumber
    );

    if (!res) return;

    // 🔹 SAVE PAYMENT RESULT
    setPaymentResult({
      paid_amount: res.paid_amount,
      remaining_balance: res.remaining_balance,
      payment_method: res.payment_method,
    });


  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 border rounded text-sm">
      <h2 className="font-semibold mb-3">Loan EMI Payment</h2>

      {/* Policy input */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-2 py-1"
          placeholder="Policy Number"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
        />
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={getLoanDetails}
        >
          Get
        </button>
      </div>

      {/* Loan details */}
      {loan && (
        <div className="border rounded p-3 space-y-3">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Policy</p>
              <p>{loan.policy_number}</p>
            </div>
            <span className="text-xs border px-2 rounded">
              {loan.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Info label="Loan Type" value={loan.loan_type} />
            <Info label="Interest" value={`${loan.interest_rate}%`} />
            <Info label="Loan Amount" value={`₹${loan.original_loan_amount}`} />
            <Info label="Tenure" value={`${loan.tenure} months`} />
            <Info
              label="Monthly EMI"
              value={`₹${loan.monthly_emi}`}
              highlight
            />
            <Info
              label="Remaining"
              value={`₹${loan.remaining_amount}`}
            />
          </div>

          <button
            className="w-full bg-green-600 text-white py-1 rounded"
            onClick={() => setShowPayForm(true)}
          >
            Pay EMI
          </button>
        </div>
      )}

      {/* Pay form */}
      {showPayForm && loan && (
        <div className="mt-3 border rounded p-3 space-y-2">
          <input
            className="w-full border px-2 py-1 bg-gray-100"
            value={loan.policy_number}
            disabled
          />

          <input
            className="w-full border px-2 py-1"
            placeholder="EMI Amount"
            value={amount}
            onChange={handleAmountChange}
          />

          <select
            className="w-full border px-2 py-1"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Payment Method</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="account_debit">Account Debit</option>
          </select>

          <button
            className="w-full bg-blue-600 text-white py-1 rounded"
            onClick={payEmi}
          >
            Confirm Payment
          </button>
        </div>
      )}

      {/* ✅ PAYMENT SUCCESS SUMMARY */}
      {paymentResult && (
        <div className="mt-4 border rounded p-3 bg-green-50">
          <p className="font-semibold text-green-700 mb-2">
            Payment Successful
          </p>

          <div className="space-y-1">
            <Summary label="Paid Amount" value={`₹${paymentResult.paid_amount}`} />
            <Summary
              label="Remaining Balance"
              value={`₹${paymentResult.remaining_balance}`}
            />
            <Summary
              label="Payment Method"
              value={paymentResult.payment_method.toUpperCase()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* 🔹 Small reusable helpers (clean & lightweight) */

const Info = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className={highlight ? "font-semibold text-blue-600" : ""}>{value}</p>
  </div>
);

const Summary = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default LoanEmiPanel;
