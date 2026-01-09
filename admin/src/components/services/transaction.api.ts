import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/transactions/",
  withCredentials:true
})

API.defaults.withCredentials=true;

export interface AcctoAcc{
    from_account: string;
    to_account: string;
    amount: number;
    description: string;
}

export const staffAcctoAccTransferAPI=async(payload:AcctoAcc):Promise<boolean>=>{
  try {
    const res=await API.post("/staff/transaction",payload);

    if(res.data.status){
      toast.success(res.data.message);
      return true;
    }else{
      toast.error(res.data.message);
      return false;
    }
  }catch (error:unknown) {
      const axiosErr=error as AxiosError<{message?:string}>;
       const msg=axiosErr.response?.data.message||" tarnsaction failed ";
       toast.error(msg);
       return false;
  }
}
export interface CashWithdraw{
  account_number:string,
  amount:number,
  transaction_type:string,
  description:string
}

export const cashTransactionByStaff=async(payload:CashWithdraw):Promise<boolean>=>{
  try {
      const res=await API.post('/staff/cash-transaction',payload);
      if(res.data.status){
        toast.success(res.data.message);
        return true;
      }else{
        toast.error(res.data.message);
        return false;
      }
  }catch (error:unknown) {
      const axiosErr=error as AxiosError<{message?:string}>;
       const msg=axiosErr.response?.data.message||"tarnsaction failed  ";
       toast.error(msg);
       return false;
  }
}
export interface Transaction {
  id: number;
  account_number: string;
  transaction_type: string;
  amount: number;
  from_account: string | null;
  to_account: string | null;
  description: string | null;
  status: string;
  created_at: string;
  initiated_by_user: number | null;
  initiated_by_staff: number | null;
}
export const getTransactionDetailsByAccNo=async(account_number:string,start_date?:string,end_date?:string):Promise<Transaction[]|[]>=>{
  try {
    const res=await API.get("acc-transactions",{params: {account_number,start_date,end_date,}});
    if(res.data.status){
      return res.data.transactions;
    }else{
      toast.error(res.data.message);
      return []
    }
  }catch (error:unknown) {
      const axiosErr=error as AxiosError<{message?:string}>;
       const msg=axiosErr.response?.data.message||"we can not fetch account transactions ";
       toast.error(msg);
       return [];
  }
}