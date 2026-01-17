import React, { useState } from "react";
import { createKycAPI, type PendingKYC } from "../../services/kyc.api";



const CreateKYC: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarLast4, setAadhaarLast4] = useState("");
  const [message, setMessage] = useState("");
  const [pendingKYCs, setPendingKYCs] = useState<PendingKYC[]>([]);

  // Handle KYC creation (UI only)
  const handleCreateKYC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !panNumber || !aadhaarLast4) {
      setMessage("All fields are required");
      return;
    }

    console.log({
      account_number: accountNumber,
      pan_number: panNumber,
      aadhaar_last4: aadhaarLast4,
    });

    const res = await createKycAPI(accountNumber, panNumber, aadhaarLast4);

    if (!res) return;

    const newKYC: PendingKYC = {
      kyc_id: pendingKYCs.length + 1,
      name: `Customer (${accountNumber})`,
      pan_number: panNumber,
      kyc_status: "PENDING",
      created_at: new Date().toISOString(),
    };

    setPendingKYCs([newKYC, ...pendingKYCs]);
    setMessage(`KYC created for account ${accountNumber}`);
    setAccountNumber("");
    setPanNumber("");
    setAadhaarLast4("");
  };

  const handleApprove = (kyc_id: number) => {
    alert(`Approved KYC ID: ${kyc_id}`);
  };

  const handleReject = (kyc_id: number) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    alert(`Rejected KYC ID: ${kyc_id} | Reason: ${reason}`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Staff KYC Dashboard</h2>

      {/* Create KYC Form */}
      <form
        onSubmit={handleCreateKYC}
        className="mb-6 p-4 bg-white rounded shadow"
      >
        <h3 className="font-semibold mb-2">Create KYC</h3>
        {message && <div className="text-green-600 mb-2">{message}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="PAN Number"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Aadhaar Last 4"
            value={aadhaarLast4}
            onChange={(e) => setAadhaarLast4(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create KYC
        </button>
      </form>

      {/* Pending KYCs Table */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Pending KYCs</h3>
        {pendingKYCs.length === 0 ? (
          <p>No pending KYC requests</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Customer Name</th>
                <th className="border p-2">PAN</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingKYCs.map((kyc) => (
                <tr key={kyc.kyc_id}>
                  <td className="border p-2">{kyc.name}</td>
                  <td className="border p-2">{kyc.pan_number}</td>
                  <td className="border p-2">{kyc.kyc_status}</td>
                  <td className="border p-2">
                    {new Date(kyc.created_at).toLocaleString()}
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleApprove(kyc.kyc_id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(kyc.kyc_id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CreateKYC;
