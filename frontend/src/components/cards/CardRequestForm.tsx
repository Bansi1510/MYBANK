import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { applycardReq } from "../services/card.service";
import { useNavigate } from "react-router-dom";

const CardRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const accountNumber = useSelector(
    (state: RootState) =>
      state.auth.profile?.accounts?.[0]?.account_number ?? ""
  );

  const [formData, setFormData] = useState({
    request_type: "new",
    card_type: "debit",
    card_brand: "visa",
    card_variant: "classic",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRequestTypeChange = (value: "new" | "renew") => {
    setFormData({ ...formData, request_type: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) return;

    const payload = {
      account_number: accountNumber,
      ...formData,
    };

    console.log("Card Request Payload:", payload);
    const res = await applycardReq(payload);
    if (res) {
      navigate("/");
    }
    // Here you can call your API
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white border rounded-lg p-8 shadow-sm">

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Card Request
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Apply for a new card or renew your existing card
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">

          {/* Account Number */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium text-base">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              disabled
              className="w-full rounded border px-4 py-3 bg-gray-50 text-gray-800 text-base"
            />
          </div>

          {/* Request Type (Radio Buttons) */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium text-base">
              Request Type
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.request_type === "new"}
                  onChange={() => handleRequestTypeChange("new")}
                  className="w-4 h-4"
                />
                New Card
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.request_type === "renew"}
                  onChange={() => handleRequestTypeChange("renew")}
                  className="w-4 h-4"
                />
                Renew Card
              </label>
            </div>
          </div>

          {/* Card Type */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium text-base">
              Card Type
            </label>
            <select
              name="card_type"
              value={formData.card_type}
              onChange={handleChange}
              className="w-full rounded border px-4 py-3 text-base"
            >
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>

          {/* Card Brand */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium text-base">
              Card Brand
            </label>
            <select
              name="card_brand"
              value={formData.card_brand}
              onChange={handleChange}
              className="w-full rounded border px-4 py-3 text-base"
            >
              <option value="visa">Visa</option>
              <option value="mastercard">MasterCard</option>
              <option value="rupay">RuPay</option>
            </select>
          </div>

          {/* Card Variant */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium text-base">
              Card Variant
            </label>
            <select
              name="card_variant"
              value={formData.card_variant}
              onChange={handleChange}
              className="w-full rounded border px-4 py-3 text-base"
            >
              <option value="classic">Classic</option>
              <option value="platinum">Platinum</option>
              <option value="signature">Signature</option>
            </select>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4"
              id="terms"
            />
            <label htmlFor="terms" className="text-gray-600 text-sm">
              I agree to the <span className="font-medium">Terms and Conditions</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!acceptedTerms}
            className={`w-full rounded border py-3 text-base font-medium transition
              ${acceptedTerms ? "hover:bg-gray-50" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            Submit Request
          </button>

        </form>
      </div>
    </div>
  );
};

export default CardRequestForm;
