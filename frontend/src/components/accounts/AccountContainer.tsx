import React from "react";
import AccountCard from "./AccountCard";
import TransactionCard from "./TransactionCard";

interface Account {
  id: number;
  account_number: string;
  account_type: string;
  status: string;
  name: string;
  email: string;
  mobile_number: string;
  address: string;
  balance: number;
  created_at: string;
}

interface Props {
  account: Account | null;
}

const AccountContainer: React.FC<Props> = ({ account }) => {
  if (!account) return <p>No account available</p>;
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Your Account</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">

        <AccountCard key={account.id} account={account} />
        <TransactionCard />
      </div>
    </section>
  );
};
export default AccountContainer;