import React, { useState } from "react";
import PageHeader from "../common/PageHeader";
import SectionCard from "../common/SectionCard";
import InputField from "../common/InputField";
import Button from "../common/Button";

const InsurancePremium: React.FC = () => {
  const [policy, setPolicy] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <PageHeader title="Insurance Premium" subtitle="Pay your policy premiums quickly and securely." />

      <div className="max-w-md mx-auto">
        <SectionCard>
          <InputField label="Policy Number" value={policy} onChange={(e) => setPolicy(e.target.value)} placeholder="Enter policy number" />
          <InputField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="₹0.00" />
          <Button text="Pay Premium" onClick={() => { /* integrate payment */ }} />
        </SectionCard>
      </div>
    </div>
  );
};

export default InsurancePremium;
