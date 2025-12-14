import React, { useEffect, useState } from "react";
import { getAccByStatus, type Account } from "../../services/adminAccount.api";
import AccountsTable from "./AccountsTable";




const ActiveAccounts: React.FC = () => {
  const [data, setData] = useState<Account[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setData(await getAccByStatus("active"))
    };
    fetchData();
  }, [])
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">
        Active Account Details
      </h2>

      <AccountsTable
        data={data}
        status="active"
      />
    </div>
  );
};

export default ActiveAccounts;
