import React, { useState } from "react";
import PageHeader from "../common/PageHeader";
import SectionCard from "../common/SectionCard";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { AccountUpiAPI } from "../../services/transaction.service";
import { useNavigate } from "react-router-dom";

const AccountUPI: React.FC = () => {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const accountUpiHandler = async () => {
    const res = await AccountUpiAPI(account, amount, note);

    if (res) {
      navigate("/upi-success", {
        state: res.transaction,
      });
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <PageHeader title="Send Money via Account" subtitle="Provide recipient account number and IFSC to make a transfer." />

      <div className="max-w-lg mx-auto">
        <SectionCard>
          <InputField label="Account Number" value={account} onChange={(e) => setAccount(e.target.value)} placeholder="Enter account number" />

          <InputField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="₹0.00" />
          <InputField label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Payment description" />
          <Button text="Continue" onClick={() => accountUpiHandler()} />
        </SectionCard>
      </div>
    </div>
  );
};

export default AccountUPI;
