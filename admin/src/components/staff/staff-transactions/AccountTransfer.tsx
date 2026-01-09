import React, { useState } from "react";

const AccountTransfer: React.FC = () => {
  const [form, setForm] = useState({
    from_account: "",
    to_account: "",
    amount: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { from_account, to_account, amount } = form;

    if (!from_account || !to_account || !amount) {
      console.error("Required fields missing");
      return;
    }

    if (from_account === to_account) {
      console.error("Sender and receiver cannot be same");
      return;
    }

    console.log("Transfer Data =>", {
      from_account,
      to_account,
      amount: Number(amount),
      description: form.description,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl">
        <h1 className="text-2xl font-semibold mb-6">
          Account to Account Transfer
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded p-6 space-y-6"
        >
          {/* Accounts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                From Account Number
              </label>
              <input
                type="text"
                name="from_account"
                value={form.from_account}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Sender account"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                To Account Number
              </label>
              <input
                type="text"
                name="to_account"
                value={form.to_account}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Receiver account"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                min="1"
                className="w-full border rounded px-3 py-2"
                placeholder="Amount"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Optional remarks"
            />
          </div>

          {/* Action */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Log Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountTransfer;
