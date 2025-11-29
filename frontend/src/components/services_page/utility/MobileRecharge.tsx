import React, { useState } from "react";
import PageHeader from "../common/PageHeader";
import SectionCard from "../common/SectionCard";
import InputField from "../common/InputField";
import Button from "../common/Button";

const MobileRecharge: React.FC = () => {
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="min-h-screen bg-gray-50   p-6 md:p-10">
      <PageHeader title="Mobile Recharge" subtitle="Top up prepaid mobile numbers instantly." />

      <div className="max-w-md mx-auto">
        <SectionCard>
          <InputField label="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter mobile number" />
          <InputField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="₹0.00" />
          <Button text="Recharge" onClick={() => { /* integrate recharge */ }} />
        </SectionCard>
      </div>
    </div>
  );
};

export default MobileRecharge;
