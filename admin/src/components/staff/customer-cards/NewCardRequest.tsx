import React, { useState } from "react";
import { applyNewCardReq, type formData } from "../../services/card.api";
import { useNavigate } from "react-router-dom";

const NewCardRequest: React.FC = () => {
  const [form, setForm] = useState<formData>({
    account_number: "",
    card_type: "debit",
    card_brand: "visa",
    card_variant: "classic",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "account_number") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 15) return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await applyNewCardReq(form);
    if (res) navigate(-1);

    setLoading(false);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow p-10">
      <h2 className="text-2xl font-semibold mb-1">
        New Card Request
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Staff initiated card request using customer account number
      </p>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Account Number */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">
            Account Number
          </label>
          <input
            type="text"
            name="account_number"
            value={form.account_number}
            onChange={handleChange}
            required
            maxLength={15}
            placeholder="Enter account number"
            className="w-full border rounded-md p-3 mt-1 focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Numbers only (max 15 digits)
          </p>
        </div>

        {/* Card Type */}
        <div>
          <label className="text-sm text-gray-600">Card Type</label>
          <select
            name="card_type"
            value={form.card_type}
            onChange={handleChange}
            className="w-full border rounded-md p-3 mt-1"
          >
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
        </div>

        {/* Card Brand */}
        <div>
          <label className="text-sm text-gray-600">Card Brand</label>
          <select
            name="card_brand"
            value={form.card_brand}
            onChange={handleChange}
            className="w-full border rounded-md p-3 mt-1"
          >
            <option value="visa">Visa</option>
            <option value="mastercard">MasterCard</option>
            <option value="rupay">RuPay</option>
          </select>
        </div>

        {/* Card Variant */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Card Variant</label>
          <select
            name="card_variant"
            value={form.card_variant}
            onChange={handleChange}
            className="w-full border rounded-md p-3 mt-1"
          >
            <option value="classic">Classic</option>
            <option value="platinum">Platinum</option>
            <option value="signature">Signature</option>
          </select>
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition"
          >
            {loading ? "Submitting..." : "Submit Card Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCardRequest;
