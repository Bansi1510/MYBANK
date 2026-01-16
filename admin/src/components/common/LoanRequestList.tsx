import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getLoanReqAPI, type AllLoanRequest } from "../services/loan.api";

const LoanRequestList: React.FC = () => {
  const [data, setData] = useState<AllLoanRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [accountFilter, setAccountFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchLoanRequests = async () => {
      const res = await getLoanReqAPI();
      setData(res);
      setLoading(false);
    };

    fetchLoanRequests();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const accountMatch = item.accountNumber
        .toString()
        .includes(accountFilter);

      const statusMatch =
        statusFilter === "all" || item.status === statusFilter;

      return accountMatch && statusMatch;
    });
  }, [data, accountFilter, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading loan requests...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header + Filters */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Loan Requests</h2>

        <div className="flex gap-3">
          {/* Account Number Filter */}
          <input
            type="text"
            placeholder="Account No"
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="loan_approve">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Customer Name</th>
              <th className="border px-4 py-2 text-left">Mobile</th>
              <th className="border px-4 py-2 text-left">Account No</th>
              <th className="border px-4 py-2 text-left">Account Type</th>
              <th className="border px-4 py-2 text-left">Loan Type</th>
              <th className="border px-4 py-2 text-left">Balance</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No loan requests found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.loan_id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.userName}</td>
                  <td className="border px-4 py-2">{item.mobileNumber}</td>
                  <td className="border px-4 py-2">{item.accountNumber}</td>
                  <td className="border px-4 py-2 capitalize">
                    {item.accountType}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {item.loanType}
                  </td>
                  <td className="border px-4 py-2">₹{item.balance}</td>
                  <td className="border px-4 py-2 capitalize">
                    {item.status}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <Link
                      to={`details/${item.loan_id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Show
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanRequestList;
