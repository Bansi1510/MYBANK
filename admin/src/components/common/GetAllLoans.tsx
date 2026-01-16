import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllLoansAPI, type LoanDetails } from "../services/loan.api";

/** Fixed Loan Types */
const LOAN_TYPES = [
  "home",
  "education",
  "personal",
  "vehicle",
  "gold",
  "property",
  "agriculture",
  "business",
];

const GetAllLoans: React.FC = () => {
  const [loans, setLoans] = useState<LoanDetails[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔎 Filters
  const [loanType, setLoanType] = useState("");
  const [policySearch, setPolicySearch] = useState("");

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    const data = await getAllLoansAPI();
    if (Array.isArray(data)) {
      setLoans(data);
    }
    setLoading(false);
  };

  // 🧠 Filter logic
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const typeMatch = loanType
        ? loan.loan_type === loanType
        : true;

      const policyMatch = policySearch
        ? loan.policy_number
          ?.toLowerCase()
          .includes(policySearch.toLowerCase())
        : true;

      return typeMatch && policyMatch;
    });
  }, [loans, loanType, policySearch]);

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

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Loan Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Loan Type
              </label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {LOAN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Policy Number Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Policy Number
              </label>
              <input
                type="text"
                placeholder="Search policy number"
                value={policySearch}
                onChange={(e) => setPolicySearch(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Loading loan records...
            </div>
          ) : filteredLoans.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No matching loan records
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
                  {filteredLoans.map((loan) => (
                    <tr
                      key={loan.loan_id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium">
                        {loan.loan_id}
                      </td>

                      <td className="px-4 py-3 capitalize">
                        {loan.loan_type}
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
                            }`}
                        >
                          {loan.status}
                        </span>
                      </td>

                      {/* Policy Link */}
                      <td className="px-4 py-3">
                        {loan.policy_number ? (
                          <Link
                            to={`${loan.policy_number}`}
                            className="text-blue-600 hover:underline font-medium"
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
