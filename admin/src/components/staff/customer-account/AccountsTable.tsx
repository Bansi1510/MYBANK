import React, { useEffect, useState } from "react";
import { getAccByStatus } from "../../services/adminAccount.api";

interface Account {
  name: string;
  mobile_number: string;
  aadhar_number: string;
  pan_number: string | null;
  account_number: string;
  account_type: string;
  status: string;
}

const AccountsTable: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAccByStatus();
      setAccounts(data);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border rounded-md">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-semibold text-gray-800">
              Accounts List
            </h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left border-b border-r">Customer</th>
                  <th className="px-4 py-2 text-left border-b border-r">Mobile</th>
                  <th className="px-4 py-2 text-left border-b border-r">Aadhar</th>
                  <th className="px-4 py-2 text-left border-b border-r">PAN</th>
                  <th className="px-4 py-2 text-left border-b border-r">Account No</th>
                  <th className="px-4 py-2 text-left border-b border-r">Type</th>
                  <th className="px-4 py-2 text-left border-b border-r">Status</th>
                  <th className="px-4 py-2 text-left border-b">Actions</th>
                </tr>
              </thead>

              <tbody>
                {accounts.map((acc, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b border-r font-medium text-gray-800">
                      {acc.name}
                    </td>

                    <td className="px-4 py-2 border-b border-r whitespace-nowrap">
                      {acc.mobile_number}
                    </td>

                    <td className="px-4 py-2 border-b border-r">
                      {acc.aadhar_number}
                    </td>

                    <td className="px-4 py-2 border-b border-r">
                      {acc.pan_number || "-"}
                    </td>

                    <td className="px-4 py-2 border-b border-r font-mono text-gray-700">
                      {acc.account_number}
                    </td>

                    <td className="px-4 py-2 border-b border-r capitalize">
                      {acc.account_type}
                    </td>

                    <td className="px-4 py-2 border-b border-r">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs
                          ${acc.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {acc.status}
                      </span>
                    </td>

                    <td className="px-4 py-2 border-b">
                      <button className="text-blue-600 text-xs hover:underline mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 text-xs hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {accounts.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-500"
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
    </div>
  );
};

export default AccountsTable;
