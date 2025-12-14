import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAccByStatus, type Account, type AccountStatus } from "../../services/adminAccount.api";
import AccountsTable from "./AccountsTable";

const AccountStatusView: React.FC = () => {
  const { status } = useParams();
  const [data, setData] = useState<Account[]>([]);
  useEffect(() => {
    if (!status) return;

    const fetchData = async () => {
      const result = await getAccByStatus(status);
      setData(result);
    };

    fetchData();
  }, [status]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-3">
      <h2 className="text-lg font-semibold text-gray-800 capitalize">
        {status} Account Details
      </h2>

      <AccountsTable
        data={data}
        status={status as AccountStatus}
      />
    </div>
  );
};

export default AccountStatusView;
