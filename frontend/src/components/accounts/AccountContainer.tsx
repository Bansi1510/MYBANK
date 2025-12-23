import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import AccountCard from "./AccountCard";
import TransactionCard from "./TransactionCard";

const AccountContainer: React.FC = () => {
  const profile = useSelector((state: RootState) => state.auth.profile);

  if (!profile || profile.accounts.length === 0) {
    return <p>No account available</p>;
  }

  const account = profile.accounts[0]; // first account (for now)

  const mergedAccount = {
    ...account,
    name: profile.name,
    email: profile.email,
    mobile_number: profile.mobile_number,
    address: profile.address,
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Your Account</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        <AccountCard key={mergedAccount.id} account={mergedAccount} />
        <TransactionCard />
      </div>
    </section>
  );
};

export default AccountContainer;
