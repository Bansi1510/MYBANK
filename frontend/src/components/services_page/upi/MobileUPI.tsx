import React, { useState } from "react";
import PageHeader from "../common/PageHeader";
import SectionCard from "../common/SectionCard";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { MobileUpiAPI } from "../../services/transaction.service";
import { useNavigate } from "react-router-dom";
import { updateBalance } from "../../redux/slices/accountSlice";

const MobileUPI: React.FC = () => {
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const account = useSelector((state: RootState) => state.account.account);

  const mobileUPIHandler = async () => {
    if (!account) {
      alert("Account not found.");
      return;
    }

    try {
      const res = await MobileUpiAPI(
        account.account_number,
        mobile,
        amount
      );

      if (res?.status) {
        // ✅ CALCULATE NEW BALANCE LOCALLY
        const debitAmount = Number(res.transaction.amount);
        const newBalance = account.balance - debitAmount;

        dispatch(updateBalance(newBalance));

        navigate("/upi-success", {
          state: res.transaction,
        });
      }
    } catch (err) {
      console.error("UPI transaction failed", err);
      alert("Transaction failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <PageHeader
        title="Send Money via Mobile"
        subtitle="Enter recipient mobile and amount to send money instantly."
      />

      <div className="max-w-md mx-auto">
        <SectionCard>
          <InputField
            label="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="e.g. 9876543210"
          />
          <InputField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="₹0.00"
          />
          <InputField
            label="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="For recipient"
          />
          <Button text="Continue" onClick={mobileUPIHandler} />
        </SectionCard>
      </div>
    </div>
  );
};

export default MobileUPI;
