import React, { useState } from "react";
import { getFullUserProfile, type UserProfile } from "../services/adminAccount.api";

/* ================= COMPONENT ================= */

const UserFullProfile: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleGetDetails = async () => {
    if (!accountNumber.trim()) return;
    const data = await getFullUserProfile(accountNumber);
    if (!data) return;
    console.log(data);
    setProfile(data)
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
