import React, { useState } from "react";

/* ================= TYPES ================= */

interface PersonalDetails {
  user_id: number;
  name: string;
  email: string;
  mobile_number: string;
  address: string;
  joined_on: string;
}

interface Account {
  account_id: number;
  account_number: string;
  account_type: string;
  balance: number;
  status: string;
}

interface Kyc {
  kyc_id: number;
  status: string;
  submitted_on: string;
}

interface KycDocument {
  id: number;
  document_type: string;
  document_number: string;
}

interface Loan {
  id: number;
  loan_type: string;
  amount: number;
}

interface LoanPayment {
  id: number;
  loan_id: number;
  amount: number;
  paid_on: string;
}

interface Card {
  id: number;
  card_type: string;
  card_number: string;
}

interface CardPayment {
  id: number;
  amount: number;
  paid_on: string;
}

interface Transaction {
  id: number;
  from_account: string;
  to_account: string;
  amount: number;
  transaction_type: string;
  created_at: string;
}

interface UserProfile {
  personal_details: PersonalDetails;
  account: Account;
  kyc: Kyc | null;
  kyc_documents: KycDocument[];
  loans: Loan[];
  loan_payments: LoanPayment[];
  cards: Card[];
  card_payments: CardPayment[];
  transactions: Transaction[];
}

/* ================= COMPONENT ================= */

const UserFullProfile: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const dummyData: UserProfile = {
    personal_details: {
      user_id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      mobile_number: "9876543210",
      address: "Ahmedabad, Gujarat",
      joined_on: "2024-01-10",
    },
    account: {
      account_id: 101,
      account_number: "1234567890",
      account_type: "Savings",
      balance: 52000,
      status: "active",
    },
    kyc: {
      kyc_id: 1,
      status: "verified",
      submitted_on: "2024-01-12",
    },
    kyc_documents: [
      { id: 1, document_type: "Aadhar", document_number: "XXXX-1234" },
      { id: 2, document_type: "PAN", document_number: "ABCDE1234F" },
    ],
    loans: [{ id: 1, loan_type: "Home Loan", amount: 500000 }],
    loan_payments: [
      { id: 1, loan_id: 1, amount: 15000, paid_on: "2024-02-01" },
    ],
    cards: [
      { id: 1, card_type: "Debit Card", card_number: "**** **** **** 4321" },
    ],
    card_payments: [{ id: 1, amount: 2000, paid_on: "2024-02-15" }],
    transactions: [
      {
        id: 1,
        from_account: "1234567890",
        to_account: "9876543210",
        amount: 5000,
        transaction_type: "Debit",
        created_at: "2024-03-01",
      },
      {
        id: 2,
        from_account: "9999999999",
        to_account: "1234567890",
        amount: 8000,
        transaction_type: "Credit",
        created_at: "2024-03-05",
      },
    ],
  };

  const handleGetDetails = (): void => {
    if (!accountNumber.trim()) return;
    setProfile(dummyData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          User Full Profile
        </h1>

        {/* Search */}
        <div className="flex gap-3">
          <input
            className="w-72 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <button
            onClick={handleGetDetails}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Get Details
          </button>
        </div>

        {profile && (
          <div className="space-y-6">
            {/* Personal & Account */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Section title="Personal Details">
                <Info label="Name" value={profile.personal_details.name} />
                <Info label="Email" value={profile.personal_details.email} />
                <Info label="Mobile" value={profile.personal_details.mobile_number} />
                <Info label="Address" value={profile.personal_details.address} />
              </Section>

              <Section title="Account Details">
                <Info label="Account No" value={profile.account.account_number} />
                <Info label="Type" value={profile.account.account_type} />
                <Info label="Balance" value={`₹${profile.account.balance}`} />
                <Info label="Status" value={profile.account.status} />
              </Section>
            </div>

            {/* KYC */}
            <Section title="KYC Information">
              <Info label="Status" value={profile.kyc?.status ?? "N/A"} />
              <ul className="list-disc ml-5 text-sm text-gray-700">
                {profile.kyc_documents.map((doc) => (
                  <li key={doc.id}>
                    {doc.document_type} — {doc.document_number}
                  </li>
                ))}
              </ul>
            </Section>

            {/* Loans & Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Section title="Loans">
                {profile.loans.map((loan) => (
                  <Info
                    key={loan.id}
                    label={loan.loan_type}
                    value={`₹${loan.amount}`}
                  />
                ))}
              </Section>

              <Section title="Cards">
                {profile.cards.map((card) => (
                  <Info
                    key={card.id}
                    label={card.card_type}
                    value={card.card_number}
                  />
                ))}
              </Section>
            </div>

            {/* Transactions */}
            <Section title="Transactions">
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 border">From</th>
                      <th className="p-2 border">To</th>
                      <th className="p-2 border">Amount</th>
                      <th className="p-2 border">Type</th>
                      <th className="p-2 border">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.transactions.map((tx) => (
                      <tr key={tx.id} className="text-center">
                        <td className="p-2 border">{tx.from_account}</td>
                        <td className="p-2 border">{tx.to_account}</td>
                        <td className="p-2 border">₹{tx.amount}</td>
                        <td className="p-2 border">{tx.transaction_type}</td>
                        <td className="p-2 border">{tx.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= REUSABLE ================= */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white p-5 rounded-lg shadow space-y-2">
    <h2 className="font-semibold text-gray-800">{title}</h2>
    {children}
  </div>
);

const Info: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <p className="text-sm text-gray-700">
    <span className="font-medium">{label}:</span> {value}
  </p>
);

export default UserFullProfile;
