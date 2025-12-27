import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSingleLoanReqAPI,
  updateLoanReqStatus,
  type LoanData,
} from "../../services/loan.api";

const AdminSingleLoanRequest: React.FC = () => {
  const { loan_id } = useParams<{ loan_id: string }>();
  const [data, setData] = useState<LoanData | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [interestInput, setInterestInput] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const fetchData = async () => {
    if (!loan_id) return;
    const res = await getSingleLoanReqAPI(loan_id);
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl py-10 text-center text-gray-500">
        No loan record found.
      </div>
    );
  }

  /* --------- INTEREST VALIDATION --------- */
  const handleInterestChange = (value: string) => {
    if (value === "") {
      setInterestInput("");
      setInterestRate(null);
      return;
    }

    const regex = /^(10(\.0*)?|[0-9](\.\d*)?)$/;
    if (regex.test(value)) {
      const num = Number(value);
      if (num >= 0 && num <= 10) {
        setInterestInput(value);
        setInterestRate(num);
      }
    }
  };

  /* --------- ACTION HANDLERS --------- */
  const handleApprove = async () => {
    if (!loan_id || interestRate === null) return;
    const res = await updateLoanReqStatus(
      loan_id,
      "approve",
      null,
      interestRate // set interest during approval
    );
    if (res) {
      fetchData();
      setAction(null);
      setInterestInput("");
      setInterestRate(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim() || !loan_id) return;
    const res = await updateLoanReqStatus(loan_id, "reject", rejectReason);
    if (res) {
      fetchData();
      setAction(null);
      setRejectReason("");
    }
  };

  return (
    <div className="mx-auto max-w-6xl py-6 space-y-8 text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <div>
          <h2 className="text-xl font-semibold">Loan Request Details</h2>
          <p className="text-sm text-gray-500">{data.loan_id}</p>
        </div>
        <p className="text-sm font-medium uppercase">
          Status:{" "}
          <span
            className={`${data.loan_status === "under_process"
                ? "text-yellow-600"
                : data.loan_status === "approved"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
          >
            {data.loan_status}
          </span>
        </p>
      </div>

      {/* Loan Info */}
      <AdminSection title="Loan Information">
        <AdminRow label="Loan Type" value={data.loan_type} />
        <AdminRow
          label="Loan Amount"
          value={`₹ ${Number(data.loan_amount).toLocaleString()}`}
        />
        <AdminRow label="Tenure" value={`${data.tenure} Months`} />
        <AdminRow
          label="Applied On"
          value={new Date(data.loan_created_at).toLocaleDateString()}
        />
      </AdminSection>

      {/* Customer */}
      <AdminSection title="Customer Details">
        <AdminRow label="Name" value={data.user_name} />
        <AdminRow label="Email" value={data.email} />
        <AdminRow label="Mobile" value={data.mobile_number} />
      </AdminSection>

      {/* Account */}
      <AdminSection title="Linked Account">
        <AdminRow label="Account Number" value={data.account_number} />
        <AdminRow label="Account Type" value={data.account_type} />
        <AdminRow
          label="Available Balance"
          value={`₹ ${Number(data.balance).toLocaleString()}`}
        />
        <AdminRow label="Account Status" value={data.account_status} />
      </AdminSection>

      {/* Documents */}
      <AdminSection title="Submitted Documents">
        {Object.entries(data.documents).map(([doc, files]) =>
          files.map((file, idx) => (
            <div
              key={`${doc}-${idx}`}
              className="flex justify-between py-2 border-b last:border-none"
            >
              <span className="capitalize text-gray-700">
                {doc.replace("_", " ")}
              </span>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium"
              >
                {file.file_type.toUpperCase()}
              </a>
            </div>
          ))
        )}
      </AdminSection>

      {/* Admin Actions */}
      {data.loan_status === "under_process" && (
        <div className="border-t pt-4 space-y-3">
          {!action && (
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setAction("approve")}
                className="text-green-700 font-medium"
              >
                Final Approve
              </button>
              <button
                onClick={() => setAction("reject")}
                className="text-red-700 font-medium"
              >
                Reject
              </button>
            </div>
          )}

          {/* Approve with interest */}
          {action === "approve" && (
            <div className="flex items-center gap-4">
              <label>Interest Rate (%)</label>
              <input
                type="text"
                value={interestInput}
                onChange={(e) => handleInterestChange(e.target.value)}
                className="border px-2 py-1 w-24"
                placeholder="0 - 10"
              />
              <button
                disabled={interestRate === null}
                onClick={handleApprove}
                className="text-green-700 font-medium disabled:text-gray-400"
              >
                Confirm Final Approve
              </button>
            </div>
          )}

          {/* Reject */}
          {action === "reject" && (
            <div className="space-y-2">
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border px-2 py-1"
                placeholder="Enter rejection reason"
              />
              <div className="flex justify-end">
                <button
                  disabled={!rejectReason.trim()}
                  onClick={handleReject}
                  className="text-red-700 font-medium disabled:text-gray-400"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* -------- Reusable Admin Components -------- */
const AdminSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="font-semibold border-b pb-1 mb-2">{title}</h3>
    {children}
  </div>
);

const AdminRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-1">
    <span className="text-gray-600">{label}</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

export default AdminSingleLoanRequest;
