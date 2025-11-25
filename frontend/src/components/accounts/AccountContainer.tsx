import React from "react";
import AccountCard from "./AccountCard";

interface Account {
  account_number: string;
  account_type: string;
  balance: number;
  status: string;
  created_at: string;
}

interface Props {
  accounts: Account[];
}

const AccountContainer: React.FC<Props> = ({ accounts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {accounts.map((acc) => (
        <AccountCard key={acc.account_number} account={acc} />
      ))}
    </div>
  );
};

export default AccountContainer;
