import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleLoanReqAPI, updateLoanReqStatus, type LoanData } from "../../services/loan.api";

const SingleLoanRequest: React.FC = () => {
  const { loan_id } = useParams<{ loan_id: string }>();
  const [data, setData] = useState<LoanData | null>(null);

  const [action, setAction] = useState<"approve" | "reject" | null>(null);
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
      <div className="mx-auto max-w-5xl py-10 text-sm text-gray-600">
        No loan record found
      </div>
    );
  }

  /* ---------- ACTION HANDLERS ---------- */
  const handleApprove = async () => {
    if (!loan_id) return;
    const res = await updateLoanReqStatus(loan_id, "approve");
    if (res) {
      fetchData();
      setAction(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    if (!loan_id) return;
    const res = await updateLoanReqStatus(loan_id, "reject", rejectReason);
    if (res) {
      fetchData();
      setAction(null);
      setRejectReason("");
    }
  };

  return (
    <div className="mx-auto max-w-5xl py-6 text-sm text-gray-900 space-y-6">
      {/* Header */}
      <div className="border-b pb-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold">Loan Application</div>
            <div className="text-xs text-gray-500">{data.loan_id}</div>
          </div>
          <div className="text-xs font-medium uppercase">
            Status: {data.loan_status}
          </div>
        </div>
      </div>

      {/* Loan Information */}
      <Section title="Loan Information">
        <Row label="Loan Type" value={data.loan_type} />
        <Row label="Loan Amount" value={`₹ ${Number(data.loan_amount).toLocaleString()}`} />
        <Row label="Tenure" value={`${data.tenure} Months`} />
        <Row label="Applied Date" value={new Date(data.loan_created_at).toLocaleDateString()} />
      </Section>

      {/* Customer */}
      <Section title="Customer Details">
        <Row label="Customer Name" value={data.user_name} />
        <Row label="Email" value={data.email} />
        <Row label="Mobile Number" value={data.mobile_number} />
      </Section>

      {/* Account */}
      <Section title="Linked Account">
        <Row label="Account Number" value={data.account_number} />
        <Row label="Account Type" value={data.account_type} />
        <Row label="Available Balance" value={`₹ ${Number(data.balance).toLocaleString()}`} />
        <Row label="Account Status" value={data.account_status} />
      </Section>

      {/* Documents */}
      <Section title="Submitted Documents">
        {Object.entries(data.documents).map(([doc, files]) =>
          files.map((file, idx) => (
            <div key={`${doc}-${idx}`} className="flex justify-between py-2 border-b last:border-none">
              <span className="capitalize text-gray-700">{doc.replace("_", " ")}</span>
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-700">
                {file.file_type.toUpperCase()}
              </a>
            </div>
          ))
        )}
      </Section>

      {/* Action Buttons */}
      {data.loan_status === "pending" || data.loan_status === "under_process" ? (
        <div className="border-t pt-4 space-y-3">
          {!action && (
            <div className="flex justify-end gap-4">
              <button onClick={() => setAction("approve")} className="text-green-700 font-medium">
                Approve
              </button>
              <button onClick={() => setAction("reject")} className="text-red-700 font-medium">
                Reject
              </button>
            </div>
          )}

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

          {action === "approve" && (
            <div className="flex justify-end">
              <button
                onClick={handleApprove}
                className="text-green-700 font-medium"
              >
                Confirm Approve
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

/* -------- Reusable Components -------- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <div className="font-medium border-b pb-1 mb-2">{title}</div>
    <div>{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-1">
    <span className="text-gray-600">{label}</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

export default SingleLoanRequest;
