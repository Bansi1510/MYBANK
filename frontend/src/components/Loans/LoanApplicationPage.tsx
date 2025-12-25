import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  COMMON_DOCUMENTS,
  LOAN_SPECIFIC_DOCUMENTS,
} from "../config/loanDocuments.config";
import Navbar from "../shared/Navbar";

const LoanApplicationPage: React.FC = () => {
  const { loanType } = useParams<{ loanType: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    amount: "",
    tenure: "",
    purpose: "",
  });

  const [documents, setDocuments] = useState<Record<string, File[]>>({});

  if (!loanType) return null;

  // only numbers
  const handleNumberOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setForm(prev => ({ ...prev, [name]: value }));
    }
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

  const allDocuments = [
    ...COMMON_DOCUMENTS,
    ...(LOAN_SPECIFIC_DOCUMENTS[loanType] || []),
  ];

  return (
    <>    <Navbar />
      <div className="min-h-screen mt-15 bg-gray-100">
        {/* ===== TOP BAR ===== */}
        <div className="bg-blue-900 text-white">
          <div className="px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-sm underline"
            >
              Back
            </button>
            <h1 className="text-lg font-semibold uppercase">
              {loanType.replace("-", " ")} Application
            </h1>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="px-6 py-8">
          {/* Loan Info */}
          <div className="bg-white border mb-8">
            <div className="border-b px-4 py-3 font-semibold text-sm">
              Loan Details
            </div>

            <div className="px-4 py-6 space-y-5">
              <div>
                <label className="block text-sm mb-1">
                  Loan Amount
                </label>
                <input
                  type="text"
                  name="amount"
                  value={form.amount}
                  onChange={handleNumberOnly}
                  className="w-full border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Tenure (Months)
                </label>
                <input
                  type="text"
                  name="tenure"
                  value={form.tenure}
                  onChange={handleNumberOnly}
                  className="w-full border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Purpose of Loan
                </label>
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
          <div className="bg-white border">
            <div className="border-b px-4 py-3 font-semibold text-sm">
              Document Upload
            </div>

            <div className="px-4 py-6 space-y-4">
              {allDocuments.map(doc => {
                const selectedFiles = documents[doc.key] || [];

                return (
                  <div
                    key={doc.key}
                    className="border px-4 py-3"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                      <div className="text-sm font-medium">
                        {doc.label}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="inline-block w-fit">
                          <input
                            type="file"
                            multiple
                            onChange={(e) =>
                              handleFileChange(doc.key, e.target.files)
                            }
                            className="hidden"
                          />
                          <span className="border px-4 py-1.5 text-sm bg-gray-50 cursor-pointer hover:bg-gray-100">
                            Select Files
                          </span>
                        </label>

                        {/* Selected file names */}
                        {selectedFiles.length > 0 && (
                          <ul className="text-xs text-gray-600 list-disc pl-5">
                            {selectedFiles.map((file, idx) => (
                              <li key={idx}>{file.name}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => navigate("/")}
              className="border px-6 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                console.log({ loanType, form, documents })
              }
              className="bg-blue-900 text-white px-6 py-2 text-sm"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanApplicationPage;
