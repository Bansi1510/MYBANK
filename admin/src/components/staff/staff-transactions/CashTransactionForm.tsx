import React, { useState } from "react";
import { cashTransactionByStaff } from "../../services/transaction.api";
import { useNavigate } from "react-router-dom";

const CashTransactionForm: React.FC = () => {
  const naviagte = useNavigate();
  const [form, setForm] = useState({
    account_number: "",
    amount: "",
    transaction_type: "deposit",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      account_number: form.account_number,
      amount: Number(form.amount),
      transaction_type: form.transaction_type,
      description: form.description,
    };

    // ✅ Log only
    console.log("Cash Transaction Payload:", payload);
    const res = await cashTransactionByStaff(payload);

    if (res) {
      naviagte(-1);
    }

  };

  return (
    <div className="p-6 max-w-6xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Cash Transaction
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="account_number"
              value={form.account_number}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              name="transaction_type"
              value={form.transaction_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional description"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-base min-h-[90px] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 transition"
          >
            Submit Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default CashTransactionForm;
