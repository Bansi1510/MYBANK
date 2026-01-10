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
    console.log(res.data);
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

export interface Transaction {
  id: number;
  account_number: string;
  transaction_type: string;
  amount: number;
  from_account: string | null;
  to_account: string | null;
  description: string | null;
  status: string;
  currency:string;
  created_at: string;
  initiated_by_user: number | null;
  initiated_by_staff: number | null;
}
export const getMyTransactionHistory=async(start_date?:string,end_date?:string):Promise<Transaction[]|[]>=>{
  try {
    const res=await API.get("history",{params:{
      start_date,
      end_date
    }})

    if(res.data.status){
      return res.data.transactions;
    }else{
      toast.error(res.data.message);
      return [];
    }
  }catch (error) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "Transfer error";
    toast.error(msg);
    return [];
  }
} 


export const downloadStatementAPI = async (start_date?: string,end_date?: string) => {
  try {
    const res = await API.get("/download-statement", {
      params: { start_date, end_date },
      responseType: "blob",  
    });

    const pdfBlob = new Blob([res.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(pdfBlob);

     window.open(url, "_blank");

     setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

  } catch (error) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg =
      axiosErr.response?.data?.message || "Statement download failed";
    toast.error(msg);
  }
};