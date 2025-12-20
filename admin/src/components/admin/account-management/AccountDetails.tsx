import { useParams } from "react-router-dom";

interface RouteParams extends Record<string, string | undefined> {
  status?: string;
  accountId?: string;
}

const AccountDetails: React.FC = () => {
  const { status, accountId } = useParams<RouteParams>();

  return (
    <div>
      <h2 className="text-xl font-bold">Account Details</h2>

      <p>
        <strong>Status:</strong> {status ?? "N/A"}
      </p>

      <p>
        <strong>Account Number:</strong> {accountId ?? "N/A"}
      </p>
    </div>
  );
};

export default AccountDetails;
