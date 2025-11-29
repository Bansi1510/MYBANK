import React, { useState } from "react";
import PageHeader from "../common/PageHeader";
import SectionCard from "../common/SectionCard";
import InputField from "../common/InputField";
import Button from "../common/Button";

const CheckBalance: React.FC = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50  p-6 md:p-10">
      <PageHeader title="Check Account Balance" subtitle="Enter account number to view latest balance." />

      <div className="max-w-md mx-auto">
        <SectionCard>
          <InputField label="Account Number" value={account} onChange={(e) => setAccount(e.target.value)} placeholder="Enter account number" />
          <Button text="Get Balance" onClick={() => { /* fetch and setBalance */ }} />
          {balance !== null && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
              <div className="text-sm text-gray-500">Available Balance</div>
              <div className="text-2xl font-semibold">₹{balance.toFixed(2)}</div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default CheckBalance;
