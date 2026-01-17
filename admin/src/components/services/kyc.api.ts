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

export const getKYCsAPI=async():Promise<PendingKYC|[]>=>{
  try {
    const res=await API.get("pending");
    if(res.data.status) return res.data.data;
    toast.error(res.data.message);
    return [];

  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "can not create KYC";
    toast.error(msg);
    return [];
  }
}

export const updateKycStatusAPI=async(kyc_id:number,status:string,reason?:string):Promise<boolean>=>{
    try {
      const res=await API.put(`${kyc_id}/status`,{status,reason});
      if(res.data.status){
        toast.success(res.data.message);
        return true;
      }else{
        toast.error(res.data.message);
        return false;
      }
    }catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "can not create KYC";
    toast.error(msg);
    return false;
  }
}
export interface KYCItem {
  kyc_id: number;
  customer_id: number;
  name: string;
  account_number: string;
  pan_number: string;
  aadhaar_last4: string;
  kyc_status: "PENDING" | "VERIFIED" | "REJECTED";
  verified_by: number | null;
  verified_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export const getAllKYCAPI=async():Promise<KYCItem[]|[]>=>{
  try {
    const res=await API.get("all-kyc");
    if(res.data.status) return res.data.data;
    toast.error(res.data.message);
    return [];
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "can not create KYC";
    toast.error(msg);
    return  [];
  }
}
export interface KYCDetail{
    kyc_id: number;
    name: string;
    email: string;
    mobile_number: string;
    pan_number: string;
    aadhaar_last4: string;
    kyc_type: string;
    kyc_status: string;
    rejection_reason: string | null;
};

export const getKYCById=async(kyc_id:number):Promise<KYCDetail|null>=>{
  try {
      const res=await API.get(`${kyc_id}`);
      if(res.data.status) return res.data.kyc;
      toast.error(res.data.message);
      return null;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "can not create KYC";
    toast.error(msg);
    return null;
  }
}