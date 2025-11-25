import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { fetchAccountDetailAPI } from "../services/user.servive";
import { setAccount } from "../redux/slices/accountSlice";

export const useFetchAccountDetail = () => {
  const dispatch = useDispatch();
  const account = useSelector((state: RootState) => state.account.account);
  const user = useSelector((state: RootState) => state.auth.profile);

  const [loading, setLoading] = useState(!account);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const apiData = await fetchAccountDetailAPI();

      if (!apiData) {
        setError("Account not found");
        return;
      }

      dispatch(setAccount(apiData));
    } catch (error) {
      console.log(error);
      setError("Failed to load account details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!account) {
      fetchData();
    }
  }, []);

  // merged UI model
  const combined = account && user ? {
    name: user.name,
    email: user.email,
    mobile_number: user.mobile_number,
    address: user.address,
    ...account,
  } : null;

  return {
    data: combined,
    loading,
    error,
    refetch: fetchData,
  };
};
