import React, { useState } from "react";
import PageHeader from "../common/PageHeader";
import SectionCard from "../common/SectionCard";
import InputField from "../common/InputField";
import Button from "../common/Button";

const MoneyTransfer: React.FC = () => {
  const [fromAcc, setFromAcc] = useState("");
  const [toAcc, setToAcc] = useState("");
  const [amount, setAmount] = useState("");
  const [ifsc, setIfsc] = useState("");

  return (
    <div className="min-h-screen bg-gray-50   p-6 md:p-10">
      <PageHeader title="Money Transfer" subtitle="Send money between bank accounts securely." />

      <div className="max-w-lg mx-auto">
        <SectionCard>
          <InputField label="From Account" value={fromAcc} onChange={(e) => setFromAcc(e.target.value)} placeholder="Your account number" />
          <InputField label="To Account" value={toAcc} onChange={(e) => setToAcc(e.target.value)} placeholder="Recipient account number" />
          <InputField label="IFSC Code" value={ifsc} onChange={(e) => setIfsc(e.target.value)} placeholder="Recipient IFSC" />
          <InputField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="₹0.00" />
          <Button text="Transfer" onClick={() => { /* integrate transfer API */ }} />
        </SectionCard>
      </div>
    </div>
  );
};

export default MoneyTransfer;
