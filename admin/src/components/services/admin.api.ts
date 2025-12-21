import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/admin/",
  withCredentials:true
})
export interface AccountRequest {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  address: string;
  aadhar_number: string;
  pan_number: string;
  requested_account_type: string;
  initial_deposit: string;
  kyc_document_type: string;
  kyc_document_url: string;
  created_by: number;
  status: string;
  created_at: string;
}
export interface AddStaffData {
  name: string;
  email: string;
  role: "staff";
  mobile_number: string;
  password: string;
}


API.defaults.withCredentials=true;


export const getAllNewAccountReq=async():Promise<AccountRequest[]|null>=>{

  try {
    const res=await API.get("all-account-reqest?status=pending");

    if(res.data.status){
      return res.data.data;
    }else{
      toast.error(res.data.message);
      return null;
    }
  } catch (error: unknown) {
        const axiosErr = error as AxiosError<{ message?: string }>;
        const msg = axiosErr.response?.data?.message || "New Account Error";
        toast.error(msg);
        return null;
      }
};


export const addStaffAPI=async(staffdata:AddStaffData):Promise<boolean>=>{
  
  try {
      const res=await API.post("add-staff",staffdata);

      if(res.data.status){
        toast.success(res.data.message);
        return true;
      }else{
        toast.error(res.data.message);
        return false;
      }
  } catch (error: unknown) {
        const axiosErr = error as AxiosError<{ message?: string }>;
        const msg = axiosErr.response?.data?.message || "Add staff Error";
        toast.error(msg);
        return false;
      }
}