import React, { useState } from "react";

const LoanPaymentForm: React.FC = () => {
  const [policyNumber, setPolicyNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="w-[420px] border rounded p-5">
        <h2 className="text-base font-semibold mb-4">
          Loan EMI Payment
        </h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">
            Loan Policy Number
          </label>
          <input
            type="text"
            value={policyNumber}
            onChange={(e) => setPolicyNumber(e.target.value)}
            className="w-full border px-3 py-2 text-base"
            placeholder="Policy number"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm mb-1">
            Amount
          </label>
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
          disabled={!policyNumber || !amount}
          className="w-full border py-2 text-base disabled:opacity-50"
          onClick={handleSubmit}
        >
          Pay EMI
        </button>

      </form>
    </div>
  );
};

export default LoanPaymentForm;
