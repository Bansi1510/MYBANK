import React from "react";
import { COMMON_DOCUMENTS, LOAN_SPECIFIC_DOCUMENTS } from "../config/loanDocuments.config";

interface Props {
  loanType: string;
  onChange: (files: Record<string, File[]>) => void;
}

const LoanDocumentsSection: React.FC<Props> = ({ loanType, onChange }) => {
  const documents = [
    ...COMMON_DOCUMENTS,
    ...(LOAN_SPECIFIC_DOCUMENTS[loanType] || []),
  ];

  const handleFileChange = (docKey: string, fileList: FileList | null) => {
    if (!fileList) return;
    onChange({
      [docKey]: Array.from(fileList),
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-gray-800 mb-3">
        Upload Required Documents
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Upload clear scanned copies. Multiple files allowed.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.key}
            className="border rounded-lg p-4 bg-white hover:shadow-sm transition"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {doc.label}
            </label>

            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(doc.key, e.target.files)}
              className="w-full text-sm file:mr-3 file:py-1.5 file:px-3
                file:rounded file:border-0
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                border rounded-md px-3 py-2"
            />

            <p className="text-xs text-gray-500 mt-2">
              Accepted formats: PDF, JPG, PNG
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanDocumentsSection;
