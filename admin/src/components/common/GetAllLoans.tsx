import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllLoansAPI, type LoanDetails } from "../services/loan.api";

const GetAllLoans: React.FC = () => {
  const [loans, setLoans] = useState<LoanDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    const data = await getAllLoansAPI();
    if (Array.isArray(data)) setLoans(data);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Loan Management
          </h2>
          <p className="text-sm text-gray-500">
            Overview of all registered loans
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Loading loan records...
            </div>
          ) : loans.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No loan records found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th className="px-4 py-3 text-left">Loan ID</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Tenure</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Policy No</th>
                    <th className="px-4 py-3 text-left">Created</th>
                  </tr>
                </thead>

                <tbody className="text-sm text-gray-700">
                  {loans.map((loan) => (
                    <tr
                      key={loan.loan_id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium">
                        {loan.loan_id}
                      </td>

                      <td className="px-4 py-3 capitalize">
                        {loan.loan_type.replace("-", " ")}
                      </td>

                      <td className="px-4 py-3 font-semibold">
                        ₹{loan.loan_amount.toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-3">
                        {loan.tenure} months
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
                            ${loan.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : loan.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                        >
                          {loan.status}
                        </span>
                      </td>

                      {/* 🔗 Policy Number Link */}
                      <td className="px-4 py-3">
                        {loan.policy_number ? (
                          <Link
                            to={`${loan.loan_id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {loan.policy_number}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {new Date(loan.created_at).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetAllLoans;
