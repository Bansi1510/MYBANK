import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { fetchAccountDetailAPI, type AccountAPIModel } from "../services/user.servive";


export interface CombinedAccountDetail {
  name: string;
  email: string;
  mobile_number: string;
  address: string;

  id: number;
  account_number: string;
  account_type: string;
  balance: string;
  status: string;
  created_at: string;
}

export const useFetchAccountDetail = () => {
  const [data, setData] = useState<CombinedAccountDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useSelector((state: RootState) => state.auth.profile);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const apiData: AccountAPIModel | null =
        await fetchAccountDetailAPI();


      if (!apiData) {
        setError("Account not found");
        setLoading(false);
        return;
      }

      const merged: CombinedAccountDetail = {
        name: user?.name || "",
        email: user?.email || "",
        mobile_number: user?.mobile_number || "",
        address: user?.address || "",

        id: apiData.id,
        account_number: apiData.account_number,
        account_type: apiData.account_type,
        balance: apiData.balance,
        status: apiData.status,
        created_at: apiData.created_at,
      };

      setData(merged);
    } catch (error) {
      console.log(error);
      setError("Failed to load account details");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
