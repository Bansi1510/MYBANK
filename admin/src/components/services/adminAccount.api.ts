import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
 

const API = axios.create({
  baseURL: "http://localhost:1510/api/v1/account/",
  withCredentials: true
})

API.defaults.withCredentials = true;

export interface AccountHistory {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  aadhar_number: string;
  requested_account_type: string;
  final_status: "approved" | "rejected";
  decided_by: number;
  decided_at: string;
};
export type AccountStatus = "active" | "closed" | "suspended";

export interface Account {
  name: string;
  mobile_number: string;
  aadhar_number: string;
  pan_number: string | null;
  account_number: string;
  account_type: "savings" | "current";
  status: AccountStatus;
}

export interface AccountDetails {
  account_id: number;
  account_number: string;
  account_type: string
  balance: string; 
  status:string;
  account_created_at: string;
  user_id: number;
  name: string;
  email: string;
  mobile_number: string;
  address: string;
  aadhar_number: string;
  pan_number: string | null;
  kyc_verified: boolean;
  kyc_method: string | null;
  kyc_document_url: string | null;
  user_created_at: string;
}


export const changeAccountStatusAPI = async (req_no: number,action:string): Promise<boolean> => {
  try {
    const res = await API.put(`change-status/${req_no}`,{action});

    if (res.data.status) {
      toast.success(res.data.message);
      return true;
    } else {
      toast.error(res.data.message);
      return false;
    }
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "New Account Error";
    toast.error(msg);
    return false;
  }
}

export const newAccHisAPI=async():Promise<AccountHistory[]|[]>=>{
  try {
    const res=await API.get("new-acc-req-his");

    if(res.data.status){
      toast.success(res.data.message);
      return res.data.data;
    }else{
      toast.error(res.data.message);
      return [];
    }
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "New Account Error";
    toast.error(msg);
    return [];
  }
}

export const getAccByStatus=async(status:string):Promise<Account[]|[]>=>{
  try {
    const res=await API.get(`all-acc?status=${status}`)
    if(res.data.status){
      toast.success(res.data.message);
      return res.data.data;
    }else{
      toast.error(res.data.message);
      return [];
    }
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "New Account Error";
    toast.error(msg);
    return [];
  }
}

export const getUserByAccNumber=async(accNumber:string):Promise<AccountDetails|null>=>{
    try {
      const res= await API.get(`${accNumber}`);

      if(res.data.status){
        return res.data.data;
      }else{
        return null;
      }
    } catch (error) {
          const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "Fetch Account Error";
    toast.error(msg);
    return null;
    }
}