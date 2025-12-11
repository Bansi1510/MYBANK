// NewBankAccountRequest.tsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { newAccountReqAPI, type formDataInterFace } from "../../services/staff.api";
import type { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

const NewBankAccountRequest: React.FC = () => {
  const createdBy = useSelector((state: RootState) => state.auth.userData?.id);
  const navigate = useNavigate();
  const [form, setForm] = useState<formDataInterFace>({
    name: "",
    email: "",
    mobile_number: "",
    address: "",
    aadhar_number: "",
    requested_account_type: "",
    pan_number: "",
    initial_deposit: "",
    kyc_document_type: "",
    kyc_document_url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "mobile_number" || name === "aadhar_number") {
      const numericValue = value.replace(/\D/g, "");
      setForm({ ...form, [name]: numericValue === "" ? "" : Number(numericValue) });
    } else if (name === "initial_deposit") {
      const numericValue = value.replace(/\D/g, "");
      setForm({ ...form, initial_deposit: numericValue === "" ? "" : Number(numericValue) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...form,
      created_by: createdBy,
    };

    console.log("Request submitted:", submissionData);
    const res = await newAccountReqAPI(submissionData);

    if (res) {
      alert("Bank account request sent successfully!");
      navigate(-1);
    } else {
      alert("Bank account request error ");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Open New Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number *</label>
            <input
              type="text"
              name="mobile_number"
              value={form.mobile_number}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address *</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              placeholder="Enter your address"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhaar Number *</label>
            <input
              type="text"
              name="aadhar_number"
              value={form.aadhar_number}
              onChange={handleChange}
              placeholder="Enter 12-digit Aadhaar number"
              maxLength={12}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number *</label>
            <input
              type="text"
              name="pan_number"
              value={form.pan_number}
              onChange={handleChange}
              placeholder="Enter PAN number"
              maxLength={10}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              required
            />
          </div>

          {/* Initial Deposit */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Deposit *</label>
            <input
              type="text"
              name="initial_deposit"
              value={form.initial_deposit}
              onChange={handleChange}
              placeholder="Enter initial deposit amount"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          {/* KYC Document Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">KYC Document Type *</label>
            <select
              name="kyc_document_type"
              value={form.kyc_document_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            >
              <option value="">Select Document Type</option>
              <option value="aadhar">Aadhaar</option>
              <option value="pan">PAN</option>

            </select>
          </div>

          {/* KYC Document URL */}
          {/* <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">KYC Document URL *</label>
            <input
              type="text"
              name="kyc_document_url"
              value={form.kyc_document_url}
              onChange={handleChange}
              placeholder="Enter KYC document URL"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"

            />
          </div> */}

          {/* Account Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Account Type *</label>
            <select
              name="requested_account_type"
              value={form.requested_account_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            >
              <option value="">Select Account Type</option>
              <option value="savings">Savings Account</option>
              <option value="current">Current Account</option>
              <option value="salary">Salary Account</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewBankAccountRequest;
