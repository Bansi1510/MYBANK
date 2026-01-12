import React, { useEffect, useState } from "react";
import {
  getAccByStatus,
  updateAccountStatus,
  type Account,
} from "../../services/adminAccount.api";

const AccountsTable: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const fetchData = async () => {
    const data = await getAccByStatus();
    setAccounts(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAccountStatus = async (accountNumber: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const res = await updateAccountStatus(accountNumber, newStatus);
    if (res) fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-10 py-8">
      <div className="bg-white border rounded-lg shadow-sm w-full">

        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Customer Accounts
          </h2>
          <span className="text-sm text-gray-500">
            Total: {accounts.length}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[15px] border-collapse">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 text-left border-b border-r">Customer</th>
                <th className="px-5 py-3 text-left border-b border-r">Mobile</th>
                <th className="px-5 py-3 text-left border-b border-r">Aadhaar</th>
                <th className="px-5 py-3 text-left border-b border-r">PAN</th>
                <th className="px-5 py-3 text-left border-b border-r">
                  Account No
                </th>
                <th className="px-5 py-3 text-left border-b border-r">Type</th>
                <th className="px-5 py-3 text-left border-b border-r">Status</th>
                <th className="px-5 py-3 text-left border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {accounts.map((acc, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-3 border-b border-r font-medium text-gray-800">
                    {acc.name}
                  </td>

                  <td className="px-5 py-3 border-b border-r">
                    {acc.mobile_number}
                  </td>

                  <td className="px-5 py-3 border-b border-r font-mono">
                    {acc.aadhar_number}
                  </td>

                  <td className="px-5 py-3 border-b border-r">
                    {acc.pan_number || "-"}
                  </td>

                  <td className="px-5 py-3 border-b border-r font-mono text-gray-700">
                    {acc.account_number}
                  </td>

                  <td className="px-5 py-3 border-b border-r capitalize">
                    {acc.account_type}
                  </td>

                  <td className="px-5 py-3 border-b border-r">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${acc.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {acc.status}
                    </span>
                  </td>

                  <td className="px-5 py-3 border-b">
                    <button
                      className={`text-sm font-medium hover:underline
                              ${acc.status === "active"
                          ? "text-red-600"
                          : "text-green-600"
                        }`}
                      onClick={() =>
                        handleToggleAccountStatus(acc.account_number, acc.status)
                      }
                    >
                      {acc.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>

                </tr>
              ))}

              {accounts.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No accounts found
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

export default AccountsTable;
