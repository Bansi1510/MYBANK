import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: "http://localhost:1510/api/v1/kyc/",
  withCredentials: true
});

API.defaults.withCredentials = true;
export interface PendingKYC {
  kyc_id: number;
  name: string;
  pan_number: string;
  kyc_status: string;
  created_at: string;
}
export const createKycAPI = async (account_number:string,pan_number:string,aadhaar_last4:string): Promise<boolean> => {
  try {
    const res=await API.post("create",{account_number,pan_number,aadhaar_last4});
    if(res.data.status) return true;
    toast.error(res.data.message);
    return false;
    
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "can not create KYC";
    toast.error(msg);
    return false;
  }
}