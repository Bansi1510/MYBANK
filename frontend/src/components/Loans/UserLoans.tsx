import React, { useEffect, useState } from "react";
import { getUserLoans, type LoanData } from "../services/loan.service";


const UserLoans: React.FC = () => {
  const [data, setData] = useState<LoanData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getUserLoans();
      setData(res);
    }
    fetchData();
  }, []);

  const statusBadge = (status: string) => {
    if (status === "approved")
      return "bg-green-50 text-green-700 border border-green-200";
    if (status === "pending")
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    return "bg-gray-100 text-gray-600 border";
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="border rounded-lg bg-white shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <h2 className="text-sm font-semibold text-gray-800">
            Your Loan Applications
          </h2>
          <p className="text-xs text-gray-500">
            Track status of your submitted loan requests
          </p>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="p-3 text-left">Loan ID</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Tenure</th>
              <th className="p-3 text-left">Loan Policy No</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Applied On</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((loan) => (
              <tr
                key={loan.loan_id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 font-medium text-gray-800">
                  #{loan.loan_id}
                </td>

                <td className="p-3 capitalize text-gray-700">
                  {loan.loan_type}
                </td>

                <td className="p-3 text-gray-800">
                  ₹ {Number(loan.loan_amount).toLocaleString()}
                </td>

                <td className="p-3 text-gray-700">
                  {loan.tenure} yrs
                </td>

                <td className="p-3 text-gray-600">
                  {loan.policy_number}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${statusBadge(
                      loan.status
                    )}`}
                  >
                    {loan.status}
                  </span>
                </td>

                <td className="p-3 text-gray-600">
                  {new Date(loan.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-4 py-3 border-t text-xs text-gray-500">
          Showing {data?.length} loan records
        </div>
      </div>
    </div>
  );
};



export default UserLoans;
