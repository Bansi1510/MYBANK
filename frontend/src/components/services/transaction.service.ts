 import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/transactions/",
  withCredentials:true
})

API.defaults.withCredentials=true;

export interface TransactionUser {
  account_number: string;
  name: string;
}

export interface BankTransferTransaction {
  transaction_id: string;
  timestamp: string;
  amount: string;
  currency: string;
  description: string | null;
  sender: TransactionUser;
  receiver: TransactionUser;
}

export interface AccountUpiResponse {
  transaction: BankTransferTransaction;
}


export interface MobileUpiTransactionResponse {
  status: boolean;
  message: string;
  transaction: {
    transaction_id: string;
    timestamp: string;
    amount: string;
    currency: string;
    note: string | null;
    sender: {
      account_number: string;
      name: string;
    };
    receiver: {
      account_number: string;
      mobile: string;
      name: string;
    };
  };
}

export const MobileUpiAPI = async (
  senderAccountNumber: string,
  recipientMobile: string,
  amount: string
): Promise<MobileUpiTransactionResponse | null> => {
  try {
    const res = await API.put<MobileUpiTransactionResponse>(
      "/transfer-mobile",
      { senderAccountNumber, recipientMobile, amount }
    );

    if (res.data.status) {
      toast.success(res.data.message);
      return res.data;
    } else {
      toast.error(res.data.message);
      return null;
    }
  } catch (error) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "Mobile UPI transfer error";
    toast.error(msg);
    return null;
  }
};

export const AccountUpiAPI = async (
  toAccount: string,
  amount: string,
  description?: string
): Promise<false | AccountUpiResponse> => {
  try {
    const res = await API.put("transfer-acc", {
      toAccount,
      amount,
      description,
    });

    if (res.data.status) {
      toast.success(res.data.message);

      return {
        transaction: res.data.transaction as BankTransferTransaction,
      };
    } else {
      toast.error(res.data.message);
      return false;
    }
  } catch (error) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "Transfer error";
    toast.error(msg);
    return false;
  }
};
