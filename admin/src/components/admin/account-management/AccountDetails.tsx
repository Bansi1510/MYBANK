import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiUser, FiCreditCard, FiShield } from "react-icons/fi";
import {
  getUserByAccNumber,
  type AccountDetails as AccountDetailsType,
} from "../../services/adminAccount.api";

/* ---------- Small Helpers ---------- */
const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between py-1 text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN");

/* ---------- Component ---------- */
const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId?: string }>();
  const [data, setData] = useState<AccountDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) return;

    (async () => {
      try {
        const res = await getUserByAccNumber(accountId);
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [accountId]);

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!data) return <p className="text-sm text-red-500">No data found</p>;

  return (
    <div className="max-w-3xl space-y-5">
      {/* Account */}
      <section>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FiCreditCard className="text-gray-500" /> Account
        </h2>
        <Row label="Account Number" value={data.account_number} />
        <Row label="Type" value={data.account_type} />
        <Row label="Status" value={data.status} />
        <Row label="Balance" value={`₹ ${data.balance}`} />
        <Row label="Created" value={formatDate(data.account_created_at)} />
      </section>

      <hr />

      {/* User */}
      <section>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FiUser className="text-gray-500" /> User
        </h2>
        <Row label="Name" value={data.name} />
        <Row label="Email" value={data.email} />
        <Row label="Mobile" value={data.mobile_number} />
        <Row label="Address" value={data.address} />
      </section>

      <hr />

      {/* KYC */}
      <section>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FiShield className="text-gray-500" /> KYC
        </h2>
        <Row label="Verified" value={data.kyc_verified ? "Yes" : "No"} />
        <Row label="Aadhar" value={data.aadhar_number} />
        <Row label="PAN" value={data.pan_number ?? "N/A"} />
      </section>
    </div>
  );
};

export default AccountDetails;
