// loanDocuments.config.ts
export const COMMON_DOCUMENTS = [
  { key: "aadhaar", label: "Aadhaar Card" },
  { key: "pan", label: "PAN Card" },
  { key: "address_proof", label: "Address Proof" },
  { key: "photo", label: "Photograph" },
];

export const LOAN_SPECIFIC_DOCUMENTS: Record<string, { key: string; label: string }[]> = {
  "Home Loan": [
    { key: "property_papers", label: "Property Documents" },
    { key: "sale_agreement", label: "Sale Agreement" },
  ],
  "Personal Loan": [
    { key: "salary_slips", label: "Last 3 Months Salary Slips" },
    { key: "bank_statement", label: "Bank Statement (6 Months)" },
  ],
  "Education Loan": [
    { key: "admission_letter", label: "Admission Letter" },
    { key: "fee_structure", label: "Fee Structure" },
  ],
  "Business Loan": [
    { key: "gst_returns", label: "GST Returns" },
    { key: "business_proof", label: "Business Registration Proof" },
  ],
  "Agriculture Loan": [
    { key: "land_records", label: "Land Records" },
  ],
  "Vehicle Loan": [
    { key: "vehicle_quote", label: "Vehicle Quotation" },
  ],
};
