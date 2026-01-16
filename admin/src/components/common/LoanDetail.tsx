import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getLoanPaymentDetailsAPI,
  type LoanEMIData,
  type LoanPayment,
} from "../services/loan.api";

const LoanDetail: React.FC = () => {
  const { policyNumber } = useParams<{ policyNumber: string }>();

  const [loan, setLoan] = useState<LoanEMIData | null>(null);
  const [payments, setPayments] = useState<LoanPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (policyNumber) {
      fetchLoanDetails(policyNumber);
    }
  }, [policyNumber]);

  const fetchLoanDetails = async (policyNo: string) => {
    setLoading(true);
    const res = await getLoanPaymentDetailsAPI(policyNo);
    if (res) {
      setLoan(res.loan);
      setPayments(res.payments);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Loading loan details...
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        No loan details found
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Loan Details
        </h2>
        <p className="text-sm text-gray-500">
          Policy Number:{" "}
          <span className="font-medium">{loan.policy_number}</span>
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border shadow rounded-xl p-4">
          <p className="text-xs text-gray-500">Loan Amount</p>
          <p className="text-lg font-semibold">
            ₹{loan.original_loan_amount.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white border shadow rounded-xl p-4">
          <p className="text-xs text-gray-500">Monthly EMI</p>
          <p className="text-lg font-semibold text-blue-600">
            ₹{loan.monthly_emi.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white border shadow rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Paid</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{loan.total_paid.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white border shadow rounded-xl p-4">
          <p className="text-xs text-gray-500">Remaining Amount</p>
          <p className="text-lg font-semibold text-red-600">
            ₹{loan.remaining_amount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Loan Info */}
      <div className="bg-white border shadow rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Loan Type</p>
          <p className="font-medium">{loan.loan_type}</p>
        </div>

        <div>
          <p className="text-gray-500">Interest Rate</p>
          <p className="font-medium">{loan.interest_rate}%</p>
        </div>

        <div>
          <p className="text-gray-500">Tenure</p>
          <p className="font-medium">{loan.tenure} months</p>
        </div>

        <div>
          <p className="text-gray-500">Remaining Tenure</p>
          <p className="font-medium">{loan.remaining_tenure} months</p>
        </div>

        <div>
          <p className="text-gray-500">Principal Paid</p>
          <p className="font-medium">
            ₹{loan.principal_paid.toLocaleString("en-IN")}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Interest Paid</p>
          <p className="font-medium">
            ₹{loan.interest_paid.toLocaleString("en-IN")}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>
          <p className="font-medium capitalize">{loan.status}</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white border shadow rounded-xl">
        <div className="px-5 py-3 border-b">
          <h3 className="font-semibold text-gray-800">
            Payment History
          </h3>
        </div>

        {payments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No payment history available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Principal</th>
                  <th className="px-4 py-3 text-left">Interest</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                  <th className="px-4 py-3 text-left">Method</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.payment_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {new Date(p.payment_date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      ₹{Number(p.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      ₹{Number(p.principal_component).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      ₹{Number(p.interest_component).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      ₹{Number(p.remaining_balance).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {p.payment_method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanDetail;
