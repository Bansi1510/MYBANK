import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  COMMON_DOCUMENTS,
  LOAN_SPECIFIC_DOCUMENTS,
} from "../../config/loanDocuments.config";
import { applyLoanByStaffAPI } from "../../services/loan.api";

const LOAN_TYPES = [
  "home-loan",
  "education-loan",
  "personal-loan",
  "vehicle-loan",
  "gold-loan",
  "property-loan",
  "agriculture-loan",
  "business-loan",
];

const StaffApplyLoan: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    account_number: "",
    loan_type: "",
    amount: "",
    tenure: "",
    purpose: "",
  });

  const [documents, setDocuments] = useState<Record<string, File[]>>({});

  /* ================= HANDLERS ================= */

  const handleNumberOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePurpose = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, purpose: e.target.value }));
  };

  const handleFileChange = (key: string, files: FileList | null) => {
    if (!files) return;
    setDocuments(prev => ({
      ...prev,
      [key]: Array.from(files),
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!form.loan_type || !form.account_number) {
      alert("Account number and loan type required");
      return;
    }

    const formData = new FormData();
    const cleanLoanType = form.loan_type.replace("-loan", "");
    formData.append("account_number", form.account_number);
    formData.append("loan_type", cleanLoanType);
    formData.append("loan_amount", form.amount);
    formData.append("tenure", form.tenure);
    formData.append("purpose", form.purpose);

    Object.entries(documents).forEach(([key, files]) => {
      files.forEach(file => {
        formData.append(key, file);
      });
    });

    const res = await applyLoanByStaffAPI(formData);
    if (res) navigate(-1);
  };

  const allDocuments = [
    ...COMMON_DOCUMENTS,
    ...(LOAN_SPECIFIC_DOCUMENTS[form.loan_type] ?? []),
  ];

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-900 text-white px-10 py-4 flex justify-between">
        <div>
          <h1 className="text-xl font-semibold">Staff Loan Application</h1>
          <p className="text-xs text-blue-200 mt-1">
            Apply loan on behalf of customer
          </p>
        </div>
        <button onClick={() => navigate(-1)} className="underline text-sm">
          Back
        </button>
      </div>

      <div className="px-10 py-8 space-y-8">

        {/* Loan Details */}
        <div className="bg-white border rounded-md">
          <div className="border-b px-6 py-3 font-semibold text-sm">
            Customer & Loan Details
          </div>

          <div className="px-6 py-6 grid grid-cols-12 gap-6">

            <div className="col-span-3">
              <label className="text-sm">Account Number</label>
              <input
                name="account_number"
                value={form.account_number}
                onChange={handleNumberOnly}
                className="w-full border px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-3">
              <label className="text-sm">Loan Type</label>
              <select
                name="loan_type"
                value={form.loan_type}
                onChange={handleChange}
                className="w-full border px-3 py-2 text-sm bg-white"
              >
                <option value="">Select Loan Type</option>
                {LOAN_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-3">
              <label className="text-sm">Loan Amount</label>
              <input
                name="amount"
                value={form.amount}
                onChange={handleNumberOnly}
                className="w-full border px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-3">
              <label className="text-sm">Tenure (Months)</label>
              <input
                name="tenure"
                value={form.tenure}
                onChange={handleNumberOnly}
                className="w-full border px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-12">
              <label className="text-sm">Purpose</label>
              <textarea
                rows={3}
                value={form.purpose}
                onChange={handlePurpose}
                className="w-full border px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        {form.loan_type && (
          <div className="bg-white border rounded-md">
            <div className="border-b px-6 py-3 font-semibold text-sm">
              Document Upload
            </div>

            <div className="px-6 py-6 space-y-4">
              {allDocuments.map(doc => (
                <div key={doc.key} className="border px-5 py-4 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{doc.label}</span>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={(e) =>
                          handleFileChange(doc.key, e.target.files)
                        }
                      />
                      <span className="border px-4 py-1.5 text-sm bg-gray-50">
                        Select Files
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button className="border px-8 py-2 text-sm" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button
            className="bg-blue-900 text-white px-8 py-2 text-sm"
            onClick={handleSubmit}
          >
            Submit Loan
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffApplyLoan;
