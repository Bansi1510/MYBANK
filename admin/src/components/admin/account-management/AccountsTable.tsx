import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Account, AccountStatus } from "../../services/adminAccount.api";
import { FaSearch } from "react-icons/fa";

interface Props {
  data: Account[];
  status: AccountStatus;
}

const badgeStyle: Record<AccountStatus, string> = {
  active: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
  suspended: "bg-red-100 text-red-700",
};

const AccountsTable: React.FC<Props> = ({ data, status }) => {
  const [search, setSearch] = useState("");

  const rows = data.filter(
    (acc) =>
      acc.status === status &&
      acc.account_number.toString().startsWith(search.trim())
  );

  return (
    <div className="border rounded-lg bg-white p-4">
      {/* Top bar with search */}
      <div className="mb-4 flex justify-end">
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by Account Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Mobile</th>
            <th className="px-4 py-3 text-left">Aadhar</th>
            <th className="px-4 py-3 text-left">Account No</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {rows.map((acc, index) => (
            <tr key={index}>
              <td className="px-4 py-3 font-medium text-gray-800">{acc.name}</td>
              <td className="px-4 py-3 text-gray-600">{acc.mobile_number}</td>
              <td className="px-4 py-3 text-gray-600">{acc.aadhar_number}</td>
              <td className="px-4 py-3">
                <Link
                  to={`${acc.account_number}`}
                  className="text-blue-600 hover:underline"
                >
                  {acc.account_number}
                </Link>
              </td>
              <td className="px-4 py-3 capitalize text-gray-600">
                {acc.account_type}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${badgeStyle[acc.status as AccountStatus]
                    }`}
                >
                  {acc.status}
                </span>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                No accounts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;
