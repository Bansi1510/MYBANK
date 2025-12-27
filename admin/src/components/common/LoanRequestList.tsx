import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLoanReqAPI, type AllLoanRequest } from "../services/loan.api";

const LoanRequestList: React.FC = () => {
  const [data, setData] = useState<AllLoanRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoanRequests = async () => {
      const res = await getLoanReqAPI();
      setData(res);
      setLoading(false);
    };

    fetchLoanRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading loan requests...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Loan Requests</h2>

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
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No loan requests found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
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
