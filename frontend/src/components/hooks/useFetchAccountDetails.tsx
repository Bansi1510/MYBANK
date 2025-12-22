import { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { fetchAccountDetailAPI } from "../services/user.servive";
import { setAccount } from "../redux/slices/accountSlice";

export const useFetchAccountDetail = () => {
  const dispatch = useDispatch();

  const account = useSelector((state: RootState) => state.account.account);
  const user = useSelector((state: RootState) => state.auth.profile);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const apiData = await fetchAccountDetailAPI();
      console.log(apiData);
      if (!apiData) {
        setError("Account not found");
        return;
      }

      dispatch(setAccount(apiData));
    } catch (err) {
      console.error(err);
      setError("Failed to load account details");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (user && !account) {
      fetchData();
    }
  }, [user, account, fetchData]);


  const combined =
    account && user
      ? {
        name: user.name,
        email: user.email,
        mobile_number: user.mobile_number,
        address: user.address,
        ...account,
      }
      : null;

  return {
    data: combined,
    loading,
    error,
    refetch: fetchData,
  };
};
