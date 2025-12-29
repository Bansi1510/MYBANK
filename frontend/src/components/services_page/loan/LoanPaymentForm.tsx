import React, { useState } from "react";
import { loanEMIpaymentAPI } from "../../services/loan.service";

const LoanPaymentForm: React.FC = () => {
  const [policyNumber, setPolicyNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only whole numbers
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async () => {
    if (!policyNumber || !amount) {
      alert("Both fields are necessary");
      return;
    }

    setLoading(true);
    setMessage(null);
    const res = await loanEMIpaymentAPI(policyNumber, Number(amount));
    if (!res) {
      setPolicyNumber("");
      setAmount("");
      return;
    }
    setMessage(
      `Payment Successful! Paid ₹${res.paid_amount}. Remaining Balance ₹${res.remaining_balance}. Payment Method: ${res.payment_method}`
    );

    // Clear form
    setPolicyNumber("");
    setAmount("");

  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="w-[420px] border rounded p-5">
        <h2 className="text-base font-semibold mb-4">Loan EMI Payment</h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Loan Policy Number</label>
          <input
            type="text"
            value={policyNumber}
            onChange={(e) => setPolicyNumber(e.target.value)}
            className="w-full border px-3 py-2 text-base"
            placeholder="Policy number"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm mb-1">Amount</label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="w-full border px-3 py-2 text-base"
            placeholder="Amount"
          />
        </div>

        <button
          type="button"
          disabled={!policyNumber || !amount || loading}
          onClick={handleSubmit}
          className="w-full border py-2 text-base disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay EMI"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
};

export default LoanPaymentForm;
