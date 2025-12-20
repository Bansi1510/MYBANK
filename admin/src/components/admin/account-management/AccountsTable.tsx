import React from "react";
import { Link } from "react-router-dom";
import type { Account, AccountStatus } from "../../services/adminAccount.api";



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
  const rows = data.filter((acc) => acc.status === status);

  return (
    <div className="border rounded-lg bg-white">
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
              <td className="px-4 py-3 font-medium text-gray-800">
                {acc.name}
              </td>

              <td className="px-4 py-3 text-gray-600">
                {acc.mobile_number}
              </td>

              <td className="px-4 py-3 text-gray-600">
                {acc.aadhar_number}
              </td>

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
                  className={`px-3 py-1 text-xs rounded-full ${badgeStyle[acc.status as AccountStatus]}`}
                >
                  {acc.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;
