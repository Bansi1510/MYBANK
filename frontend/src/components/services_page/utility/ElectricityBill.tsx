import React, { useState } from "react";
import PageHeader from "../common/PageHeader";
import SectionCard from "../common/SectionCard";
import InputField from "../common/InputField";
import Button from "../common/Button";

const ElectricityBill: React.FC = () => {
  const [consumerNo, setConsumerNo] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="min-h-screen bg-gray-50  p-6 md:p-10">
      <PageHeader title="Electricity Bill" subtitle="Pay your electricity bill quickly and securely." />

      <div className="max-w-md mx-auto">
        <SectionCard>
          <InputField label="Consumer Number" value={consumerNo} onChange={(e) => setConsumerNo(e.target.value)} placeholder="Enter consumer number" />
          <InputField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="₹0.00" />
          <Button text="Pay Bill" onClick={() => { /* integrate payment */ }} />
        </SectionCard>
      </div>
    </div>
  );
};

export default ElectricityBill;
