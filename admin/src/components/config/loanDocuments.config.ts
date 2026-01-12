// loanDocuments.config.ts

export const COMMON_DOCUMENTS = [
  { key: "aadhaar", label: "Aadhaar Card" },
  { key: "pan", label: "PAN Card" },
  { key: "address_proof", label: "Address Proof" },
  { key: "photo", label: "Photograph" },
];

export const LOAN_SPECIFIC_DOCUMENTS: Record<string, { key: string; label: string }[]> = {
  "home-loan": [
    { key: "property_papers", label: "Property Documents" },
    { key: "sale_agreement", label: "Sale Agreement" },
  ],
  "personal-loan": [
    { key: "salary_slips", label: "Last 3 Months Salary Slips" }, 
    { key: "bank_statement", label: "Bank Statement (6 Months)" },
  ],
  "education-loan": [
    { key: "admission_letter", label: "Admission Letter" },
    { key: "fee_structure", label: "Fee Structure" },
  ],
  "business-loan": [
    { key: "gst_returns", label: "GST Returns" },
    { key: "business_proof", label: "Business Registration Proof" },
  ],
  "agriculture-loan": [
    { key: "land_records", label: "Land Records" },
  ],
  "vehicle-loan": [
    { key: "vehicle_quote", label: "Vehicle Quotation" },
  ],
  "gold-loan": [
    { key: "gold_jewelry", label: "Gold Ornaments" },
    { key: "valuation_certificate", label: "Valuation Certificate" },
  ],
  "loan-against-property": [
    { key: "property_title", label: "Property Title Deed" },
    { key: "property_evaluation", label: "Property Evaluation Report" },
  ],
};
