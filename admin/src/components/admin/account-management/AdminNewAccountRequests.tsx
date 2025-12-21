import React, { useEffect, useState } from "react";
import { getAllNewAccountReq, type AccountRequest } from "../../services/admin.api";
import { changeAccountStatusAPI } from "../../services/adminAccount.api";
import { FaSearch } from "react-icons/fa";

const AdminNewAccountRequests: React.FC = () => {
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const data = await getAllNewAccountReq();
    if (data) {
      setRequests(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (
    id: number,
    action: "approved" | "rejected"
  ) => {
    const res = await changeAccountStatusAPI(id, action);
    if (res) {
      setRequests(prev => prev.filter(r => r.id !== id));
      setTimeout(fetchData, 300);
    }
  };

  // Filter requests based on last 4 digits of Aadhar
  const filteredRequests = requests.filter(r =>
    r.aadhar_number.slice(-4).startsWith(search.trim())
  );

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-[1600px]">

        {/* Header with search */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center">
            New Account Requests
          </h2>

          {/* Search bar */}
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search by last 4 digits of Aadhar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg shadow bg-white">
          <table className="min-w-[2000px] text-sm whitespace-nowrap">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Email</th>
                <th className="px-4 py-3 border">Mobile</th>
                <th className="px-4 py-3 border">Address</th>
                <th className="px-4 py-3 border">Aadhar</th>
                <th className="px-4 py-3 border">PAN</th>
                <th className="px-4 py-3 border">Account Type</th>
                <th className="px-4 py-3 border">Initial Deposit</th>
                <th className="px-4 py-3 border">KYC Type</th>
                <th className="px-4 py-3 border">KYC URL</th>
                <th className="px-4 py-3 border">Created By</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Created At</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 text-center">
                  <td className="px-4 py-2 border">{r.id}</td>
                  <td className="px-4 py-2 border">{r.name}</td>
                  <td className="px-4 py-2 border">{r.email}</td>
                  <td className="px-4 py-2 border">{r.mobile_number}</td>
                  <td className="px-4 py-2 border">{r.address}</td>
                  <td className="px-4 py-2 border">
                    **** **** {r.aadhar_number.slice(-4)}
                  </td>
                  <td className="px-4 py-2 border">{r.pan_number}</td>
                  <td className="px-4 py-2 border capitalize">{r.requested_account_type}</td>
                  <td className="px-4 py-2 border">{r.initial_deposit}</td>
                  <td className="px-4 py-2 border">{r.kyc_document_type}</td>
                  <td className="px-4 py-2 border">
                    {r.kyc_document_url ? (
                      <a href={r.kyc_document_url} target="_blank" className="text-blue-600 underline">
                        View
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-2 border">{r.created_by}</td>
                  <td className="px-4 py-2 border">{r.status}</td>
                  <td className="px-4 py-2 border">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <button
                      onClick={() => handleAction(r.id, "approved")}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(r.id, "rejected")}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={15} className="py-4 text-center text-gray-500 border">
                    No matching requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminNewAccountRequests;
