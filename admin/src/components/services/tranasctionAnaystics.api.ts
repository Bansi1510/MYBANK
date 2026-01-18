import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';


const API = axios.create({
  baseURL: "http://localhost:1510/api/v1/transaction-anaytics/",
  withCredentials: true
})

API.defaults.withCredentials=true;
export interface Transaction {
  id: number;
  from_account: string | null;
  to_account: string | null;
  amount: number;
  transaction_type:
    | "credit"
    | "deposit"
    | "transfer"
    | "upi"
    | "card"
    | "loan_payment";
  created_at: string;
}
export const getAllTransactionsAPI=async():Promise<Transaction[]|[]>=>{
  try {
    const res=await API.get("all");
    if(res.data.status) return res.data.data;
    toast.error(res.data.message);
    return [];
  }catch(error:unknown) {
      const axiosErr=error as AxiosError<{message?:string}>;
       const msg=axiosErr.response?.data.message||" tarnsaction failed ";
       toast.error(msg);
       return [];
  }
}
export interface Summary {
  total_transactions: number;
  total_amount: number;
  total_deposit: number;
  total_withdraw: number;
}

export interface MonthlyData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export interface DailyData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export interface AnalysisData {
  daily: DailyData;
  monthly: MonthlyData;
  typeDistribution: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  summary: Summary;
}

export const getTransactionAnalysisAPI=async():Promise<AnalysisData|null>=>{
  try {
    const res=await API.get("analysis");
    console.log(res.data.data);
    if(res.data.status) return res.data.data;

    toast.error(res.data.message);
    return null;
  }catch(error:unknown) {
      const axiosErr=error as AxiosError<{message?:string}>;
       const msg=axiosErr.response?.data.message||" tarnsaction failed ";
       toast.error(msg);
       return null;
  }
}