import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { COMMON_DOCUMENTS, LOAN_SPECIFIC_DOCUMENTS } from "../config/loanDocuments.config";

const LoanApplicationPage: React.FC = () => {
  const { loanType } = useParams<{ loanType: string }>();
  const navigate = useNavigate();

  // hooks must be at top level
  const [form, setForm] = useState({
    amount: "",
    tenure: "",
    purpose: "",
  });

  const [documents, setDocuments] = useState<Record<string, File[]>>({});

  // Early return if no loanType
  if (!loanType) {
    return <div className="p-6 text-center text-red-500">Loan type not found!</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (key: string, files: FileList | null) => {
    if (!files) return;
    setDocuments(prev => ({ ...prev, [key]: Array.from(files) }));
  };

  const handleSubmit = () => {
    console.log({ loanType, ...form, documents });
    alert("Form submitted! Check console for details.");
  };

  const allDocuments = [...COMMON_DOCUMENTS, ...(LOAN_SPECIFIC_DOCUMENTS[loanType] || [])];


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-10">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate("/")} className="text-blue-600 mr-4">&larr; Back</button>
        <h1 className="text-3xl font-bold text-gray-800">{loanType} Application</h1>
      </div>

      {/* Loan Details */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Loan Amount"
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="tenure"
            value={form.tenure}
            onChange={handleChange}
            placeholder="Tenure (Months)"
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <textarea
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          placeholder="Purpose of Loan"
          rows={3}
          className="border rounded-md px-3 py-2 w-full mt-4 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Documents */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
        <p className="text-sm text-gray-500 mb-4">Upload required documents. Multiple files allowed.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allDocuments.map(doc => (
            <div key={doc.key} className="border rounded-md p-4 bg-gray-50">
              <label className="block text-sm font-medium mb-2">{doc.label}</label>
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(doc.key, e.target.files)}
                className="w-full text-sm file:mr-3 file:py-1.5 file:px-3
                  file:rounded file:border-0
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                  border rounded-md px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Accepted: PDF, JPG, PNG</p>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4 mb-10">
        <button onClick={() => navigate("/")} className="px-5 py-2 border rounded-md hover:bg-gray-100">Cancel</button>
        <button onClick={handleSubmit} className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Submit Application</button>
      </div>
    </div>
  );
};

export default LoanApplicationPage;
