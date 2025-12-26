import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/loan/",
  withCredentials:true
})

API.defaults.withCredentials=true;

export interface AllLoanRequest {
  userName: string;
  mobileNumber: string;
  aadharCardNumber: string;
  panNumber: string | null;
  accountNumber: string;
  accountType: string;
  balance: string;
  loanType: string;
  status: string;
  loan_id:string
}
export const getLoanReqAPI=async():Promise<AllLoanRequest[]|[]>=>{
  try {
    const res=await API.get("new-loan-req");

    if(res.data.status){
      return res.data.data;
    }else{
      toast.error(res.data.message);
      return [];
    }
  } catch (error:unknown) {
    const axiosErr=error as AxiosError<{message?:string}>;
    const msg=axiosErr.response?.data?.message || "get new loan request error";
    toast.error(msg);
    return [];
  }
}