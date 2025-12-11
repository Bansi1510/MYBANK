import axios, { AxiosError } from 'axios';
 import { toast } from 'react-toastify';


const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/staff/",
  withCredentials:true
})

API.defaults.withCredentials=true;
export interface formDataInterFace {
  name: string;
  email: string;
  mobile_number: number | "";
  address: string;
  aadhar_number: number | "";
  requested_account_type: string;
  pan_number: string;
  initial_deposit: number | "";
  kyc_document_type: string;
  kyc_document_url: string;
  created_by?: number;  
}


export const newAccountReqAPI=async(formData:formDataInterFace):Promise<boolean>=>{
  try {
      const res=await API.post("new-account",formData);

    if(res.data.status){
        toast.success(res.data.message);
        return true;
    }else{
      toast.error(res.data.message);
      return false;
    }
  } catch (error: unknown) {
      const axiosErr = error as AxiosError<{ message?: string }>;
      const msg = axiosErr.response?.data?.message || "Login Error";
      toast.error(msg);
      return false
    }
  }

